from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from models import Scratch

def scratch(request):
        json = {
                'error': {},
                'success': False,
        }

	type = request.POST['type']
	if type == "push":
		try:
			Scratch.objects.all().delete()
		except:
                       	json['success'] = False
                        json['error'] = "Delete failed"
		try:
			e = Scratch(scratch = request.POST['scratch'])
			e.save()
			json['success'] = True
		except:
			json['success'] = False
			json['error'] = "Insert failed"
	elif type == "pull":
		try:
			e = Scratch.objects.get(id__exact = 1)
			json['success'] = True
			json['data'] = str(e.scratch)
		except:
			json['success'] = False
			json['error'] = "Data pull failed"

	else:
		json['error'] = "Type not supported"

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

