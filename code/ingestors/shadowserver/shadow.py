#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

from .. import dragonslayer

class shadow_ingestor(dragonslayer):
    def __init__(self):
        print "init self"
        
    def load_shadow_ccdns(self, data):
        print "cannot yet load shadow_ccdns"

    def load_shadow_ccfull(self, data):
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
    

    def update_shadow(self):
        shadow_url = []
        shadow_url.append('http://www.shadowserver.org/ccdns.php')
        shadow_url.append('http://www.shadowserver.org/ccfull.php')
        shadow_url.append('http://www.shadowserver.org/ccip.php')

        for url in shadow_url:
            f = urllib2.urlopen(url)
            self.load_shadow(f, url)
            
    def load_shadow_ccip(self, data):
        print "cannot load shadow_ccip"

    def load_shadow(self, data, url):
        print "loading shadow"
        print "url = %s\n" % url
        
        if url.find('dns') > 1:
            self.load_shadow_ccdns(data)
        elif url.find('ccfull') > 1:
            self.load_shadow_ccfull(data)
        elif url.find('ccip') > 1:
            self.load_shadow_ccip(data)