from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.db.models import Count
from apps.core.models import DailyMdl, DailyBadFiltered, GwCases
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
                                'notes': str(entry.notes),
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
