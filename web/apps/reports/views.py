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

def student_report(request):
        json = {}
        objs = []
        try:
            	for entry in GwCases.objects.all().filter(tdstamp__range=[date.today()-timedelta(days=date.today().weekday()),date.today()],report_category__exact=20):
                        obj = {
                               	'discovered': str(entry.discovered),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'event': str(entry.event),
                                'notes': entry.notes,
                                'verification': str(entry.verification),
                        }
                        objs.append(obj)

                json['success'] = True
                json['data'] = objs
        except:
               	json['success'] = False
                json['error'] = "Search failed"
                json['except'] = str(sys.exc_info())

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

