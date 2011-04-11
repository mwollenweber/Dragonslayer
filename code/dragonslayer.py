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
        self.ingestor_names = []
        self.ingestors = []
        
        #launch the processing of most configs
        self.load_config()
        
        #connect to the db
        self.db_con = self.db_connect()

        self.import_ingestors()
    
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
        
        config.readfp(open(config_path) + "ses.cfg"))
        self.ses_username = config.get("sescnf", "username")
        self.ses_password = config.get("sescnf", "password")
        self.ses_update_interval = config.get("sescnf", "update")
        ses_conf = {"username":self.ses_username , "password": self.ses_password, "update": self.ses_update_interval}
                
        #ready the ingestors (mdl, ses, etc)
        ingestors = config.get('dscnf','ingestors').split(",")
        for ing in ingestors:
            ing = ing.strip()
            print "mmm ingestors = %s" % ing
            self.ingestor_names.append(ing)
            
        #load other relevant configs
        if self.ids == "dragon":
            print "need to load dragon config"
            self.process_dragon_config(config_path)
        
        if self.db == "mysql":
            print "passing on loading mysql config. Will load on connect"
        else:
            print "unknown database. We currently only support mysql - biatches."
            

    def import_ingestors(self):
        for i in self.ingestor_names:
            if i == "mdl":
                print "loading mdl ingestor"
                from ingestors.mdl import mdl
                mdl_ingestor = mdl.ingestor(conn = self.conn)
                self.ingestors.append(mdl_ingestor)
                #mdl_ingestor = __import("mdl")
                
            elif i == "ses":
                print "loading ses"
                from ingestors.ses import ses
                ses_ingestor = ses.ingestor(conn = self.conn)
                self.ingestors.append(ses_ingestor)
            
            elif i == "malwareurl":
                print "loading malware url"
                from ingestors.malwareurl import malwareurl
                malwareurl_ingestor = malwareurl.ingestor(conn = self.conn)
                self.ingestors.append(malwareurl_ingestor)
            
            elif i == "shadowserver":
                print "loading shadow ingestor"
                from ingestors.shadowserver import shadowserver
                shadowserver_ingestor = shadowserver.ingestor(conn = self.conn)
                self.ingestors.append(shadowserver_ingestor)

    def update_ingestors(self, ingestors = None):
        print "updating ingestors"
        for i in self.ingestors:
            i.update()
                
    def load_ingestors(self):
        print "loading ingestors"
        for i in self.ingestors:
            i.load
            
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

    def update_bad(self):
        print "update daily bad"
        
    def update_filter(self):
        print "updating filter"
        
def main():
    print "fuxing main bs"
    ds = dragonslayer()
    ds.update_ingestors()
    ds.load_ingestors()
    ds.update_bad()
    
    
if __name__ == "__main__":
    main()