from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.db.models import Count, Q
from apps.core.models import DailyMdl, DailyBadFiltered, GwCases, Patchy
from apps.utilities.tools import *
from datetime import *
from forms import search_form

import socket
import struct
import sys

def search_by_type(request):
	objs = []
        json = {
                'error': {},
                'text': {},
                'success': False,
        }

	form = search_form(request.POST)
        if form.is_valid():
		q = ""
		c = 0
                type = request.POST['search_type']
                search_value = request.POST['search_value']
		try:
			start = request.POST['start']
		except:
			start = 0

		try:
	                limit = int(request.POST['start']) + 50 #mild hack due to ORM slicing
		except:
			limit = 50
	
		if type == "dsid":
			c = GwCases.objects.all().filter(id__exact=search_value).order_by('-id').count()
			q = GwCases.objects.all().filter(id__exact=search_value).order_by('-id')[start:limit]
		elif type == "analyst":
			c = GwCases.objects.all().filter(reporter__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(reporter__exact=search_value).order_by('-id')[start:limit]
		elif type == "netid":
			c = GwCases.objects.all().filter(netid__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(netid__exact=search_value).order_by('-id')[start:limit]
		elif type == "event":
			c = GwCases.objects.all().filter(event__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(event__exact=search_value).order_by('-id')[start:limit]
		elif type == "victim_ip":
			search_value = struct.unpack('!i',socket.inet_aton(search_value))[0]
			c = GwCases.objects.all().filter(victim__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(victim__exact=search_value).order_by('-id')[start:limit]
		elif type == "attacker_ip":
			search_value = struct.unpack('!i',socket.inet_aton(search_value))[0]
			c = GwCases.objects.all().filter(attacker__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(attacker__exact=search_value).order_by('-id')[start:limit]
		elif type == "network":
			c = GwCases.objects.all().filter(network__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(network__exact=search_value).order_by('-id')[start:limit]
		elif type == "text_in_verification":
			c = GwCases.objects.all().filter(verification__exact=search_value).order_by('-id').count()
                        q = GwCases.objects.all().filter(verification__exact=search_value).order_by('-id')[start:limit]
		else:
			json['success'] = False
			json['error'] = "Type not supported"

		for entry in q:
			obj = {
                               	'dsid': str(entry.id),
                                'date': str(entry.tdstamp),
                                'analyst': str(entry.reporter),
                                'event': str(entry.event),
                                'victim': str(socket.inet_ntoa(struct.pack('!i',entry.victim))),
                                'attacker': str(socket.inet_ntoa(struct.pack('!i',entry.attacker))),
                                'dns': str(entry.dns_name),
                                'network': str(entry.network),
                                'verification': entry.verification,
			}
			objs.append(obj)
		
		if q.count() <= 0:
			json['data'] = None
		else:
			json['data'] = objs
			json['total'] = c

		json['success'] = True

        else:
             	json['error'] = form.errors

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

