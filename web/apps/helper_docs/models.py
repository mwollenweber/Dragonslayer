from django.db import models

class Documenter(models.Model):
    name = models.CharField(max_length=765)
    type = models.CharField(max_length=765)
    last_edit = models.DateTimeField()
    last_user_edit = models.CharField(max_length=765)
    content = models.TextField()

