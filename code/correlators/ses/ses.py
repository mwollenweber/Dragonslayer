#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"
__copyright__ = "Matthew Wollenweber 2011"

try: 
    import time, thread, MySQLdb, sys, urllib2, os, traceback, csv
    import StringIO
    import json

except ImportError:
    print "error"
    import simplejson as json
    
class correlator():
    def __init__(self, conn = None, config = None):
        print "in ses stub correlator init"
        if config != None:
            self.username = config["username"]
            self.password = config["password"]
            self.up_interval = config["update"]
            self.base_url = config["base_url"]
            self.feed_pages = config["feed_pages"]
            
        if conn != None:
            self.conn = conn
            self.cursor = conn.cursor()
            
            
        
    def correlate(self):
        print "i should do some correlation"
        
    def update(self):
        print "updating ses"
        try:
            pass_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
            pass_mgr.add_password(None, self.base_url, self.username, self.password)
            handler = urllib2.HTTPBasicAuthHandler(pass_mgr)
            opener = urllib2.build_opener(handler)
            urllib2.install_opener(opener)
            
            for page in self.feed_pages:     
                print "i want page...%s" % page
                if page.find("cncip") >= 0:
                    print "loading ses cncip"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    #data = f.read()
                    self.update_cncip(f)
                    
                elif page.find("httpcnc") >= 0:
                    print "loading ses http cnc"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    self.update_httpcnc(f)
                    
                elif page.find("phishing-url") >= 0:
                    print "loading ses phishing url"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    #data = f.read()
                    self.update_phishingurl(f)
                    
                else:
                    print "unknown ses page"
        except:
            print "error loading ses record"
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                
     
    def update_sesmalware(self, data):
        print "updating ses malware"
        
    def update_sesdomains(self, data):
        print "ses domains"
        
    def update_sesdns(self, data):
        print "asdfs"
        
    def update_phishingurl(self, data):
        print "updating phishing url"
        
    def update_httpcnc(self, data):
        print "updating ses http cnc"
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)
        
        for row in reader:
            if len(row) < 8 or row[0][0].find("#") >= 0:
                continue
        
            sha1 = row[0].strip()
            md5 = row[1].strip()
            timestamp = row[2].strip()
            ip = row[3].strip()
            tpe = row[4].strip()
            asn = row[5].strip()
            if asn.isdigit() == False:
                asn = str(0)
                
            cc = row[6].strip()
            url = row[7].strip()
            
            query = '''INSERT INTO seshttpcnc (sha1, md5, tdstamp, ip, asn, cc, url) VALUES ('%s', '%s', DATE('%s'), INET_ATON('%s'), %s, '%s', '%s') ON DUPLICATE KEY UPDATE tdstamp=tdstamp''' % (sha1, md5, timestamp, ip,  asn, cc, url)
            #print "query = %s" % query
            
            self.cursor.execute(query)
            
            
    def update_cncip(self, data):
        print "updating cncip"
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)
        
        for row in reader:
            if len(row) < 10 or row[0][0].find("#") >= 0:
                continue
            
            asn = row[0].strip()
            description = row[1].strip()
            ip = row[2].strip()
            protocol = row[3].strip()
            port = row[4].strip()
            discovered = row[5].strip()
            expiration = row[6].strip()
            category = row[7].strip()
            hasssl = row[8].strip()
            services = row[9].strip()
            comments = row[10].strip()
            
            query = '''INSERT INTO sescncip (asn, description, ip, protocol, discovered, expiration, category, comments) VALUES (%s, '%s', INET_ATON('%s'), '%s', DATE('%s'), DATE('%s'), '%s', '%s') ON DUPLICATE KEY UPDATE expiration = expiration''' % (asn, description, ip, protocol, discovered, expiration, category, comments)
            #print "query = %s" % query
            
            self.cursor.execute(query)
            
        print "DONE inserting sescncip"
            
    def load(self):
        print "in ses load stub"