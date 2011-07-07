import simplejson
import postfile

file = "/home/brandon/Desktop/pascoe.pdf"
fields = [("key", "123456")]
host = "127.0.0.1"
url = "http://127.0.0.1/mop_rest/api/submit"
file_to_send = open(file,"rb").read()
files = [("file",file,file_to_send)]
json = postfile.post_multipart(host,url,fields,files)
print json
