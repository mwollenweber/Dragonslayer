from django import forms

class register_form(forms.Form):
	username = forms.CharField(max_length=100,error_messages={'required': 'Please supply username'})
	email = forms.EmailField()
	first = forms.CharField(max_length=50,error_messages={'required': 'Please supply first name'})
	last = forms.CharField(max_length=50,error_messages={'required': 'Please supply last name'})
	password = forms.CharField(widget=forms.PasswordInput,error_messages={'required': 'Please supply password'})
	comfirm_password = forms.CharField(widget=forms.PasswordInput,error_messages={'required': 'Please supply confirm password'}

