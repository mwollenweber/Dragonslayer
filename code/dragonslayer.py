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
 
        
 
    def __init__(self):
        print "initializing dragonslayer"
        self.db_con = self.db_connect()
        self.dragon_path = '/home/dragonslayer/dragon_db/'
        self.dragon_load_file = 'dragon_load.log'
        self.dragon_log_prefix = 'dragon.log'
        self.dragon_log_exclude = '.gz'
        self.dragon_log_processed = []
        self.patchy_success = None


                        
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
