import hashlib
from random import randint
import sqlite3
import os


__path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def createSessId():
    randomString = f'{randint(1, 9) * randint(1, 9) * randint(1, 9) / randint(1, 9) + randint(-1000, +1000)}'
    hash_object = hashlib.md5(randomString.encode())
    sessid = hash_object.hexdigest()
    return sessid


def searchSaveTasks(sessid):
    tasksJson = {"tasks":[]}
    con = sqlite3.connect(f"{__path}/DB/usersData.db")
    cur = con.cursor()
    cur.execute(f"SELECT * FROM usersData WHERE SESSID = '{sessid}';")
    tasks = cur.fetchall()
    for row in tasks:
        tasksJson["tasks"].append({"sessid":row[1], "date":row[2], "text":row[3], "state":row[4]})

    return tasksJson


def saveTasks(sessid, tasks):
    con = sqlite3.connect(f"{__path}/DB/usersData.db")
    cur = con.cursor()
    
    if(tasks[0]['task']['date'] == "Clear all entries"):
         cur.execute(f"DELETE FROM usersData WHERE SESSID = '{sessid}';")
         con.commit()
        
    else:
        cur.execute(f"DELETE FROM usersData WHERE SESSID LIKE '{sessid}';")
        for i in range(len(tasks)):
            cur.execute(f"INSERT INTO usersData (SESSID, dateTime, textTask, state) VALUES('{sessid}', '{tasks[i]['task']['date']}', '{tasks[i]['task']['text']}', '{tasks[i]['task']['state']}')", )
            con.commit()
    
    return 

