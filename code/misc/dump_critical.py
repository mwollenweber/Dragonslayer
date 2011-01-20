#!/usr/bin/python

import os, sys, socket, math, struct

f = open(sys.argv[1])
for x in f:
    try:
        x = x.strip()
        (x1, x2) = x.split('/')
        min = struct.unpack("!L", socket.inet_aton(x1))[0]

        hosts = int(math.pow(2, 32 - int(x2)))
        #print str(min) +" " + str(min+hosts)
        for i in range(0, hosts):
            print str(min + i)
        
    except:
        print "error on line=" + x
        continue
    
