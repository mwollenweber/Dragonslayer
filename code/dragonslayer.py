#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv, ConfigParser

class db_config:
    host = "localhost"
    user = "dragonslayer"
    passwd = "slayer"
    db = "dragonslayer"

    load_mdl_sql = ""
    lock_file = "/tmp/dragonslayer_lock"
    log_file = "/home/dragonslayer/log/ds.log"
    

class dragonslayer:
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
        self.load_config()
        self.db_con = self.db_connect()
        self.dragon_log_processed = []
        self.patchy_success = None


    def load_config(self, path="./conf/"):
        print "loading config from %s" % path
        self.config = ConfigParser.ConfigParser()
        self.process_ds_config(path)
        
        
        
    def process_ds_config(self, path):
        print "loading ds config"
        config  = self.config
        config.readfp(open(path + "ds.cfg"))
        self.ids = config.get("dscnf", "ids")
        self.logfile = config.get('dscnf','logfile')
        self.db = config.get('dscnf','db')
        self.ingestors = []
        self.ingestors.append(config.get('dscnf','ingestors'))
        
        
        #load other relevant configs
        if self.ids == "dragon":
            print "need to load dragon config"
            self.process_dragon_config(path)
        
        if self.db == "mysql":
            print "need to load mysql config"
            
        for i in self.ingestors:            
            if i == "mdl":
                print "loading mdl ingestor"
                from ingestors import mdl
                
            if i == "ses":
                print "loading ses"
            
            if i == "malwareurl":
                print "loading malware url"
            
            if i == "shadow":
                print "loading shadow ingestor"
                
    
    def process_dragon_config(self, path):
        print "loadign dragon config"
        config = self.config
        config.readfp(open(path + "dragon.cfg"))
        self.dragon_load_file = config.get("dragon", "load_file")
        self.dragon_log_prefix = config.get("dragon", "log_prefix")
        self.dragon_log_exclude = config.get("dragon", "log_exclude")
        self.dragon_path = config.get("dragon", "data_path")
        
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
