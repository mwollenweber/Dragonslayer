#!/usr/bin/python

import urllib, httplib, time, traceback
username = "mwollenw"
password = "f@ct||cr@p"

def get_dhcp(ip):
    dhcp_site = "dhcp.gwu.edu"
    dhcp_login = "/cgi-bin/xauth.cgi"
    search_page = "/cgi-bin/tech_ip_lease_search.cgi?ip="
    waiting = 1
    
    params = urllib.urlencode({'user': username, 'pw':password})
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
    
    conn = httplib.HTTPConnection(dhcp_site)
    conn.request("POST", dhcp_login, params, headers)
    response = conn.getresponse()
    response.read()
    
    
    try:
        if len(ip) < 3:
            print "invalid IP address"
            sys.exit(-1)
    except:
        print "error. exiting"
        sys.exit(-1)
    
    while waiting == 1:
        try:
            conn.request("GET", search_page+ip)
            response = conn.getresponse()
            data = response.read()
    
            not_found = data.find("No Lease Found")
    
            if not_found < 0:
                s1 = data.find("<pre>")
                s2 = data.find("</pre>")
                
                s2 = data.find("<a href", s1, s2)
                
                data = data[s1+6:s2]
                
                #print data
                ret = data
                #fields = data.split(":")
                #mac = fields[2]
                #print mac
            
                waiting = 0
            else:
                data = "No DCHP Info"
                waiting = 0
                #print data
                ret = data
            
        except httplib.ResponseNotReady:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_tb(exceptionTraceback, limit=1, file=sys.stdout)
            print "sleeping for 5 seconds"
            time.sleep(5)
            continue
        
        except:
            print "unhandled error"
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_tb(exceptionTraceback, limit=1, file=sys.stdout)
            conn.close()
            sys.exit(-1)
            
            
    return data.strip()
    conn.close()
