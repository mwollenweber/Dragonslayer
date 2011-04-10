#!/usr/bin/python
__author__ = "Matthew Wollenweber"
__email__ = "mjw@cyberwart.com"

try: 
    import os, sys, csv, zipfile, getopt, traceback, socket, urlparse, time
    from threading import Thread
    import StringIO
    import json

except ImportError:
    print "error"
    import simplejson as json
    
class ingestor():
    def __init__(self, conn = None):
        print "in ses stub ingestor init"
        
    def update(self):
        print "ses update stub"
        
    def load(self):
        print "in ses load stub"