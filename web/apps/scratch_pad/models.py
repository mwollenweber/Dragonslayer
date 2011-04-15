from django.db import models

class Scratch(models.Model):
    scratch = models.TextField(blank=True)

    def __unicode__(self):
        return self.scratch
