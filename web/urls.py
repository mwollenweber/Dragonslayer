import os

from django.conf.urls.defaults import *
from django.conf import settings
from django.views.generic.simple import direct_to_template

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # pages
    (r'^admin/', include(admin.site.urls)),
    (r'^login/$', direct_to_template, {'template': 'auth/login.html'}),
    (r'^register/$', direct_to_template, {'template': 'register/register.html'}),
    (r'^$', direct_to_template, {'template': 'core/index.html'}),

    # processing
    (r'^validate/$', 'apps.auth.views.ext_login'),
    (r'^process_register/$', 'apps.register.views.ext_register'),
    (r'^check_auth/$', 'apps.core.views.check_auth'),

    # serve static files
    (r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.join(settings.BASE_DIR, 'media'),
         'show_indexes': True}),
)


