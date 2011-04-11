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
        self.correlator_names = []
        self.correlators = []
        
        #launch the processing of most configs
        self.load_config()
        
        #connect to the db
        self.db_con = self.db_connect()

        self.import_correlators()
    
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
                
        #ready the correlators (mdl, ses, etc)
        correlators = config.get('dscnf','correlators').split(",")
        for ing in correlators:
            ing = ing.strip()
            print "mmm correlators = %s" % ing
            self.correlator_names.append(ing)
            
        #load other relevant configs
        if self.ids == "dragon":
            print "need to load dragon config"
            self.process_dragon_config(config_path)
        
        if self.db == "mysql":
            print "passing on loading mysql config. Will load on connect"
        else:
            print "unknown database. We currently only support mysql - biatches."
            

    def import_correlators(self):
        for i in self.correlator_names:
            if i == "mdl":
                print "loading mdl correlator"
                from correlators.mdl import mdl
                mdl_correlator = mdl.correlator(conn = self.conn)
                self.correlators.append(mdl_correlator)
                #mdl_correlator = __import("mdl")
                
            elif i == "ses":
                print "loading ses"
                from correlators.ses import ses
                ses_correlator = ses.correlator(conn = self.conn)
                self.correlators.append(ses_correlator)
            
            elif i == "malwareurl":
                print "loading malware url"
                from correlators.malwareurl import malwareurl
                malwareurl_correlator = malwareurl.correlator(conn = self.conn)
                self.correlators.append(malwareurl_correlator)
            
            elif i == "shadowserver":
                print "loading shadow correlator"
                from correlators.shadowserver import shadowserver
                shadowserver_correlator = shadowserver.correlator(conn = self.conn)
                self.correlators.append(shadowserver_correlator)

    def update_correlators(self, correlators = None):
        print "updating correlators"
        for i in self.correlators:
            i.update()
                
    def load_correlators(self):
        print "loading correlators"
        for i in self.correlators:
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
    ds.update_correlators()
    ds.load_correlators()
    ds.update_bad()
    
    
if __name__ == "__main__":
    main()