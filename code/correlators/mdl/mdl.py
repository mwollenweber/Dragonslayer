#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv

class correlator():
    def __init__(self, conn = None, config = None):
        print "init self"
        self.conn = conn
        self.cursor = self.conn.cursor()     
        
    def delete(self):
        query = "DELETE FROM ids_mdl_correlation"
        self.cursor.execute(query)
        self.conn.commit()
        
    def correlate(self):
        self.delete()
        self.correlate_mdl()
        print "Completed mdl correlation"
        
    def update(self):
        #mdlurl = "http://www.malwaredomainlist.com/export.csv"
        mdlurl = "http://www.malwaredomainlist.com/updatescsv.php"
        
        f = urllib2.urlopen(mdlurl)                 
        self.load(f)
        
    def load(self, data):
        reader = csv.reader(data, delimiter=',', quotechar='"')
        for row in reader:
            if len(row) < 6:
                print "ERROR: Invalid MDL Record"
                continue
            
            for i in range(0, len(row)):
                row[i] = row[i].lower()
                row[i] = row[i].strip()
                
            tdstamp = row[0]
            url = row[1]  
            ip = row[2]
            lookup = row[3]
            description = row[4]
            registrant = row[5]

            #if date or ip is clearly invalid
            if len(tdstamp) < 3 or len(ip) < 3:
                continue

            try:
                self.cursor.execute('''INSERT INTO mdl(mdl.tdstamp,mdl.url, mdl.ip, mdl.lookup, mdl.description, mdl.registrant)
                                       VALUES(%s, %s, INET_ATON(%s), %s, %s, %s)
                                       ON DUPLICATE KEY UPDATE tdstamp=tdstamp''', (tdstamp, url, ip, lookup, description, registrant)) 
            except:
                print "ERROR: Invalid MDL Record = %s" % row
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                continue
            
        self.conn.commit()
        print "DONE with loading mdl"
    
    def correlate_mdl(self):
        queries = []
        
        queries.append('''DELETE FROM temp_mdl''')
        queries.append('''INSERT INTO temp_mdl (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, mdl.description
        from dragon, mdl
        where
        dstip = ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 1) and ADDDATE(CURDATE(),1)
        and  DATE(mdl.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE()
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event''')
        
        
        queries.append('''INSERT INTO temp_mdl (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.dstip, dragon.srcip, mdl.description
        from dragon, mdl
        where
        srcip = ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 1) and ADDDATE(CURDATE(),1)
        and  DATE(mdl.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE()
        GROUP BY dragon.dstip, dragon.srcip, dragon.event
        ORDER BY dragon.dstip, dragon.srcip, dragon.event''')
        
        queries.append("DELETE FROM ids_mdl_correlation")
        queries.append('''INSERT INTO ids_mdl_correlation (ids_mdl_correlation.tdstamp, ids_mdl_correlation.event, ids_mdl_correlation.victim, ids_mdl_correlation.attacker, ids_mdl_correlation.description) select temp_mdl.tdstamp, temp_mdl.event, temp_mdl.victim, temp_mdl.attacker, temp_mdl.description from temp_mdl ON DUPLICATE KEY UPDATE ids_mdl_correlation.tdstamp=temp_mdl.tdstamp''')
        queries.append("DELETE FROM temp_mdl")


        try:
            for q in queries:
                #print "QUERY: %s" % q
                self.cursor.execute(q)
            
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            print "error updating temp/hourly mdl\n"
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
        self.conn.commit()
            
    def get_daily_dragon_mdl(self):
        self.cursor.execute('''select dragon.tdstamp, dragon.event, INET_NTOA(dragon.srcip), INET_NTOA(dragon.dstip)  from dragon, mdl where srcip = ip and ((dstip < 2717712641 or dstip > 2717726975) and (dstip < 2158256129 or dstip > 2158257919)) and event not like "GWU-TEST-Random" and event not like "mjw-gwu-http-pdf-alpha" and  DATE(dragon.tdstamp) between CURDATE() and CURDATE()+1 GROUP BY dragon.dstip ORDER BY dragon.dstip, dragon.srcip, dragon.event''')
        

        