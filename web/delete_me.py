# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order
#     * Make sure each model has one field with primary_key=True
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.

from django.db import models

class Analysts(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=765)
    password = models.CharField(max_length=765)
    email = models.CharField(max_length=765)
    first_name = models.CharField(max_length=765)
    last_name = models.CharField(max_length=765)
    active = models.IntegerField()
    last_login = models.DateTimeField()
    role = models.CharField(max_length=765, blank=True)
    class Meta:
        db_table = u'analysts'

class Attachments(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    case_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=96, blank=True)
    type = models.CharField(max_length=96, blank=True)
    size = models.IntegerField(null=True, blank=True)
    content = models.TextField()
    md5 = models.CharField(max_length=96, blank=True)
    class Meta:
        db_table = u'attachments'

class AttackerEdges(models.Model):
    x = models.IntegerField(primary_key=True)
    y = models.IntegerField(primary_key=True)
    class Meta:
        db_table = u'attacker_edges'

class AttackerIgnore(models.Model):
    id = models.IntegerField(primary_key=True)
    ip = models.IntegerField()
    tdstamp = models.DateTimeField()
    expire = models.DateTimeField()
    notes = models.CharField(max_length=768, blank=True)
    class Meta:
        db_table = u'attacker_ignore'

class AttackerVictimIgnore(models.Model):
    id = models.IntegerField(primary_key=True)
    ip1 = models.IntegerField()
    ip2 = models.IntegerField()
    tdstamp = models.DateTimeField()
    expire = models.DateTimeField(null=True, blank=True)
    notes = models.CharField(max_length=768, blank=True)
    class Meta:
        db_table = u'attacker_victim_ignore'

class Attackers(models.Model):
    ip = models.IntegerField(primary_key=True)
    class Meta:
        db_table = u'attackers'

class AuthGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=240)
    class Meta:
        db_table = u'auth_group'

class AuthGroupPermissions(models.Model):
    id = models.IntegerField(primary_key=True)
    group_id = models.IntegerField()
    permission_id = models.IntegerField()
    class Meta:
        db_table = u'auth_group_permissions'

class AuthMessage(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    message = models.TextField()
    class Meta:
        db_table = u'auth_message'

class AuthPermission(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=150)
    content_type_id = models.IntegerField()
    codename = models.CharField(unique=True, max_length=300)
    class Meta:
        db_table = u'auth_permission'

class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(unique=True, max_length=90)
    first_name = models.CharField(max_length=90)
    last_name = models.CharField(max_length=90)
    email = models.CharField(max_length=225)
    password = models.CharField(max_length=384)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    is_superuser = models.IntegerField()
    last_login = models.DateTimeField()
    date_joined = models.DateTimeField()
    class Meta:
        db_table = u'auth_user'

class AuthUserGroups(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    group_id = models.IntegerField()
    class Meta:
        db_table = u'auth_user_groups'

class AuthUserUserPermissions(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    permission_id = models.IntegerField()
    class Meta:
        db_table = u'auth_user_user_permissions'

class Badv(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'badv'

class CaseNotes(models.Model):
    id = models.IntegerField(primary_key=True)
    dsid = models.IntegerField()
    notes = models.TextField(blank=True)
    user = models.IntegerField(null=True, blank=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    class Meta:
        db_table = u'case_notes'

class Critical(models.Model):
    ip = models.IntegerField(primary_key=True)
    notes = models.TextField(blank=True)
    class Meta:
        db_table = u'critical'

class DjangoAdminLog(models.Model):
    id = models.IntegerField(primary_key=True)
    action_time = models.DateTimeField()
    user_id = models.IntegerField()
    content_type_id = models.IntegerField(null=True, blank=True)
    object_id = models.TextField(blank=True)
    object_repr = models.CharField(max_length=600)
    action_flag = models.IntegerField()
    change_message = models.TextField()
    class Meta:
        db_table = u'django_admin_log'

class DjangoContentType(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=300)
    app_label = models.CharField(unique=True, max_length=300)
    model = models.CharField(unique=True, max_length=300)
    class Meta:
        db_table = u'django_content_type'

class DjangoSession(models.Model):
    session_key = models.CharField(max_length=120, primary_key=True)
    session_data = models.TextField()
    expire_date = models.DateTimeField()
    class Meta:
        db_table = u'django_session'

class DjangoSite(models.Model):
    id = models.IntegerField(primary_key=True)
    domain = models.CharField(max_length=300)
    name = models.CharField(max_length=150)
    class Meta:
        db_table = u'django_site'

class Dns(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    fqdn = models.CharField(max_length=384, blank=True)
    ip = models.IntegerField(null=True, blank=True)
    data_source = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'dns'

class Dragon(models.Model):
    tdstamp = models.DateTimeField()
    event = models.CharField(max_length=150, blank=True)
    srcip = models.IntegerField()
    dstip = models.IntegerField()
    sport = models.IntegerField(null=True, blank=True)
    dport = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'dragon'

class DragonWorking(models.Model):
    tdstamp = models.DateTimeField()
    event = models.CharField(max_length=150, blank=True)
    srcip = models.IntegerField()
    dstip = models.IntegerField()
    sport = models.IntegerField(null=True, blank=True)
    dport = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'dragon_working'

class Gwcases(models.Model):
    id = models.IntegerField(primary_key=True)
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
    primary_detection = models.IntegerField(null=True, blank=True)
    secondary_detection = models.IntegerField(null=True, blank=True)
    event_type = models.IntegerField(null=True, blank=True)
    discovered = models.DateTimeField(null=True, blank=True)
    reporter = models.CharField(max_length=96, blank=True)
    report_category = models.IntegerField(null=True, blank=True)
    dhcp_info = models.TextField(blank=True)
    netid = models.CharField(max_length=96, blank=True)
    class Meta:
        db_table = u'gwcases'

class GwcasesBkup(models.Model):
    id = models.IntegerField(primary_key=True)
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
    primary_detection = models.IntegerField(null=True, blank=True)
    secondary_detection = models.IntegerField(null=True, blank=True)
    event_type = models.IntegerField(null=True, blank=True)
    discovered = models.DateTimeField(null=True, blank=True)
    reporter = models.CharField(max_length=96, blank=True)
    report_category = models.IntegerField(null=True, blank=True)
    dhcp_info = models.TextField(blank=True)
    netid = models.CharField(max_length=96, blank=True)
    class Meta:
        db_table = u'gwcases_bkup'

class HelperDocs(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=765)
    type = models.CharField(max_length=765)
    last_edit = models.DateTimeField()
    last_user_edit = models.CharField(max_length=765)
    content = models.TextField()
    class Meta:
        db_table = u'helper_docs'

class Host2Ip(models.Model):
    id = models.IntegerField(primary_key=True)
    hostname = models.CharField(max_length=384)
    ip = models.IntegerField()
    tdstamp = models.DateTimeField()
    class Meta:
        db_table = u'host2ip'

class HourlyDragonBad(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'hourly_dragon_bad'

class HourlyDragonMdl(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'hourly_dragon_mdl'

class Ipalerts(models.Model):
    ip = models.IntegerField(primary_key=True)
    notes = models.CharField(max_length=768, blank=True)
    class Meta:
        db_table = u'ipalerts'

class MacLookup(models.Model):
    id = models.IntegerField(primary_key=True)
    dev_name = models.CharField(max_length=192)
    mac_addr = models.BigIntegerField()
    class Meta:
        db_table = u'mac_lookup'

class MacView(models.Model):
    ip = models.IntegerField()
    mac = models.CharField(max_length=120)
    class Meta:
        db_table = u'mac_view'

class Mdl(models.Model):
    tdstamp = models.DateTimeField()
    url = models.CharField(max_length=300, blank=True)
    ip = models.IntegerField()
    lookup = models.CharField(max_length=150, blank=True)
    description = models.CharField(max_length=150, blank=True)
    registrant = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'mdl'

class Netblocks(models.Model):
    start = models.IntegerField(null=True, blank=True)
    end = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=75, blank=True)
    class Meta:
        db_table = u'netblocks'

class NetblocksBackup(models.Model):
    start = models.IntegerField(null=True, blank=True)
    end = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=75, blank=True)
    class Meta:
        db_table = u'netblocks_backup'

class NetblocksTest(models.Model):
    start = models.IntegerField(null=True, blank=True)
    end = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=75, blank=True)
    class Meta:
        db_table = u'netblocks_test'

class NormanUrl(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    url = models.CharField(max_length=762, blank=True)
    md5 = models.CharField(max_length=96, blank=True)
    originator_content = models.CharField(max_length=96, blank=True)
    originator_signature = models.CharField(max_length=192, blank=True)
    download_md5 = models.CharField(max_length=96, blank=True)
    download_content = models.CharField(max_length=96, blank=True)
    download_signature = models.CharField(max_length=96, blank=True)
    download_sandbox = models.CharField(max_length=96, blank=True)
    class Meta:
        db_table = u'norman_url'

class Patchy(models.Model):
    ip = models.IntegerField()
    dev_name = models.CharField(max_length=192)
    tdstamp = models.CharField(max_length=96, blank=True)
    id = models.IntegerField(primary_key=True)
    class Meta:
        db_table = u'patchy'

class SchoolEventHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    org = models.CharField(max_length=96, blank=True)
    count = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'school_event_history'

class ScratchPad(models.Model):
    scratch = models.TextField(blank=True)
    class Meta:
        db_table = u'scratch_pad'

class ShadowCcdns(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    fqdn = models.CharField(max_length=384)
    class Meta:
        db_table = u'shadow_ccdns'

class ShadowCcfull(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    ip = models.IntegerField()
    dport = models.IntegerField(null=True, blank=True)
    fqdn = models.CharField(max_length=384, blank=True)
    asn = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=24, blank=True)
    class Meta:
        db_table = u'shadow_ccfull'

class ShadowCcfullWorking(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    ip = models.IntegerField()
    dport = models.IntegerField(null=True, blank=True)
    fqdn = models.CharField(max_length=384, blank=True)
    asn = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=24, blank=True)
    class Meta:
        db_table = u'shadow_ccfull_working'

class ShadowCcip(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    ip = models.IntegerField()
    class Meta:
        db_table = u'shadow_ccip'

class Status(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=96)
    notes = models.TextField(blank=True)
    last_update = models.DateTimeField(null=True, blank=True)
    update_interval = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'status'

class TempBad(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'temp_bad'

class TempIgnore(models.Model):
    id = models.IntegerField(primary_key=True)
    ip = models.IntegerField()
    tdstamp = models.DateTimeField()
    expire = models.DateTimeField()
    notes = models.CharField(max_length=768, blank=True)
    class Meta:
        db_table = u'temp_ignore'

class TempMdl(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    event = models.CharField(max_length=192, blank=True)
    victim = models.IntegerField(null=True, blank=True)
    attacker = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'temp_mdl'

class TmpDragon(models.Model):
    tdstamp = models.DateTimeField(null=True, blank=True)
    sensor = models.CharField(max_length=60, blank=True)
    event = models.CharField(max_length=150, blank=True)
    srcip = models.CharField(max_length=150, blank=True)
    dstip = models.CharField(max_length=150, blank=True)
    sport = models.IntegerField(null=True, blank=True)
    dport = models.IntegerField(null=True, blank=True)
    x1 = models.CharField(max_length=150, blank=True)
    x2 = models.CharField(max_length=150, blank=True)
    x3 = models.CharField(max_length=150, blank=True)
    x4 = models.CharField(max_length=150, blank=True)
    x5 = models.CharField(max_length=150, blank=True)
    class Meta:
        db_table = u'tmp_dragon'

class Topsites(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField()
    site = models.CharField(max_length=384)
    rank = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'topsites'

class UrlHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    tdstamp = models.DateTimeField(null=True, blank=True)
    url = models.CharField(max_length=384, blank=True)
    src_ip = models.IntegerField(null=True, blank=True)
    dst_ip = models.IntegerField(null=True, blank=True)
    data_source = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'url_history'

class Users(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=96, blank=True)
    level = models.IntegerField()
    token = models.CharField(max_length=96, blank=True)
    identifier = models.CharField(max_length=96, blank=True)
    timeout = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'users'

