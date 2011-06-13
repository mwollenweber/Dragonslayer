#!/usr/bin/python
'''
Matthew Wollenweber
mjw@cyberwart.com
Copyright Matthew Wollenweber 2009
'''


class daily_bad():
    def __init__(self, conn = None, ids = None, cors = None):
        print "initializing daily bad correlator"
        self.conn = conn
        self.cursor = conn.cursor()
        

              
    def generate_hourly_bad(self):
        print "generating hourly bad list"
       
        
        try:
            print "I feel naked"
            
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
