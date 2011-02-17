#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''

from .. import Dragonslayer

class mac_updater(Dragonslayer):
    def __init__(self):
        print "starting mac updator"

    def load_mac(self, data_blob=None, mac_file=None):
        import re

        msg = ""
        regex = re.compile('([a-fA-F0-9]{2}[:|\-]?){6}')
        
        if data_blob == None:
            if mac_file != None:
                reader = csv.reader(open(mac_file, "r"), delimiter=',', quoting=csv.QUOTE_NONE)
                file_status = 1
                msg+= "no data blob"
            else:
                msg+="fuck off\n you have to supply a blob or a file"
                
        else:
            msg+="got data blob"
            import StringIO
            data_stream = StringIO.StringIO(data_blob)
            reader = csv.reader(data_stream, delimiter=',', quoting=csv.QUOTE_NONE)
        
        for row in reader:
            try:
                mac = regex.search(row[1]).group(0)
                mac = mac.replace(":", "")
                mac = "0x" + mac
                mac = int(mac, 16)
                dev_name = row[2].strip()
                
                if mac != None:
                    self.cursor.execute('''INSERT INTO mac_lookup(mac_addr, dev_name) VALUES(%s, %s)''', [mac, dev_name.lower()])
                    #print mac
            except:
                continue

    



