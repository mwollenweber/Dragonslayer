from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.http import HttpResponseRedirect

def check_auth(request):
        json = {
                'error': {},
                'text': {},
                'success': False,
        }

	if request.user.is_authenticated():
		json['success'] = True
		json['user'] = str(request.user)
	else:
                json['success'] = False

	return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

