'''
Matthew Wollenweber
mjw@cyberwart.com
Dragonslayer
'''

class xfer():
    def __init__(self, lconn = None, rconn = None):
        if lconn == None or rconn == None:
            print "failure"
            self.status = -1
            
            return None;
        else:
            self.rconn = rconn
            self.lconn = lconn
            self.status = 1
            
    def import_cases(s_date = None, e_date = None, victim = None, attacker = None, network = None):
        if self.status < 0:
            print "ERROR: status is non-positive. Exiting"
            return -1
                
        query = "SELECT * FROM gwcases "
        needs_and = False
        needs_where = True
        
        if s_date != None and e_date != None:
            if needs_where == True:
                query += " WHERE " 
                needs_where = False
            
            query += "DATE(tdstamp) BETWEEN DATE(%s) AND DATE(%s) " % (s_date, e_date)
            needs_and = True
        else:
            print "Error state isn't quite right - Must specify both a start and finish - or neither"
        
        if victim != None:
            if needs_where == True:
                query += " WHERE " 
                needs_where = False
            
            if needs_and == True:
                query += " AND " 
                needs_and = False
            query += " victim = INET_ATON(%s) " % victim
            needs_and = True
            
        if attacker != None:
            if needs_where == True:
                query += " WHERE " 
                needs_where = False
            
            if needs_and == True:
                query += " AND " 
                needs_and = False
                
            query += " attacker = INET_ATON(%s) " % attacker
            needs_and = True
            
        print "Query = %s" % query
        try:
            self.rconn.cursor.execute(query)
            
        except:
            exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
            traceback.print_exception(exceptionType, exceptionValue, exceptionTraceback, limit=2, file=sys.stdout)
            

def main():
    print "not implemented"
        
if __name__ == '__main__':
    main()
