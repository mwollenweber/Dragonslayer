#!/usr/bin/python
'''
Generate event file for today
Sample Event: 
    2011-08-24 00:57:06|Birdflu-VS1|RDP:BRUTE-FORCE-ATTEMPT|60.4.136.235|128.164.158.221|4374|3389|T||6|tcp,sp=4374,dp=3389,state=0||

'''
from random import randrange
from datetime import timedelta, datetime


class test_events():
    def __init__(self):
        print "initializing fake test events"
        self.test_events = ["dstest_event0", "dstest_event1", "dstest_event2", "dstest_event3"]
        self.test_victims = ["128.164.14.42", "128.164.14.43", "128.164.14.44", "128.164.14.45", "128.164.14.46"]
        self.test_attackers = []
        self.test_sensors = ["test-generator0", "test-generator1"]
        
    def get_random_tdstamp(self, start, end):
        '''
        This function will return a random datetime between two datetime 
        objects.
        '''
        delta = end - start
        int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
        random_second = randrange(int_delta)
        
        return (start + timedelta(seconds=random_second))
    
    def get_random_today_tdstamp(self):
        #datetime.strptime('1/1/2009 4:50 AM', '%m/%d/%Y %I:%M %p')
        #start = datetime.strptime('1/1/2009 4:50 AM', '%m/%d/%Y %I:%M %p')
        #end = datetime.strptime('1/1/2009 4:50 AM', '%m/%d/%Y %I:%M %p')
        start = datetime.datetime.now() - datetime.timedelta(1)
        end = datetime.datetime.now() 
        
        return self.get_random_tdstamp(start, end)
        
    def get_random_event():
        
        event = ""