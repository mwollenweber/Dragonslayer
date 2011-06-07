from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.db.models import Count, Q
from apps.core.models import DailyMdl, DailyBadFiltered, GwCases, Patchy
from apps.utilities.tools import *
from datetime import *

import socket
import struct
import sys

def daily_mdl(request):
        json = {}
        objs = []
        try:
            	for entry in DailyMdl.objects.all().annotate(Count('victim')):
                        obj = {
                               	'case':'<a href="#" name="openCreateCase">+</a>',
                                'date': str(entry.tdstamp),
                                'event': str(entry.event),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'attacker': str(socket.inet_ntoa(struct.pack('!i',entry.attacker))),
                                'notes': str(entry.description)
                        }
                        objs.append(obj)

                json['success'] = True
                json['data'] = objs
        except:
               	json['success'] = False
                json['error'] = "Search failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

def last_50_cases(request):
        json = {}
        objs = []
        try:
                for entry in GwCases.objects.all().order_by('-tdstamp')[:50]:
                        obj = {
                               	'dsid': str(entry.id),
                                'date': str(entry.tdstamp),
                                'analyst': str(entry.reporter),
                                'event': str(entry.event),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'attacker': str(socket.inet_ntoa(struct.pack('!i',entry.attacker))),
			        'netid': str(entry.netid),
			        'dns_name': str(entry.dns_name),
                                'network': str(entry.network),
			        'dhcp_info': str(entry.dhcp_info),
			        'verification': entry.verification,
                                'notes': entry.notes,
			        'category': str(category_to_text(entry.report_category))
                        }
                        objs.append(obj)
			print objs

                json['success'] = True
                json['data'] = objs
        except:
               	json['success'] = False
                json['error'] = "Top 50 case generation failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))	

def weekly_cases(request):
        json = {}
        objs = []
        try:
            	for entry in GwCases.objects.all().filter(tdstamp__range=[date.today()-timedelta(days=date.today().weekday()),date.today()],report_category__gt=0).order_by('tdstamp'):
			obj = { 
                               	'dsid': str(entry.id),
                                'date': str(entry.tdstamp),
                                'analyst': str(entry.reporter),
                                'event': str(entry.event),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'attacker': str(socket.inet_ntoa(struct.pack('!i',entry.attacker))),
                                'dns': str(entry.dns_name),
                                'network': str(entry.network),
                                'verification': str(entry.verification),
                                'notes': entry.notes,
                                'category': str(category_to_text(entry.report_category))
			}
                        objs.append(obj)

                json['success'] = True
                json['data'] = objs
        except:
               	json['success'] = False
                json['error'] = "Search failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

def recent_vip_cases(request):
        json = {}
        objs = []
        try:
                for entry in GwCases.objects.all().filter(Q(report_category__exact=250) | Q(report_category__exact=251)).order_by('-tdstamp')[:50]:
                        obj = {
                               	'dsid': str(entry.id),
                                'date': str(entry.tdstamp),
                                'analyst': str(entry.reporter),
                                'event': str(entry.event),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'attacker': str(socket.inet_ntoa(struct.pack('!i',entry.attacker))),
                                'network': str(entry.network),
                                'notes': entry.notes,
                        }
                        objs.append(obj)

                json['success'] = True
                json['data'] = objs
        except:
               	json['success'] = False
                json['error'] = "Search failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

def weekly_report(request):
        json = {}
        objs = []
        try:
            	for entry in GwCases.objects.all().filter(tdstamp__range=[date.today()-timedelta(days=date.today().weekday()),date.today()],report_category__gt=99).order_by('tdstamp','victim').annotate(Count('victim')):
			ip = str(socket.inet_ntoa(struct.pack('!i',entry.victim)))
			school_department = str(entry.network)    
 			date_time = str(entry.discovered)
			notes = entry.notes
			device_name = ""
			patchlink = ""
			last_patchlink_checkin = ""

			count = Patchy.objects.all().filter(ip__exact = entry.victim).order_by('-id')[:1].count()
			if count != 0:
				for pentry in Patchy.objects.all().filter(ip__exact = entry.victim).order_by('-id')[:1]:
					device_name = str(pentry.dev_name)
					patchlink = "YES"
					last_patchlink_checkin = str(pentry.tdstamp)

			else:
				device_name = ""
				patchlink = "NO"
				last_patchlink_checkin = ""

			obj = {
                               	'device': str(device_name),
                                'ip': str(ip),
                                'department': str(school_department),
                                'date': str(date_time),
                                'patchlink': str(patchlink),
                               	'last_patchlink_check': str(last_patchlink_checkin),
                               	'notes': str(notes),
                        }
                        objs.append(obj)

                json['success'] = True
                json['data'] = objs
        except:
                json['success'] = False
                json['error'] = "Search failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))
