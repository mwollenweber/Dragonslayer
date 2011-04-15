from django import forms

class search_form(forms.Form):
        search_type = forms.CharField(max_length=100)
        search_value = forms.CharField(max_length=1000)
        start = forms.IntegerField(required=False)
        limit = forms.IntegerField(required=False)

