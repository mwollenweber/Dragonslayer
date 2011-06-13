#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"
__copyright__ = "Matthew Wollenweber 2011"

try: 
    import time, thread, MySQLdb, sys, urllib2, os, traceback, csv
    import StringIO
    import json

except ImportError:
    print "error"
    import simplejson as json
    
class correlator():
    def __init__(self, conn = None, config = None):
        print "in ses stub correlator init"
        if config != None:
            self.username = config["username"]
            self.password = config["password"]
            self.up_interval = config["update"]
            self.base_url = config["base_url"]
            self.feed_pages = config["feed_pages"]
            
        if conn != None:
            self.conn = conn
            self.cursor = conn.cursor()
            
    def correlate(self):
        self.ses_correlate()
        print "Done correlating SES. fawesome"
        
    def delete(self):
        query = "DELETE FROM ids_ses_correlation"
        self.cursor.execute(query)
        self.conn.commit()
        
    def ses_correlate(self):
        self.delete()
        self.sescncip_correlate()
        #self.sesmalwareflows_correlate()
        self.sesinfrastructure_correlate()
        
        
        #self.seshttpcnc_correlate()
        #self.sesphishing_correlate()
    
    def sesinfrastructure_correlate(self):
        print "begining infrastructure correlate"
        
        queries = []
        queries.append('''DELETE FROM temp_ses''')
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, CONCAT("SES MALWARE INFRASTRUCTURE! ", sesinfrastructure.description, "\nRESTRICTION: ", sesinfrastructure.restriction, "\nCONFIDENCE: ", sesinfrastructure.confidence)
        from dragon, sesinfrastructure
        where
        dstip = sesinfrastructure.ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  SUBDATE(CURDATE(), INTERVAL 28 DAY) < sesinfrastructure.updated
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))''')       
        
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.dstip, dragon.srcip, CONCAT("SES MALWARE INFRASTRUCTURE! ", sesinfrastructure.description, "\nRESTRICTION: ", sesinfrastructure.restriction, "\nCONFIDENCE: ", sesinfrastructure.confidence)
        from dragon, sesinfrastructure
        where
        srcip = sesinfrastructure.ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  SUBDATE(CURDATE(), INTERVAL 28 DAY) < sesinfrastructure.updated
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))
        ''')

        queries.append('''INSERT INTO ids_ses_correlation (SELECT * from temp_ses) ON DUPLICATE KEY UPDATE ids_ses_correlation.description = CONCAT(ids_ses_correlation.description, "\n", VALUES(description))''')
        queries.append("DELETE FROM ids_ses_correlation where SUBDATE(CURDATE(), INTERVAL 7 DAY) > tdstamp")
        queries.append("DELETE FROM temp_ses")
        
        for q in queries:
            #print "QUERY = %s" % q
            self.cursor.execute(q)
            
        self.conn.commit()
        print "done infrastructure correlation"
        
    def sesmalwareflows_correlate(self):
        print "correlating ses malware flows"

        queries = []
        queries.append('''DELETE FROM temp_ses''')
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, "SES Malware Flow"
        from dragon, sesmalwareflows
        where
        dstip = sesmalwareflows.ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  SUBDATE(CURDATE(), INTERVAL 28 DAY) < sesmalwareflows.tdstamp
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))''')
        
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.dstip, dragon.srcip, "SES Malware Flow"
        from dragon, sesmalwareflows
        where
        srcip = sesmalwareflows.ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  SUBDATE(CURDATE(), INTERVAL 28 DAY) < sesmalwareflows.tdstamp
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))''')
        
        queries.append('''INSERT INTO ids_ses_correlation (SELECT * from temp_ses) ON DUPLICATE KEY UPDATE ids_ses_correlation.description = CONCAT(ids_ses_correlation.description, "\n", VALUES(description))''')
        queries.append("DELETE FROM ids_ses_correlation where SUBDATE(CURDATE(), INTERVAL 7 DAY) > tdstamp")
        queries.append("DELETE FROM temp_ses")
        
        for q in queries:
            #print "QUERY = %s" % q
            self.cursor.execute(q)
            
        self.conn.commit()
        
    def sescncip_correlate(self):
        print "Starting SES CNC IP correlation"
        queries = []
        queries.append('''DELETE FROM temp_ses''')
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.srcip, dragon.dstip, CONCAT("SES EVENT\nCategory: ", sescncip.category, "\nDESCRIPTION: ", sescncip.description,"\nComments:", sescncip.comments)
        from dragon, sescncip
        where
        dstip = sescncip.ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  dragon.tdstamp <= sescncip.expiration
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))''')
        
        queries.append('''INSERT INTO temp_ses (tdstamp, event, victim, attacker, description)
        SELECT dragon.tdstamp, dragon.event, dragon.dstip, dragon.srcip, CONCAT("SES EVENT\nCategory: ", sescncip.category, "\nDESCRIPTION: ", sescncip.description,"\nComments:", sescncip.comments)
        from dragon, sescncip
        where
        srcip = sescncip.ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and  DATE(dragon.tdstamp) between SUBDATE(CURDATE(), 7) and ADDDATE(CURDATE(),1)
        and  dragon.tdstamp <= sescncip.expiration
        GROUP BY dragon.srcip, dragon.dstip, dragon.event
        ORDER BY dragon.srcip, dragon.dstip, dragon.event
        ON DUPLICATE KEY UPDATE description = CONCAT(description, "\n", VALUES(description))''')
        
        queries.append('''INSERT INTO ids_ses_correlation (SELECT * from temp_ses) ON DUPLICATE KEY UPDATE ids_ses_correlation.description = CONCAT(ids_ses_correlation.description, "\n", VALUES(description))''')
        #queries.append("DELETE FROM temp_ses")
        queries.append("DELETE FROM ids_ses_correlation where SUBDATE(CURDATE(), INTERVAL 7 DAY) > tdstamp")
        queries.append("DELETE FROM temp_ses")

        for q in queries:
            #print "QUERY = %s" % q
            self.cursor.execute(q)
        
        self.conn.commit()
    def update(self):
        print "updating ses"
        try:
            pass_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
            pass_mgr.add_password(None, self.base_url, self.username, self.password)
            handler = urllib2.HTTPBasicAuthHandler(pass_mgr)
            opener = urllib2.build_opener(handler)
            urllib2.install_opener(opener)
            
            for page in self.feed_pages:     
                print "i want page...%s" % page
                if page.find("cncip") >= 0:
                    print "loading ses cncip"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    self.update_cncip(f)
                    
                elif page.find("malwareflows") >= 0:
                    print "loading ses malware flow"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    self.update_malwareflows(f)
                    
                    
                elif page.find("infrastructure") >= 0:
                    print "loading ses infrastructure"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    self.update_infrastructure(f)
                    
                elif page.find("httpcnc") >= 0:
                    print "loading ses http cnc"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    self.update_httpcnc(f)
                    
                elif page.find("phishing-url") >= 0:
                    print "loading ses phishing url"
                    url = self.base_url + page
                    f = urllib2.urlopen(url)
                    #data = f.read()
                    self.update_phishingurl(f)
                    
                else:
                    print "unknown ses page"
        except:
            print "error loading ses record"
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                
        self.conn.commit()
        
    def update_sesmalware(self, data):
        print "updating ses malware"
        
    def update_sesdomains(self, data):
        print "ses domains"
        
    def update_sesdns(self, data):
        print "asdfs"
        
    def update_phishingurl(self, data):
        print "updating phishing url"
        
    def update_httpcnc(self, data):
        print "updating ses http cnc"
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)

        for row in reader:
            try:
                if len(row) < 8 or row[0][0].find("#") >= 0:
                    continue
            
                sha1 = row[0].strip()
                md5 = row[1].strip()
                timestamp = row[2].strip()
                ip = row[3].strip()
                tpe = row[4].strip()
                asn = row[5].strip()
                if asn.isdigit() == False:
                    asn = str(0)
                    
                cc = row[6].strip()
                url = row[7].strip()
                
                query = '''INSERT INTO seshttpcnc (sha1, md5, tdstamp, ip, asn, cc, url) VALUES ('%s', '%s', DATE('%s'), INET_ATON('%s'), %s, '%s', '%s') ON DUPLICATE KEY UPDATE tdstamp=tdstamp''' % (sha1, md5, timestamp, ip,  asn, cc, url)
                #print "query = %s" % query
                self.cursor.execute(query)
                
            except:
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
        
        self.conn.commit()
      
    def update_malwareflows(self, data):
        print "Actually updating malwareflows"
        queries = []
        
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)
        
        for row in reader:
            try:
                if len(row) < 10 or row[0][0].find("#") >= 0:
                    continue
                
                sha1 = row[0].strip()
                md5 = row[1].strip()
                tdstamp = row[2].strip()
                ip = row[3].strip()
                dport = int(row[4].strip())
                pr = int(row[5].strip())
                app = row[6].strip()
                asn = int(row[7])
                cc = row[8].strip()
                fqdn = row[9].strip()
                
                query = '''INSERT INTO sesmalwareflows (sha1, md5, tdstamp, ip, dport, pr, app, asn, cc, fqdn )  VALUES ('%s', '%s', DATE('%s'), INET_ATON('%s'), %s, %s, '%s', %s, '%s', '%s') ON DUPLICATE KEY UPDATE tdstamp = tdstamp''' % (sha1, md5, tdstamp, ip, dport, pr, app, asn, cc, fqdn)
                #print "query = %s" % query
                self.cursor.execute(query)

            except:
                print "error biatches"
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
        self.conn.commit()
        print "DONE updating sesmalwareflows"
        
        
        
        
    def update_infrastructure(self, data):
        print "updating ses infrastructure"
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)
        
        for row in reader:
            try:
                if len(row) < 12 or row[0][0].find("#") >= 0:
                    continue
            
                asn = int(row[0].strip())
                #cidr = row[1].strip()
                ip = row[2].strip()
                protocol = row[3].strip()
                #portlist = row[4].strip()
                restriction = row[5].strip()
                description = row[6].strip()
                impact = row[7].strip()
                action = row[8].strip()
                confidence = row[9].strip()
                created = row[10].strip()
                updated = row[11].strip()
                ref = row[12].strip()
                
                query = '''INSERT INTO sesinfrastructure (asn, ip, protocol, restriction, description, impact, action, confidence, created, updated, ref) 
                VALUES (%s, INET_ATON('%s'), '%s', '%s', '%s', '%s', '%s', '%s', DATE('%s'), DATE('%s'), '%s') ON DUPLICATE KEY UPDATE updated = updated, confidence = confidence, action = action''' % (asn, ip, protocol, restriction, description, impact, action, confidence, created, updated, ref)             
                #print "query = %s" % query
                self.cursor.execute(query)
                
            except:
                print "ERROR: Unable to enter SES infrastructure record"
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
                
        self.conn.commit()        
        print "done ses infrastructure"
                
    def update_cncip(self, data):
        print "updating cncip"
        reader = csv.reader(data, delimiter='|', quotechar='"', skipinitialspace = True)
        
        for row in reader:
            try:
                if len(row) < 10 or row[0][0].find("#") >= 0:
                    continue
                
                asn = row[0].strip()
                description = row[1].strip()
                ip = row[2].strip()
                protocol = row[3].strip()
                port = row[4].strip()
                discovered = row[5].strip()
                expiration = row[6].strip()
                category = row[7].strip()
                hasssl = row[8].strip()
                services = row[9].strip()
                comments = row[10].strip()
                
                query = '''INSERT INTO sescncip (asn, description, ip, protocol, discovered, expiration, category, comments) VALUES (%s, '%s', INET_ATON('%s'), '%s', DATE('%s'), DATE('%s'), '%s', '%s') ON DUPLICATE KEY UPDATE expiration = expiration ''' % (asn, description, ip, protocol, discovered, expiration, category, comments)
                #print "query = %s" % query
                self.cursor.execute(query)
                
            except:
                exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
                traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            
        self.conn.commit()
        print "DONE inserting sescncip"
            
    def load(self):
        print "in ses load stub"