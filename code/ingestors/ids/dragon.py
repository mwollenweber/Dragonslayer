#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv

class ingestor():
    def __init__(self, conn = None, config = None, debug = 1):
        print "initialized ids.dragon"
        self.conn = conn
        self.debug = debug
        
        if self.conn != None:
            self.cursor = conn.cursor()
        else:
            self.cursor = None
            
        if config != None:
            self.dragon_path = config["dragon_path"] 
            self.dragon_log_prefix = config["dragon_log_prefix"]
            self.dragon_log_exclude = config["dragon_log_exclude"]

            print "using dragonpath = %s" % self.dragon_path
            
    def update_dragon_working(self):
        queries = []
        queries.append("DROP VIEW IF EXISTS dragon_working")
        queries.append("CREATE VIEW dragon_working AS (SELECT * from dragon where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 2) AND CURDATE() )")
        
        for q in queries:
            self.cursor.execute(q)
        
        self.conn.commit()

    def clean_dragon(self):
        queries = []
        queries.append("DELETE FROM dragon WHERE event LIKE 'DYNAMIC%'")
        queries.append("DELETE FROM dragon where event LIKE '%Random%'")
        
        for q in queries:
            self.cursor.execute(q)
            
        self.conn.commit()
        
    def ingest(self):
        print "inside dragon ingestor...ingesting!"
        self.load()
        self.conn.commit()
        
    def load(self):
        load_list = []
        ct = 0
        #print self.dragon_path
        file_list = os.listdir(self.dragon_path)
        #load_file = self.dragon_path + self.load_file
        
        load_from_tmp_query  = '''
                               INSERT INTO dragon
                                    (dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, dragon.sport, dragon.dport)
                               SELECT
                                    tmp_dragon.tdstamp, tmp_dragon.event, INET_ATON(tmp_dragon.srcip), INET_ATON(tmp_dragon.dstip), tmp_dragon.sport, tmp_dragon.dport
                               from tmp_dragon
                               ON DUPLICATE KEY UPDATE dragon.tdstamp=tmp_dragon.tdstamp'''

        load_row_query       = '''INSERT INTO dragon
                                       (dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, dragon.sport, dragon.dport)
                                  VALUES
                                       (DATE(%s), %s, INET_ATON(%s), INET_ATON(%s), %s, %s) ON DUPLICATE KEY UPDATE dragon.tdstamp=tdstamp''' 
        
        for x in file_list:
            if x.find(self.dragon_log_prefix) >= 0:
                if x.find(self.dragon_log_exclude) < 0:
                    mod_time = os.path.getmtime(self.dragon_path + x)
                    #fix me. lets do a query and update from the status table and not go quite so far back in time
                    if abs(time.time() - mod_time) < (60*60*8): 
                        load_list.append(self.dragon_path + x)

                        
        for x in load_list:
            try:
                self.cursor.execute('''DELETE from tmp_dragon''')
                self.cursor.execute('''LOAD DATA LOCAL INFILE %s into TABLE tmp_dragon FIELDS TERMINATED BY "|" LINES TERMINATED BY "\n"''', x)
                self.cursor.execute('''DELETE FROM tmp_dragon where event LIKE "DYNAMIC%" OR event LIKE "HEARTBEAT"''')
                self.cursor.execute(load_from_tmp_query )

            except MySQLdb.OperationalError:
                print "ERROR: Unable to execute LOAD DATA LOCAL INFILE. Beginning manual insert."
                values = []
                try:
                    reader = csv.reader(open(x, "r"), delimiter='|', quotechar='"')
                    for row in reader:
                        ct += 1
                        if len(row)  > 6:
                            tdstamp = row[0]
                            sensor = row[1]
                            event = row[2]
                            src = row[3]
                            dst = row[4]
                            sport = row[5]
                            dport = row[6]
                                                
                            if event.find("DYNAMIC") >= 0:
                                continue
                            
                            values.append((tdstamp, event, src, dst, sport, dport))
   
                    self.cursor.executemany(load_row_query, values)
                    self.conn.commit()
                    print "Alternate load complete"
                    
                except:
                    print "ERROR: Failed to insert dragon record"
                    if self.debug == 1:
                        print "FILE = %s at row %s" % (x, ct)
                        exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                        traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                    continue
                        
            except:
                print "ERROR: Unable to load dragonfile - unhandled"
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                continue

        self.conn.commit()
        self.clean_dragon()     
        print "Done with load"
   