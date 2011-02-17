#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv

class db_config:
    host = "localhost"
    user = "dragonslayer"
    passwd = "slayer"
    db = "dragonslayer"

    load_mdl_sql = ""
    lock_file = "/tmp/dragonslayer_lock"
    log_file = "/home/dragonslayer/log/ds.log"
    

class dragonslayer:
    """ A basic class to maintain db connectivity and do a little sanity checking on file uploads"""

    def db_connect(self):
        mydbinfo = db_config()
        self.conn = MySQLdb.connect(host = mydbinfo.host,
                               user = mydbinfo.user,
                               passwd = mydbinfo.passwd,
                               db = mydbinfo.db)

        self.cursor = self.conn.cursor()
        print "db connection succeeded"
 
        

    def load_dragon_events(self):
        load_list = []
        file_list = os.listdir(self.dragon_path)
        #load_file = self.dragon_path + self.load_file

        
        for x in file_list:
            if x.find(self.dragon_log_prefix) >= 0:
                if x.find(self.dragon_log_exclude) < 0:
                    mod_time = os.path.getmtime(self.dragon_path + x)
                    #fix me. lets do a query and update from the status table and not go quite so far back in time
                    if abs(time.time() - mod_time) < (60*60*8): 
                        load_list.append(self.dragon_path + x)

        for x in load_list:
            self.cursor.execute('''DELETE from tmp_dragon''')
            
            self.cursor.execute('''LOAD DATA LOCAL INFILE %s into TABLE tmp_dragon FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n"''', x)
            #self.cursor.execute('''DELETE FROM tmp_dragon where event LIKE "DYNAMIC-%" OR event LIKE "HEARTBEAT"''')
            self.cursor.execute('''INSERT INTO dragon
            (dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, dragon.sport, dragon.dport)
            SELECT
            tmp_dragon.tdstamp, tmp_dragon.event, INET_ATON(tmp_dragon.srcip), INET_ATON(tmp_dragon.dstip), tmp_dragon.sport, tmp_dragon.dport
            from tmp_dragon
            ON DUPLICATE KEY UPDATE dragon.tdstamp=tmp_dragon.tdstamp''')

            print "loaded: " + x

    def get_daily_dragon_mdl(self):
        self.cursor.execute('''select dragon.tdstamp, dragon.event, INET_NTOA(dragon.srcip), INET_NTOA(dragon.dstip)  from dragon, mdl where srcip = ip and ((dstip < 2717712641 or dstip > 2717726975) and (dstip < 2158256129 or dstip > 2158257919)) and event not like "GWU-TEST-Random" and event not like "mjw-gwu-http-pdf-alpha" and  DATE(dragon.tdstamp) between CURDATE() and CURDATE()+1 GROUP BY dragon.dstip ORDER BY dragon.dstip, dragon.srcip, dragon.event''')
        
    
    def __init__(self):
        print "initializing dragonslayer"
        self.db_con = self.db_connect()
        self.dragon_path = '/home/dragonslayer/dragon_db/'
        self.dragon_load_file = 'dragon_load.log'
        self.dragon_log_prefix = 'dragon.log'
        self.dragon_log_exclude = '.gz'
        self.dragon_log_processed = []
        self.patchy_success = None

    def generate_hourly_bad(self):
        print "generating hourly bad list"

        q_del1 = "DELETE from dragon_working"
        q_del2 = "DELETE from shadow_ccfull_working"

        q1 = '''INSERT into shadow_ccfull_working (SELECT * from shadow_ccfull where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 30) and CURDATE())'''
        q2 = '''INSERT INTO dragon_working (SELECT * from dragon where DATE(tdstamp) = CURDATE())'''

        q_del3 = '''DELETE FROM dragon_working where event like "DYNAMIC-%"'''
        q_del4 = '''DELETE from hourly_dragon_bad'''

        q3 = '''
        INSERT INTO  hourly_dragon_bad (
        SELECT dragon_working.tdstamp, dragon_working.event, dragon_working.srcip, dragon_working.dstip, 'ShadowServer'
        from dragon_working, shadow_ccfull_working
        where
        dstip = ip and ((srcip < 2717712385 or srcip > 2717726975)
           and (srcip < 2158256129 or srcip > 2158257919))
           and event not like 'GWU-TEST-Random'
           and  DATE(dragon_working.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
           and  DATE(shadow_ccfull_working.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE())'''

        q4 = '''
        INSERT INTO  hourly_dragon_bad (
        SELECT dragon_working.tdstamp, dragon_working.event, dragon_working.dstip, dragon_working.srcip, 'ShadowServer'
        from dragon_working, shadow_ccfull_working
        where
        srcip = ip and ((dstip < 2717712385 or dstip > 2717726975)
           and (dstip < 2158256129 or dstip > 2158257919))
           and event not like 'GWU-TEST-Random'
           and  DATE(dragon_working.tdstamp) between CURDATE() and ADDDATE(CURDATE(),1)
           and  DATE(shadow_ccfull_working.tdstamp) between SUBDATE(CURDATE(), 60) and CURDATE())'''


        q5 = '''INSERT INTO hourly_dragon_bad (select * from hourly_dragon_mdl)'''
        
        try:
                      
            update_check_tdq = '''SELECT TIME_TO_SEC(TIMEDIFF(NOW(), last_update)) from status where name like "shadowcc"'''
            self.cursor.execute(update_check_tdq)
            update_age = self.cursor.fetchone()[0]
            
            update_check_iq = '''SELECT update_interval * 60 * 60 from status where name like "shadowcc"'''
            self.cursor.execute(update_check_iq)
            interval = self.cursor.fetchone()[0]

            print "lastupdate = %s interval = %s\n"  % ( update_age, interval)

            if update_age > interval:
                print "updating shadow"
                self.update_shadow()
                self.cursor.execute('''UPDATE status set last_update = NOW() where name like "shadowcc"''')
            else:
                print "shadow server data up to date enough"
                
            self.cursor.execute(q_del1)
            self.cursor.execute(q_del2)
            self.cursor.execute(q1)
            self.cursor.execute(q2)
            self.cursor.execute(q_del3)
            self.cursor.execute(q_del4)
            self.cursor.execute(q3)
            self.cursor.execute(q4)
            self.cursor.execute(q5)
            
            print "done updating hourly_dragon_bad"
            
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            print "error updating temp/hourly bad\n"
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)


                        
    def update_critical(self):
        critical_filename = "/home/dragonslayer/code/critical.nips"
        f = open(critical_filename, "r")
        q1 = '''INSERT INTO critical (ip) VALUES (%s)'''
        for line in f:
            self.cursor.execute(q1, [line])

        f.close()
        
    def shutdown(self):
        self.conn.close()
        #delete the lock file
        #should write to a log
