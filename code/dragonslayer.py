#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

import time, thread, MySQLdb, sys, urllib2, os, traceback, csv, ConfigParser


class dragonslayer:
    def __init__(self, path = "./"):
        print "initializing dragonslayer"
        self.dragon_base = path
        
        #launch the processing of most configs
        self.load_config()
        
        #connect to the db
        self.db_con = self.db_connect()
        self.dragon_log_processed = []
        self.patchy_success = None
        self.lock_file = "/tmp/dragonslayer_lock"
        self.log_file = "/home/dragonslayer/log/ds.log"
        
    def load_db_config(self):
        config = ConfigParser.RawConfigParser()
        config.read( self.dragon_base + "/conf/db.cfg")
        self.host = config.get("slayerdb", "hostname")
        self.user = config.get("slayerdb", "user")
        self.passwd = config.get("slayerdb", "password")
        self.db = config.get("slayerdb", "database")

        self.load_mdl_sql = ""

    def db_connect(self):
        self.load_db_config()
        self.conn = MySQLdb.connect(host = self.host,
                               user = self.user,
                               passwd = self.passwd,
                               db = self.db)

        self.cursor = self.conn.cursor()
        print "db connection succeeded"
 

    def load_config(self):
        config_path = self.dragon_base + "/conf/"
        print "loading config from %s" % config_path
        self.config = ConfigParser.ConfigParser()
        self.process_ds_config(config_path)
        
        
        
    def process_ds_config(self, config_path):
        print "loading ds config"
        config  = self.config
        config.readfp(open(config_path + "ds.cfg"))
        
        self.ids = config.get("dscnf", "ids")
        self.logfile = config.get('dscnf','logfile')
        self.db = config.get('dscnf','db')
                
        #ready the ingestors (dragon/snort/etc)
        self.ingestor_names = []
        self.ingestor_names.append(config.get('dscnf','ingestors'))
        
        self.ingestors = []
        
        #load other relevant configs
        if self.ids == "dragon":
            print "need to load dragon config"
            self.process_dragon_config(config_path)
        
        if self.db == "mysql":
            print "passing on loading mysql config. Will load on connect"
        else:
            print "unknown database. We currently only support mysql - biatches."
            

    def load_ingestors(self):
        for i in self.ingestor_names:            
            if i == "mdl":
                print "loading mdl ingestor"
                from ingestors import mdl
                mdl_ingestor = mdl.ingestor()
                self.ingestors.append(mdl_ingestor)
                #mdl_ingestor = __import("mdl")
                
            elif i == "ses":
                print "loading ses"
                from ingestors import ses
                ses_ingestor = ses.ingestor()
                self.ingestors.append(ses_ingestor)
            
            elif i == "malwareurl":
                print "loading malware url"
                from ingestors import malwareurl
                malwareurl_ingestor = malwareurl.ingestor()
                self.ingestors.append(malwareurl_ingestor)
            
            elif i == "shadowserver":
                print "loading shadow ingestor"
                from ingestors import shadowserver
                shadowserver_ingestor = shadowserver.ingestor()
                self.ingestors.append(shadowserver_ingestor)
    
    def process_dragon_config(self, path):
        print "loadign dragon config"
        config = self.config
        config.readfp(open(path + "dragon.cfg"))
        self.dragon_load_file = config.get("dragon", "load_file")
        self.dragon_log_prefix = config.get("dragon", "log_prefix")
        self.dragon_log_exclude = config.get("dragon", "log_exclude")
        self.dragon_path = config.get("dragon", "data_path")
        
    def update_critical(self, critical_filename = ""):
        f = open(critical_filename, "r")
        q1 = '''INSERT INTO critical (ip) VALUES (%s)'''
        for line in f:
            self.cursor.execute(q1, [line])

        f.close()
        
    def shutdown(self):
        self.conn.close()
        #delete the lock file
        #should write to a log

    def update_ingestors(self, ingestors = None):
        print "updating ingestors"
        
    def run_ingestors(self, ingestors = None):
        print "running ingestors"
        
    def update_bad(self):
        print "update daily bad"
        
    def update_filter(self):
        print "updating filter"
        
def main(filename):
    print "fuxing main bs"
    ds = dragonslayer.dragonslayer()
    ds.update_ingestors()
    ds.run_ingestors()
    ds.update_bad()
    
    
if __name__ == "__main__":
    main(sys.argv[1])