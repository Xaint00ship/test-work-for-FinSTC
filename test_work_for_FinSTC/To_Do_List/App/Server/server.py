from flask import Flask, request, make_response, jsonify, render_template, json
from flask_cors import cross_origin
from utils import createSessId, searchSaveTasks, saveTasks

app = Flask(__name__, static_url_path='')

def __init__(self, host, port):
    self.host = host
    self.port = port

@app.route('/')
def homePage():
    return render_template('index.html')
    

@app.route("/getSiteProgress", methods= ["GET"])
@cross_origin()
def getSiteProgress():
    if(request.cookies.get('SESSID')):
        tasks = searchSaveTasks(request.cookies.get('SESSID'))
        response = make_response(jsonify(tasks))
        return response
    else:
        return ("OK")


@app.route("/setSiteProgress", methods= ["POST"])
@cross_origin()
def setSiteProgress():
    
    tasks = json.loads(request.data)
    if(request.cookies.get('SESSID')):
        saveTasks(request.cookies.get('SESSID'), tasks)
        return "OK"

    else:
        sessid = createSessId()
        response = make_response(jsonify("Coockie success")) 
        response.set_cookie('SESSID', sessid, expires= 1667776584, max_age=60*60*24*30)
        saveTasks(sessid, tasks)
        return response
        

if __name__ == '__main__':
    app.run()