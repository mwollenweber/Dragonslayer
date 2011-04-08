#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''


class daily_bad():
    def __init__(self, conn = None, ids = None, cors = None):
        print "initializing daily bad correlator"
        self.conn = conn
        self.cursor = conn.cursor()
        
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
