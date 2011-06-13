import simplejson
import urllib
import urllib2

url = "http://127.0.0.1/mop_rest/api/status?"
params = { "hash":"09a0f7aae0e22b5d80c7950890f3f738" }
data = urllib.urlencode(params)
req = urllib2.Request(url, data)
response = urllib2.urlopen(req)
json = response.read()
print json
