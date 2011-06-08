from django.db import models

# previously hourly_dragon_mdl
class DailyMdl(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)

# previously badv
class DailyBadFiltered(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)

# previously gwcases
class GwCases(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    remedy_ticket = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    victim = models.IntegerField()
    event = models.CharField(max_length=96, blank=True)
    type = models.CharField(max_length=96, blank=True)
    notes = models.TextField(blank=True)
    network = models.CharField(max_length=96, blank=True)
    dns_name = models.CharField(max_length=192, blank=True)
    verification = models.TextField(blank=True)
    primary_detection = models.CharField(max_length=192, blank=True)
    secondary_detection = models.CharField(max_length=192, blank=True)
    event_type = models.IntegerField(null=True, blank=True)
    discovered = models.DateTimeField(null=True, blank=True)
    reporter = models.CharField(max_length=96, blank=True)
    report_category = models.IntegerField(null=True, blank=True)
    dhcp_info = models.TextField(blank=True)
    netid = models.CharField(max_length=96, blank=True)

# previously patchy
class Patchy(models.Model):
    ip = models.IntegerField()
    dev_name = models.CharField(max_length=192)
    tdstamp = models.CharField(max_length=96, blank=True)

