import datetime
import json
from time import sleep
from urllib import request
import xml.etree.ElementTree as ET
start = datetime.datetime.now()
def timecount(strt):
    finish = datetime.datetime.now()
    print(f"Finished | {finish}")
    print(f"Time passed | {str(finish - strt)}")
print(f"Started | {start}")
reqOld = request.Request("https://vitaliklevin.github.io/sitemap.xml", method="GET")
resOld = request.urlopen(reqOld)
print(resOld.status, resOld.reason)
dataSMOld = resOld.read()
sleep(180)
requ = request.Request("https://vitaliklevin.github.io/sitemap.xml", method="GET")
resp = request.urlopen(requ)
print(resp.status, resp.reason)
root = ""
dataSM = resp.read()
if (dataSM != dataSMOld):
    root = ET.fromstring(dataSM)
else:
    print("Sitemap wasn't modified")
    timecount(start)
    quit()
rawUrls = ""
key = "68537cd552ad4fc992f52fd5685725b2"
for url in list(root):
    for uChild in list(url):
        if (uChild.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
            rawUrls += f"{uChild.text}\n"
rawUrls = rawUrls.rstrip("\n")
urlList = rawUrls.split("\n")
req1 = request.Request("https://yandex.com/indexnow", method="POST")
req1.add_header("Content-Type", "application/json")
req1Data = {
    "host": "vitaliklevin.github.io",
    "key": key,
    "urlList": urlList
}
req1Data = json.dumps(req1Data)
req1Data = req1Data.encode()
r1 = request.urlopen(req1, data=req1Data)
res1 = request.urlopen(req1)
print(res1.status, res1.reason)
timecount(start)