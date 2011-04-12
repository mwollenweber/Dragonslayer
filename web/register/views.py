from django.contrib.auth.models import User, Group
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from forms import register_form

def ext_register(request):

	json = {
		'error': {},
		'text': {},
		'success': False,
	}

	form = register_form(request.POST)
	if form.is_valid():

		username = request.POST['username']
		first = request.POST['first']
		last = request.POST['last']
		email = request.POST['email']
		password = request.POST['password']
		confirm_password = request.POST['confirm_password']

		if password == confirm_password:
			user, created = User.objects.get_or_create(first_name = first, last_name = last, username = username, email = email)
			analysts = Group.objects.get(name="analysts")
			if created:
				user.set_password(password)
				user.groups.add(analysts)
				user.is_active = True
				user.save()

				json['success'] = True
				json['text'] = "Registration successful"
			else:
				json['success'] = False
				json['error'] = "Username already taken"

		else:
			json['success'] = False
			json['error'] = "Passwords do not match"

	else:
		json['error'] = form.errors
	
	return HttpResponse(simplejson.dumps(json, cls=DjangoJSONEncoder))

