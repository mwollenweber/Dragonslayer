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
        
    def correlate(self):
        print "I should do some correlation"
        
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
    
    def generate_hourly_mdl(self):
        #delete from hourly table
        delete_hourly = '''DELETE FROM hourly_dragon_mdl'''
        delete_temp = '''DELETE FROM temp_mdl'''
        
                
        q1 = '''INSERT INTO temp_mdl (tdstamp, event, victim, attacker, description)
                SELECT dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, mdl.description
                from dragon, mdl
                where
                dstip = ip and ((srcip < 2717712385 or srcip > 2717726975)
                and (srcip < 2158256129 or srcip > 2158257919))
                and event not like 'GWU-TEST-Random'
                and  DATE(dragon.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
                and  DATE(mdl.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE()
                GROUP BY dragon.srcip, dragon.dstip, dragon.event
                ORDER BY dragon.srcip, dragon.dstip, dragon.event'''
        
        q2 = '''INSERT INTO temp_mdl (tdstamp, event, victim, attacker, description)
                SELECT dragon.tdstamp, dragon.event, dragon.dstip, dragon.srcip, mdl.description
                from dragon, mdl
                where
                srcip = ip and ((dstip < 2717712385 or dstip > 2717726975)
                and (dstip < 2158256129 or dstip > 2158257919))
                and event not like 'GWU-TEST-Random'
                and  DATE(dragon.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
                and  DATE(mdl.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE()
                GROUP BY dragon.dstip, dragon.srcip, dragon.event
                ORDER BY dragon.dstip, dragon.srcip, dragon.event'''
        
        update_hourly_q = '''INSERT INTO hourly_dragon_mdl (hourly_dragon_mdl.tdstamp, hourly_dragon_mdl.event, hourly_dragon_mdl.victim, hourly_dragon_mdl.attacker, hourly_dragon_mdl.description) select temp_mdl.tdstamp, temp_mdl.event, temp_mdl.victim, temp_mdl.attacker, temp_mdl.description from temp_mdl ON DUPLICATE KEY UPDATE hourly_dragon_mdl.tdstamp=temp_mdl.tdstamp'''
        clean_hourly_q1 = '''DELETE from hourly_dragon_mdl where DATEDIFF(CURDATE(), DATE(tdstamp)) > 0''' 


        try:
            self.cursor.execute(delete_temp)
            self.cursor.execute(q1)
            self.cursor.execute(q2)
            self.cursor.execute(update_hourly_q)
            self.cursor.execute(clean_hourly_q1)
            
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            print "error updating temp/hourly mdl\n"
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
    def get_daily_dragon_mdl(self):
        self.cursor.execute('''select dragon.tdstamp, dragon.event, INET_NTOA(dragon.srcip), INET_NTOA(dragon.dstip)  from dragon, mdl where srcip = ip and ((dstip < 2717712641 or dstip > 2717726975) and (dstip < 2158256129 or dstip > 2158257919)) and event not like "GWU-TEST-Random" and event not like "mjw-gwu-http-pdf-alpha" and  DATE(dragon.tdstamp) between CURDATE() and CURDATE()+1 GROUP BY dragon.dstip ORDER BY dragon.dstip, dragon.srcip, dragon.event''')
        

        