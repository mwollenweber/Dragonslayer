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

    def load_mdl(self, data):
        print "loading mdl"
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
                continue
    
    def load_mac(self, data_blob=None, mac_file=None):
        import re

        msg = ""
        regex = re.compile('([a-fA-F0-9]{2}[:|\-]?){6}')
        
        if data_blob == None:
            if mac_file != None:
                reader = csv.reader(open(mac_file, "r"), delimiter=',', quoting=csv.QUOTE_NONE)
                file_status = 1
                msg+= "no data blob"
            else:
                msg+="fuck off\n you have to supply a blob or a file"
                
        else:
            msg+="got data blob"
            import StringIO
            data_stream = StringIO.StringIO(data_blob)
            reader = csv.reader(data_stream, delimiter=',', quoting=csv.QUOTE_NONE)
        
        for row in reader:
            try:
                mac = regex.search(row[1]).group(0)
                mac = mac.replace(":", "")
                mac = "0x" + mac
                mac = int(mac, 16)
                dev_name = row[2].strip()
                
                if mac != None:
                    self.cursor.execute('''INSERT INTO mac_lookup(mac_addr, dev_name) VALUES(%s, %s)''', [mac, dev_name.lower()])
                    #print mac
            except:
                continue

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

    def update_mdl(self):
        mdlurl = "http://www.malwaredomainlist.com/export.csv"
        f = urllib2.urlopen(mdlurl)
                    
        self.load_mdl(f)

    def update_shadow(self):
        shadow_url = []
        shadow_url.append('http://www.shadowserver.org/ccdns.php')
        shadow_url.append('http://www.shadowserver.org/ccfull.php')
        shadow_url.append('http://www.shadowserver.org/ccip.php')

        for url in shadow_url:
            f = urllib2.urlopen(url)
            self.load_shadow(f, url)
        
    def update_patchy(self, data_blob=None):
        self.patchy_success = False
        file_status = 0 #closed
        msg = ""

        #"Device Name","IP Address","Status","OS Info","Version","Group List","Agent Install Date","Last Contact Date","Queued Deployments"
        if data_blob == None:
            reader = csv.reader(open(patchy_export, "r"), delimiter=',', quoting=csv.QUOTE_MINIMAL)
            file_status = 1
            msg+= "ERRPR: no data blob"
        else:
            msg+="SUCCESS: got data blob"
            import StringIO
            data_stream = StringIO.StringIO(data_blob)
            reader = csv.reader(data_stream, delimiter=',', quoting=csv.QUOTE_MINIMAL)
        
        count = 0
        
        for row in reader:
            try:
                dev = row[0]
                dev = dev.replace('"', '')
                dev = dev.replace("\\", "\\\\")
                dev = dev.strip()
                dev = dev.lower()
                                
                ip = row[1]
                ip = ip.replace('"', '')
                ip = ip.strip();
                ip = ip.lower()
                
                update = row[6]
                update = update.replace('"', '')
                update = update.strip()
                update = update.lower()

                #print "got ip=%s, dev=%s, update=%s\n" % (ip, dev, update)
                query = '''INSERT INTO patchy(ip, dev_name, tdstamp) VALUES (INET_ATON('%s'), '%s', '%s') ON DUPLICATE KEY UPDATE tdstamp=VALUES(tdstamp)''' % ( ip, dev, update)      
                #print "query = " + query
                self.cursor.execute(query) 
                count = count + 1
                
            except:
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                print "error loading patchy record - skipping one record"
                #msg += "error loading patchy record - skipping one record"
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)

        msg+= "SUCCESS: " + str(count) + " records loaded"
        self.patch_success = True
        
        return msg
        

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
