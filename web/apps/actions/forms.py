from django import forms

class search_form(forms.Form):
        search_type = forms.CharField(max_length=100)
        search_value = forms.CharField(max_length=1000)
        start = forms.IntegerField(required=False)
        limit = forms.IntegerField(required=False)
        
class update_case_form(forms.Form):
        dsid = forms.IntegerField(required=False)
        event = forms.CharField(max_length=100,required=False)
        victim = forms.CharField(max_length=15,required=False)
        attacker = forms.CharField(max_length=15,required=False)
        network = forms.CharField(max_length=100,required=False)
        dns = forms.CharField(max_length=100,required=False)
        primary = forms.CharField(max_length=100,required=False)
        secondary = forms.CharField(max_length=100,required=False)
        verification = forms.CharField(max_length=5000,required=False)
        notes = forms.CharField(max_length=5000,required=False)
        analyst = forms.CharField(max_length=100,required=False)
        detection_date = forms.DateField(required=False)
        category = forms.CharField(max_length=100,required=False)
        dhcp_info = forms.CharField(max_length=500,required=False)
        netid = forms.CharField(max_length=100,required=False)
        
