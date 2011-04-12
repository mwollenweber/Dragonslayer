from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.utils import simplejson

def ext_login(request):
    json = {
        'errors': {},
        'text': {},
        'success': False,
    }
    user = authenticate(username=request.POST['loginUsername'],
                        password=request.POST['loginPassword'])
    if user is not None:
        if user.is_active:
            login(request, user)
            json['success'] = True
            json['text']['welcome'] = 'Welcome, %s!' % (user.get_full_name(),)
        else:
            # Return a 'disabled account' error message
            json['errors']['username'] = 'Account disabled.'
    else:
        # Return an 'invalid login' error message.
            json['errors']['username'] = 'Username and/or password invalid.'
    return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

