from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.db.models import Count, Q
from apps.core.models import DailyMdl, DailyBadFiltered, GwCases, Patchy
from apps.utilities.tools import *
from datetime import *
from forms import search_form, update_case_form

import socket
import struct
import sys

def update_case(request):
	objs = []
        json = {
                'error': {},
                'text': {},
                'success': False,
        }
	form = update_case_form(request.POST)
	if form.is_valid():
		record_handle = GwCases.objects.get(id__exact=dsid)
		record_handle.dsid = request.POST['dsid']
		record_handle.event = request.POST['event']
		record_handle.victim = request.POST['victim']
		record_handle.attacker = request.POST['attacker']
		record_handle.network = request.POST['network']
		record_handle.dns = request.POST['dns']
		record_handle.primary = request.POST['primary_detection']
		record_handle.secondary = request.POST['secondary_detection']
		record_handle.verification = request.POST['verification']
		record_handle.notes = request.POST['notes']
		record_handle.analyst = request.POST['reporter']
		record_handle.detection_date = request.POST['date']
		record_handle.category = request.POST['category']
		record_handle.dhcp_info = request.POST['dhcp']
		record_handle.netid = request.POST['netid']
		record_handle.save()
		
		json['success'] = True
		
	else:
             	json['error'] = form.errors

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

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

