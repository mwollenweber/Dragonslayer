#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"
__copyright__ = "Matthew Wollenweber 2011"

import MySQLdb
import os, sys, re

class db_config:
    host = "localhost"
    user = "dragonslayer"
    passwd = "slayer"
    db = "dragonslayer"

def db_connect():
    mydbinfo = db_config()
    conn = MySQLdb.connect(host = mydbinfo.host,
                               user = mydbinfo.user,
                               passwd = mydbinfo.passwd,
                               db = mydbinfo.db)

    return conn.cursor()


def insert_case(vals, cursor):
    if vals['is_facstaff'] == 1:
        report_category = 205
    else:
        report_category = 25
        
    insert_query = "INSERT INTO gwcases (reporter, event, discovered, victim, attacker, netid, report_category, verification, notes, network, dns_name, tdstamp, dchp_info) \
                    VALUES ('mjw', 'phishing-email-compromise', NOW(), INET_ATON('%s'), INET_ATON('%s'), '%s', %s, '%s', '%s', '%s', '%s', NOW(), 'No DHCP Info')" % (vals["victim"], vals["attacker"], vals["netid"], report_category, vals["data"], "Email Compromise", "SSL VPN", "client")
    
    #print "insert query = %s" % insert_query
    cursor.execute(insert_query)
    

def get_blurb():
    data = sys.stdin.read(1024)
    #print "here's my data: %s" %data
    return data

def process_blurb(data):
    print "processing blurb"
    #check header
    m = re.search("^The account.* has been compromised", data)
    if m == None:
        print "ERROR: dumbass. bailing"
        return None
    
    #get uid
    p = re.compile("^uid:.*", re.MULTILINE)
    m = p.search(data) 
    uid = m.group(0)[4:].strip()
    #print "uid = %s" % uid
    
    #get name
    p = re.compile("^cn:.*\n", re.MULTILINE)
    m = p.search(data)
    name = m.group(0)[3:].strip()
    #print "name = %s" % name
    
    #get account types - m
    is_facstaff = 0
    p = re.compile("^GWaccType:.*\n", re.MULTILINE)
    m = p.findall(data)
    for account in m:
        account = account[10:].strip()
        print "account = %s" % account
        if account.find("faculty") >= 0 or account.find("staff") >=0:
            is_facstaff = 1
            #print "we have fac/staff"
    
    #GW IP
    p = re.compile("^GW SSL IP Address:.*\n", re.MULTILINE)
    m = p.search(data)
    victim = m.group(0)[19:].strip()
    if len(victim) < 8:
        victim = "0.0.0.0"
        
    #print "Victim IP = %s" % victim
    
    #external IP
    p = re.compile("^Source IP Address:.*\n", re.MULTILINE)
    m = p.search(data)
    attacker = m.group(0)[19:].strip()
    if len(attacker) < 8:
        attacker = "0.0.0.0"
    #print "attacker IP = %s" % attacker
    #closer - lockout issued
    
    return {"victim":victim, "attacker":attacker, "netid":uid, "is_facstaff":is_facstaff, "name":name, 'data':data}

def main():
    cursor = db_connect()
    data = get_blurb()
    vals = process_blurb(data)
    insert_case(vals, cursor)
    
if __name__ == "__main__":
    main()
    
