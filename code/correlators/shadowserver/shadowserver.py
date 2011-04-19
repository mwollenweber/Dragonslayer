#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"

try: 
    import os, sys, csv, zipfile, getopt, traceback, socket, urlparse, time, urllib2
    from threading import Thread
    import StringIO
    import json

except ImportError:
    print "error"
    import simplejson as json
    
class correlator():
    def __init__(self, conn = None):
        print "init self"
        self.urls = []
        self.conn = conn
        if conn != None:
            self.cursor = self.conn.cursor()
            
    def correlate(self):
        print "I should do some correlation"
        print "trying..."
        self.correlate_shadow()
        
    def correlate_shadow(self):
        queries = []
        queries.append("DELETE FROM TABLE ids_shadow_correlation")
        queries.append("DELETE VIEW IF EXISTS shadow_ccfull_working")
        queries.append('''CREATE VIEW AS shadow_ccfull_working (SELECT * from shadow_ccfull where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 30) and CURDATE())''')
        
        queries.append('''
        INSERT INTO  ids_shadow_correlation (
        SELECT dragon_working.tdstamp, dragon_working.event, dragon_working.srcip, dragon_working.dstip, 'ShadowServer'
        from dragon_working, shadow_ccfull_working
        where
        dstip = ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and event not like 'GWU-TEST-Random'
        and  DATE(dragon_working.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
        and  DATE(shadow_ccfull_working.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE())''')

        
        queries.append('''
        INSERT INTO  ids_shadow_correlation (
        SELECT dragon_working.tdstamp, dragon_working.event, dragon_working.dstip, dragon_working.srcip, 'ShadowServer'
        from dragon_working, shadow_ccfull_working
        where
        srcip = ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and event not like 'GWU-TEST-Random'
        and  DATE(dragon_working.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
        and  DATE(shadow_ccfull_working.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE())''')
                        
        for q in queries:
            self.cursor.execute(q)
        
    def update(self):
        #self.urls.append('http://www.shadowserver.org/ccdns.php')
        #self.urls.append('http://www.shadowserver.org/ccfull.php')
        #temp for ss ip restriction
        self.urls.append('http://www.cyberwart.com/ccfull.php')
        #self.urls.append('http://www.shadowserver.org/ccip.php')

        for u in self.urls:
            f = urllib2.urlopen(u)
            self.update_shadow_feeds(f, u)
            
    def load(self):
        print "the shadow ingestor loads on update...continuing"
        
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
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                continue
    
            
    def update_shadow_ccip(self, data):
        print "cannot load shadow_ccip"
        
    def update_shadow_ccdns(self, data):
        print "cannot load shadow_ccdns"

    def update_shadow_ccfull_working(self):
        queries = []
        queries.append("DROP VIEW IF EXISTS shadow_ccfull_working")
        queries.append("CREATE VIEW shadow_ccfull_working AS (SELECT * from shadow_ccfull where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 30) and CURDATE())")
        
        for q in queries:
            self.cursor.execute(q)
     
    def verify_interval(self):
        print "I need to verify i'm not going too fast"
        
    def update_shadow_feeds(self, data, url):
        print "loading shadow - uh DUMBASS CHECK THE TIME DATE FEATURE"
        self.verify_interval()
        
        print "url = %s\n" % url
        
        if url.find('dns') > 1:
            self.update_shadow_ccdns(data)
        elif url.find('ccfull') > 1:
            self.update_shadow_ccfull(data)
        elif url.find('ccip') > 1:
            self.update_shadow_ccip(data)