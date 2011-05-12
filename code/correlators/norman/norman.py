#!/usr/bin/python
#dragonslayer.ingestors.norman
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"
__copyright__ = "Matthew Wollenweber 2010"

try: 
    import os, sys, csv, zipfile, getopt, traceback, socket, urlparse, time, ConfigParser, imaplib, email, StringIO
    from threading import Thread
    import json

except ImportError:
    print "error"
    import simplejson as json
    

    
class db_config:
    host = "localhost"
    user = "dragonslayer"
    passwd = "slayer"
    db = "dragonslayer"
    

class correlator():
    def __init__(self, conn = None, config = None):
        print "initializing norman correlator\n I love me some malware"
        
        if config != None:
            self.config_path = config["path"]
        else:
            self.config_path = "./"
        
        self.data = []
        self.hosts2ips = []
        self.mysql_conn = conn
        self.email_conn = None
        
        if conn != None:
            self.mysql_cursor = conn.cursor()
        else:
            self.mysql_cursor = None
            
        
        
    def load(self):
        print "Code to load the norman correlator should go here"
        
    def read_file(self, filename):
        try:
            f = open(filename, "r")
        except IOError:
            print "ERROR Opening: %s\n" % filename
            return None
        
        data = f.read()
        f.close()
        
        return data

    def connect_email(self):
        config = ConfigParser.RawConfigParser()
        config.read( self.config_path+ "/email.cfg")
        imap_server = config.get("email", "imap")
        smtp_server = config.get("email", "smtp")
        username = config.get("email", "username")
        passwd = config.get("email", "password")
        
        self.trusted_sender = config.get("norman", "sender")
        self.trusted_subject = config.get("norman", "subject")
        self.unseen = config.get("norman", "unseen")
        
        conn = imaplib.IMAP4_SSL(imap_server)
        conn.login(username,passwd)
        conn.select('Inbox')
        self.email_conn = conn
    
    def find_norman_emails(self):
        print "getting norman emails"
        unseen = ""
        search_query = '(FROM "info@mail.norman.no" SUBJECT "SandBox Reporter")'
        typ, data = self.email_conn.search(None, search_query)
        return data[0].split()
        
    def get_norman_zips(self, eids):
        attachments = []
        for i in eids:
            print "getting mail id = %s" % i 
            typ, data = self.email_conn.fetch(i, '(RFC822)')
            msg = email.message_from_string(data[0][1])
            attachments.append(self.getAttachment(msg))
            
        print "I have %s attachments" % len(attachments)
        return attachments
                  
    
    def getAttachment(self, msg):
        for part in msg.walk():
            if part.get_content_type() == 'application/octet-stream':
                return part.get_payload(decode=1)
    
    def update_from_email(self):
        print "updating norman from emails"
        self.connect_email()
        ids = self.find_norman_emails()
        zips = self.get_norman_zips(ids)
        
        for z in zips:
            zf = StringIO.StringIO(z)
            self.load_zipfile(filename = zf)
        
        self.update()
        
    def blob2dict(self, blob):
        data_stream = StringIO.StringIO(blob)
        reader = csv.reader(data_stream, delimiter=';', quoting=csv.QUOTE_MINIMAL)
        reader.next() #skip the first line
        
        for row in reader:
            try:
                url = row[0]
                md5 = row[1]
                originator_content = row[2]
                originator_signature = row[3]
                download_md5 = row[4]
                download_content = row[5]
                download_signature = row[6]
                download_sandbox = row[7]
                
                data = {"url":url, "md5":md5, "originator_content":originator_content, "originator_signature":originator_signature, "download_md5":download_md5, "download_content":download_content, "download_signature":download_signature, "download_sandbox":download_sandbox}
                self.data.append(data)
                
            except:
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                print "error reading norman record - skipping one record"
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
        data_stream.close()
        
    def open_zip(self, filename):
        zf = None
        f = zipfile.ZipFile(filename)
        
        for name in f.namelist():
            if name.find("url2") >= 0 and name.find("csv") > 0:
                zf = name
                break
        
        if zf == None:
            print "ERROR: couldn't find the url2  csv in the zip file"
            return None
        
        data = f.read(zf)
        return data
        
    def get_json(self, data):
        return json.dumps(data)
    
    def print_data(self, data = None):
        if data == None:
            data = self.data
        
        for line in data:
            print line
             
            
    def url2ips(self, url = None):
        if url != None:
            try:
                urlobj = urlparse.urlparse(url)
                return socket.gethostbyname_ex(urlobj.hostname)[2]
            except:
                print "error getting hostname"
                return ""
            
        host_list = []   
        for d in self.data:
            urlobj = urlparse.urlparse(d["url"])
            host_list.append(urlobj.hostname)
            #print "hostname = " + urlobj.hostname
             
        
        host_list = list(set(host_list))
        thread_list = []
        thread_count = 0
        for host in host_list:
            thread_list.append(hostlookup_thread(thread_count, host))
            thread_list[thread_count].start()
            thread_count = thread_count + 1

        time.sleep(10.0 + thread_count/15.0)
        
        for t in thread_list:
            t.join(2.0)
            if t.ret_hostlookup() != None:
                self.hosts2ips.append(t.ret_hostlookup())
                print t.ret_hostlookup()
            
        print "done with lookups"
            
    def mysql_connect(self):
        print "connecting to mysql"
        try:
            import MySQLdb
            mydbinfo = db_config()
            self.mysql_conn = MySQLdb.connect(host = mydbinfo.host, user = mydbinfo.user, passwd = mydbinfo.passwd, db = mydbinfo.db)
            self.mysql_cursor = self.mysql_conn.cursor()
            
        except:
            print "epic fail trying to connect to mysql"
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
    def update(self):
        print "pushing data to mysql"
        insert_query = "INSERT INTO norman_url (tdstamp, url, md5, originator_content, originator_signature, download_md5, download_content, download_signature, download_sandbox) VALUES (NOW(), '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s') ON DUPLICATE KEY UPDATE tdstamp=tdstamp"
        if self.mysql_conn == None:
            self.mysql_conn = self.mysql_connect()
            
        if self.data == None:
            print "you need to load data numnuts"
            return None
           
      
        for d in self.data:
            self.mysql_cursor.execute(insert_query % (d["url"], d["md5"], d["originator_content"], d["originator_signature"], d["download_md5"], d["download_content"], d["download_signature"], d["download_sandbox"])) 
    
    def update_hosts2ips(self):
        print "blegh"
        if self.mysql_conn == None:
            self.mysql_conn = self.mysql_connect()
            
        if len(self.hosts2ips) <= 0:
            print "you need to load data numnuts"
            return None
 
        query = "INSERT INTO host2ip (tdstamp, hostname, ip) VALUES (NOW(), '%s', INET_ATON('%s'))"
        for d in self.hosts2ips:
            hostname = d["hostname"]
            for ip in d["ips"]:
                self.mysql_cursor.execute(query % (hostname, ip))
            
    def load_zipfile(self, filename = None):
        try:
            blob = self.open_zip(filename)
            data = self.blob2dict(blob)
        except:
            print "error loading zipfile"
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
        return None
        
                
class hostlookup_thread(Thread):
    def __init__(self, myid, hostname):
        self.myid = myid
        self.hostname = hostname
        self.ret = None
        
        Thread.__init__(self)
        
    def run(self):
        self.ret = self.get_ips_from_hostname(self.hostname)
        
        
    def ret_hostlookup(self):
        return self.ret
    
    def get_ips_from_hostname(self, hostname):
        try:
            socket.setdefaulttimeout(3.0)
            host_ip = {"hostname":hostname, "ips": socket.gethostbyname_ex(hostname)[2]}
            return host_ip
        
        except socket.gaierror:
            #print "ERROR: ip unavailable for %s" % hostname
            return None
        
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)

                
    
            
def main():
    cfg = {"path":"../../conf/"}
    my_norman = correlator(config = cfg)
    my_norman.update_from_email()
    
    #my_norman = norman_ingestor(sys.argv[1])
    #my_norman.update()
    #my_norman.print_data()
    #my_norman.url2ips()
    #my_norman.update_hosts2ip()
     
            
if __name__ == "__main__":
    main()


    