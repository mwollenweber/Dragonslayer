#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

class dragon():
    def __init__(self, conn = None):
        print "initialized ids.dragon"
        self.conn = conn
        if self.conn != None:
            self.cursor = conn.cursor()
        else:
            self.cursor = None
            

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
            
            #fix me
            #delete dynamic events

            print "loaded: " + x

    def get_daily_dragon_mdl(self):
        self.cursor.execute('''select dragon.tdstamp, dragon.event, INET_NTOA(dragon.srcip), INET_NTOA(dragon.dstip)  from dragon, mdl where srcip = ip and ((dstip < 2717712641 or dstip > 2717726975) and (dstip < 2158256129 or dstip > 2158257919)) and event not like "GWU-TEST-Random" and event not like "mjw-gwu-http-pdf-alpha" and  DATE(dragon.tdstamp) between CURDATE() and CURDATE()+1 GROUP BY dragon.dstip ORDER BY dragon.dstip, dragon.srcip, dragon.event''')
        
   