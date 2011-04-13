from django import forms

class helper_doc_form(forms.Form):
        type = forms.CharField(max_length=100)
        name  = forms.CharField(max_length=100)
        helper_typer = forms.CharField(max_length=100,required=False)
        user = forms.CharField(max_length=100,required=False)
        content = forms.CharField(max_length=10000,required=False)
