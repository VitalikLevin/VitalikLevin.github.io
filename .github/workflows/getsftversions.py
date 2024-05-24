from datetime import datetime
import logging
import json
from urllib import request
strt = datetime.utcnow()
logfile = logging.FileHandler("steamyfish.log")
resstr = ""
result = open("_data/sft.yml", "w", encoding="utf-8")
consoleOut = logging.StreamHandler()
logging.basicConfig(handlers=(consoleOut, logfile), level=logging.DEBUG, format="#%(levelname)s %(asctime)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
def timespent(strt):
    finish = datetime.utcnow()
    logging.info(f"Finished")
    logging.info(f"Time passed - {str(finish - strt)}\n===END===")
requ = request.Request("https://api.github.com/repos/VitalikLevin/steamyfish-theme/releases", method="GET")
resp = request.urlopen(requ)
logging.debug(f"GitHub API - {resp.status} {resp.reason}")
answer = resp.read()
answdict = json.loads(answer)
for tagdict in answdict:
    justverarr = tagdict["name"].lstrip("v").split(".")
    resstr += f"- major: {justverarr[0]}\n  minor: {justverarr[1]}\n"
    if justverarr[2] != "0":
        resstr += f"  patch: {justverarr[2]}\n"
    resstr += f"  date: {tagdict['published_at']}\n"
result.write(resstr.rstrip("\n"))
result.close()
timespent(strt)