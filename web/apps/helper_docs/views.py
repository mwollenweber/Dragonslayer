from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from forms import helper_doc_form
from models import Documenter

import sys
import datetime

def documenter(request):
        json = {
                'error': {},
                'text': {},
                'success': False,
        }

	form = helper_doc_form(request.POST)
	if form.is_valid():
		type = request.POST['type']
		name = request.POST['name']
		count = Documenter.objects.filter(name__exact=name).count()
		if type == "push":
			if count == 0:
				try:
					e = Documenter(name=request.POST['name'],type=request.POST['helper_type'],last_edit=datetime.datetime.now(),last_user_edit=request.POST['user'],content=request.POST['content'])
					e.save()
					json['success'] = True
				except:
					json['success'] = False
					json['error'] = "Insert failed"
			else:
				try:
					e = Documenter.objects.filter(name__exact=name).update(content=request.POST['content'],last_edit=datetime.datetime.now(),last_user_edit=request.POST['user'])
                                        json['success'] = True
				except:
                                        json['success'] = False
                                        json['error'] = "Update failed"

		elif type == "pull":
			try:
				entry = Documenter.objects.get(name__exact=name)
				json['content'] = entry.content
				json['last_edit'] = entry.last_edit
				json['last_user_edit'] = entry.last_user_edit
			except:
				json['content'] = "No content has been published yet"
		else:
			json['error'] = "Type not supported"
	
	else:
                json['error'] = form.errors

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

