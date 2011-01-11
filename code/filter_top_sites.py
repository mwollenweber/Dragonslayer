#!/usr/bin/python
#
import os, sys, StringIO, csv, zipfile, traceback, urllib2, urlparse

try:
    import MySQLdb
except:
    print "ERROR: unable to load all imports"
    sys.exit(-1)

class db_config:
    host = "localhost"
    user = "dragonslayer"
    passwd = "slayer"
    db = "dragonslayer"    
    
class TopSites:
    def __init__(self, maxl = 10000):
        self.max_list = maxl
        self.mysql_conn = None
        self.mysql_cursor = None
        self.top_sites = []
        self.alexa_link = "http://s3.amazonaws.com/alexa-static/top-1m.csv.zip"
        self.recent_ids_query = "select id from host2ip where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 14) and CURDATE()"
        
    def open_web_zip(self, infile):
        fstream = StringIO.StringIO(infile.read())
        zf = zipfile.ZipFile(fstream)
        data = zf.read('top-1m.csv')
       
        fstream.close()
        zf.close()
        
        return data
    
    def get_top_sites(self):
        f = urllib2.urlopen(self.alexa_link)
        data = self.open_web_zip(f)
        self.read_top_list(data)
        
        
    def read_top_list(self, data):
        data_stream = StringIO.StringIO(data)
        reader = csv.reader(data_stream, delimiter=',', quoting=csv.QUOTE_MINIMAL)
        count = 0
        
        for row in reader:
            try:
                if count < self.max_list: 
                    rank = row[0]
                    domain = row[1]
                    self.top_sites.append([rank, domain])
                    count +=1
                    
            except:
                continue
        
        print "pushed %s sites to top sites" % count
        data_stream.close()

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
            
    def push2mysql(self):
        print "pushing data to mysql"
        insert_query = "INSERT INTO topsites (tdstamp, site, rank) VALUES (NOW(), '%s', '%s')"
        if self.mysql_conn == None:
            self.mysql_conn = self.mysql_connect()
            
        if len(self.top_sites) < 1:
            print "you need to load data numnuts"
            return None
           
      
        for d in self.top_sites:
            #print insert_query % (d[1], d[0])
            self.mysql_cursor.execute(insert_query % (d[1], d[0]) )


mytopsites = TopSites()
mytopsites.get_top_sites()
mytopsites.push2mysql()

                
                