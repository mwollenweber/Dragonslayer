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
			for entry in Scratch.objects.all():
				json['data'] = str(entry.scratch)

			json['success'] = True
		except:
			json['success'] = False
			json['error'] = "Data pull failed"

	else:
		json['error'] = "Type not supported"

        return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

