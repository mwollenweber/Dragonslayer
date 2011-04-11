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
    
class ingestor():
    def __init__(self, conn = None, conf = None):
        print "in ses stub ingestor init"
        if conf != None:
            self.username = conf["username"]
            self.password = conf["password"]
            self.up_interval = conf["update"]
            
        
    def update(self):
        print "ses update stub"
        '''
        https://secure.ren-isac.net/cgi-bin/feeds/bt-ses-phishing-url.cgi
        https://secure.ren-isac.net/cgi-bin/feeds/bt-ses-malware-url.cgi
        https://secure.ren-isac.net/cgi-bin/feeds/bt-ses-domains.cgi
        https://secure.ren-isac.net/cgi-bin/feeds/bt-dnsnames.cgi
        https://secure.ren-isac.net/cgi-bin/feeds/bt-cncip.cgi
        https://secure.ren-isac.net/cgi-bin/feeds/bt-httpcnc.cgi
        '''
        
    def load(self):
        print "in ses load stub"