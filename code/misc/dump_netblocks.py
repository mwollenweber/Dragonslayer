#!/usr/bin/python

import os, sys, socket, math, struct, traceback

f = open(sys.argv[1])
ct = 0

for x in f:
    try:
        x = x.strip()
        [netblock, owner, name] = x.split(',')
        name = name.strip()
        netblock = netblock.strip()
        
        #print [netblock, name]

        (x1, x2) = netblock.split('/')
        min = struct.unpack("!L", socket.inet_aton(x1))[0]
        #(x2, x3) = x2.split("\t")
        #print "x1 = %s, x2 = %s" % (x1, x2)
        
        hosts = int(math.pow(2, 32 - int(x2)))
        print str(min) +", " + str(min+hosts) + ", " + name
        ct +=1
        
    except:
        traceback.print_exc(file=sys.stdout)
        print "error on line %s. Line=%s min = %s net=%s" % (ct, x, x1, x2)
        continue
    
