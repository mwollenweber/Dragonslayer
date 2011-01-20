
from pyars import erars, cars
import sys, traceback

print "starting"

ars = erars.erARS()
ars.Login('newfozzy.nit.gwu.edu:3115', 'mwollenw', '')
print "logged in -maybe "




ip = "128.164.213.193"
dhcp = "Belgium:128.164.213.193:002170082498:2010/02/11 17:39:28 GMT:Active:GLSS-GRCFRONT 002170082498"
ticket_title = ip + " - Compromised Machine"
ticket_body = ticket_title + "\nEvent - Machine is hacked and backdoored\nRemediation - Rebuild System\nDCHP - " + dhcp

fieldValue = {#2: 'mwollenw',
              #5: 'mwollenw'
              8: ticket_title,
              200000003: 'Security', #category
              200000004: 'Compromised', #type
              200000005: 'Desktop', #item
              240000006: 'Tech Eng Network',
              240000007: ticket_body, #detailed description
              240000001: 'Unknown', #name   
              240000005: "unknown", #login name
              240000008: "Please disable network connection" #msg
              }
              


#form = "HelpDesk"

#entry = ars.GetEntry('HPD:HelpDesk', 'HD0000000462332')

#for fieldid in entry.keys():
    #print '%d: %s' % (fieldid, entry[fieldid])


entryId = ars.CreateEntry('HPD:HelpDesk', fieldValue)
if ars.errnr > 1:
    print 'ERROR modifying entry!'
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    traceback.print_tb(exceptionTraceback, limit=1, file=sys.stdout)

print entryID
print "done"
