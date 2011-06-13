#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

from .. import dragonslayer

class patchy_updater(dragonslayer):
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