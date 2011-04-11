#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv

class ingestor():
    def __init__(self, conn = None, config = None):
        print "init self"
        self.conn = conn
        self.cursor = self.conn.cursor()
        
        
    def update(self):
        mdlurl = "http://www.malwaredomainlist.com/export.csv"
        f = urllib2.urlopen(mdlurl)
                    
        self.load(f)
        
    def load(self, data):
        for line in data:
            line = line.lower()
            line = line.replace("\"", "")
            vals = line.split(",", 6)
            for i in range(0,6):
                vals[i] = vals[i].strip()

            #if date or ip is clearly invalid
            if len(vals[0]) < 3 or len(vals[2]) < 3:
                continue

            try:
                self.cursor.execute('''INSERT INTO mdl(mdl.tdstamp,mdl.url, mdl.ip, mdl.lookup, mdl.description, mdl.registrant)
                                       VALUES(%s, %s, INET_ATON(%s), %s, %s, %s)
                                       ON DUPLICATE KEY UPDATE tdstamp=tdstamp''', vals[0:6]) 
            except:
                print "error inserting into mdl"
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                continue
            

        