#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"

try: 
    import os, sys, csv, zipfile, getopt, traceback, socket, urlparse, time
    from threading import Thread
    import StringIO
    import json

except ImportError:
    print "error"
    import simplejson as json
    
class ingestor():
    def __init__(self, conn = None):
        print "init self"
        self.urls = []
        self.conn = conn
        self.curs = self.conn.cursor()
        
    def update_shadow_ccdns(self, data):
        print "cannot yet load shadow_ccdns"

    def update_shadow_ccfull(self, data):
        print "loading - ccfull"
        line_num = -1
        
        for line in data:
            line_num = line_num + 1
            
            line = line.lower()
            line = line.replace('-', '')
            vals = line.split(':')

            for i in range(0, len(vals)):
                vals[i] = vals[i].strip()
                
            try:
                self.cursor.execute('''INSERT INTO shadow_ccfull (tdstamp, ip, dport, fqdn, asn, country)
                                       VALUES(NOW(), INET_ATON(%s), %s, %s, %s, %s)
                                       ON DUPLICATE KEY UPDATE tdstamp=tdstamp''', vals) 
            except:
                print "error loading shadow_ccfull record line = %s" % line_num
                #exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                #traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                continue
    

    def update(self):
        self.urls.append('http://www.shadowserver.org/ccdns.php')
        self.urls.append('http://www.shadowserver.org/ccfull.php')
        self.urls.append('http://www.shadowserver.org/ccip.php')

        for u in self.urls:
            f = urllib2.urlopen(u)
            self.update_shadow_feeds(f, u)
            
    def update_shadow_ccip(self, data):
        print "cannot load shadow_ccip"

    def update_shadow_feeds(self, data, url):
        print "loading shadow"
        print "url = %s\n" % url
        
        if url.find('dns') > 1:
            self.load_shadow_ccdns(data)
        elif url.find('ccfull') > 1:
            self.load_shadow_ccfull(data)
        elif url.find('ccip') > 1:
            self.load_shadow_ccip(data)