from flask import Flask, request, jsonify, session, render_template, make_response, send_file
import time
from flask_cors import CORS
from pymongo import MongoClient
import json
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
import pdfkit
import datetime
from draftjs_exporter.html import HTML
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, jwt_refresh_token_required, get_raw_jwt
)


# initializations
app = Flask(__name__)
CORS(app)
app.secret_key = 'super secret key'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
SESSION_TYPE = 'redis'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
blacklist = set()

client = MongoClient('mongodb://localhost:27017/')

credentials_collection = client['WriteFreeDB']['credentials']
notes_collection = client['WriteFreeDB']['notes']

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route('/create-account-google', methods= ['POST', 'OPTIONS'])
def create_google():
    email = request.args['email']
    google_id = request.args['google_id']
    name = request.args['name']
    createdAt = datetime.datetime.fromtimestamp(time.time()).strftime('%c')
    # hash the googleID and save it in pw_hash
    pw_hash = bcrypt.generate_password_hash(google_id.encode('utf-8'))
    if (credentials_collection.find_one({'email': email})):
        return "An account already exists with " + email, 401
    else:
        savedDocument = {
         "createdAt": createdAt,
         "email": email,
         "fullName": name,
         "password": pw_hash,
         "runTutorial": True,
         "defaultNoteSettings": {},
        }
        credentials_collection.insert_one(savedDocument)
        savedDocument["_id"] = str(savedDocument["_id"])
        del savedDocument['password']
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify({"credentials": savedDocument, "access_token": access_token, "refresh_token": refresh_token}), 200;

# create account and store info into DB
@app.route('/create-account', methods= ['POST', 'OPTIONS'])
def create():
    email = request.args['email']
    fullName = request.args['fullName']
    password = request.args['password']
    createdAt = datetime.datetime.fromtimestamp(time.time()).strftime('%c')
    # hash the password and save it in pw_hash
    pw_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
    if(credentials_collection.find_one({'email': email})):
        return "An account already exists with " + email, 401
    else:
        savedDocument = {
            "createdAt": createdAt,
            "email": email,
            "fullName": fullName,
            "password": pw_hash,
            "runTutorial": True,
            "defaultNoteSettings": {},
        }
        credentials_collection.insert_one(savedDocument)
        savedDocument["_id"] = str(savedDocument["_id"])
        del savedDocument['password']
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify({"credentials": savedDocument, "access_token": access_token, "refresh_token": refresh_token}), 200;


# verify username and password, returns account details and notes
@app.route('/login', methods= ['GET', 'OPTIONS'])
def login():
    email = request.args['email']
    password = request.args['password']
    credentials = credentials_collection.find_one({'email': email})
    if (credentials):
        hashed_password = bcrypt.generate_password_hash(password)
        if (bcrypt.check_password_hash(hashed_password, password.encode('utf-8'))):
            credentials["_id"] = str(credentials["_id"])
            del credentials["password"]
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            return jsonify({"credentials": credentials, "access_token": access_token, "refresh_token": refresh_token}), 200;
        return "Invalid Email or Password", 401;
    return "Email Does Not Exist", 401

@app.route('/login-google', methods= ['GET', 'OPTIONS'])
def login_google():
    email = request.args['email']
    google_id = request.args['googleID']
    credentials = credentials_collection.find_one({'email': email})
    if (credentials):
        if (bcrypt.check_password_hash(credentials['password'], google_id.encode('utf-8'))):
            credentials["_id"] = str(credentials["_id"])
            del credentials["password"]
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            return jsonify({"credentials": credentials, "access_token": access_token, "refresh_token": refresh_token}), 200;
        return "Invalid Email or Password", 401;
    return "Email Does Not Exist", 401


@app.route('/get-default-settings', methods= ['GET', 'OPTIONS'])
def getDefaultSettings():
    email = request.args['email']
    credentials = credentials_collection.find_one({'email': email})
    credentials["_id"] = str(credentials["_id"])
    del credentials['password']
    return jsonify({"credentials": credentials}), 200;

@app.route('/get-notes', methods= ['GET', 'OPTIONS'])
def getNotes():
    email = request.args['email']
    arrayOfNotes = getArrayOfNotes(email)
    return jsonify({"notes": arrayOfNotes}), 200


@app.route ('/delete-note', methods= ['DELETE', 'OPTIONS'])
def deleteNote():
    email = request.args['email']
    noteID = request.args['noteID']
    notes_collection.delete_one({'email': email, "_id": ObjectId(noteID)})
    arrayOfNotes = getArrayOfNotes(email)
    return jsonify({"notes": arrayOfNotes}), 200


@app.route ('/new-note', methods= ['POST', 'OPTIONS'])
def addNote():
    email = request.args['email']
    userData = credentials_collection.find_one({"email": email})
    defaultNoteSettings = userData['defaultNoteSettings']['draftjsObj']

    baseNewNote = {
        "email": email,
        "title": None,
        "createdAt": datetime.datetime.fromtimestamp(time.time()).strftime('%c'),
        "content": None,
        "noteSettings": defaultNoteSettings,
        "lastUpdated": datetime.datetime.fromtimestamp(time.time()).strftime('%c'),
        "category": None,

    }
    _id = notes_collection.insert(baseNewNote)
    x = notes_collection.find_one({"_id": ObjectId(_id)})
    x["_id"] = str(x["_id"])
    return jsonify(x), 200

@app.route ('/save-note', methods= ['POST', 'GET', 'OPTIONS'])
def saveNote():
    form_data = json.loads(request.get_data())
    query = {"_id": ObjectId(form_data["noteID"])}
    new_values={"title": form_data['title'], "category": form_data['category'], "content": form_data['noteContent'], "lastUpdated": datetime.datetime.fromtimestamp(time.time()).strftime('%c')}
    notes_collection.update_one(query, {"$set": new_values})
    return "HI", 200

@app.route ('/update-default-settings', methods= ['POST', 'OPTIONS'])
def updateDefaultSettings():
    form_data = json.loads(request.get_data())
    email = form_data['email']
    noteColor = form_data['noteColor']
    fontName = form_data['fontName']
    fontSize = form_data['fontSize']
    draftjs = {"blocks":[{"key":"9043t","text":" ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":1,"style":"fontsize-" + str(fontSize)},{"offset":0,"length":1,"style":"fontfamily-" + fontName}],"entityRanges":[],"data":{}}],"entityMap":{}}
    query = {'$set': {'defaultNoteSettings': {'noteColor': noteColor, 'fontName': fontName, 'fontSize': fontSize, 'draftjsObj': draftjs}}}
    credentials_collection.find_one_and_update({'email': email}, query)
    return "HI", 200

@app.route ('/remove-tutorial', methods= ['POST', 'OPTIONS'])
def removeTutorial():
    query = {'$set': {'runTutorial': False}}
    credentials_collection.find_one_and_update({'email': request.args['email']}, query)
    return "HI", 200

@app.route ('/fetch-note/<note_id>', methods= ['GET', 'OPTIONS'])
def fetchNote(note_id):
    print("fetch")
    email = request.args['email']
    noteID = request.args['noteID']
    print(email, noteID)
    data = notes_collection.find_one({'email': email, "_id": ObjectId(noteID)})
    data["_id"] = str(data["_id"])
    return jsonify(data), 200

@app.route ('/renderPDF', methods= ['GET', 'OPTIONS'])
def renderPDF():
    noteID = request.args['noteID']
    noteData = notes_collection.find_one({'_id': ObjectId(noteID)})
    noteContent = noteData['content']
    config = {

    }
    exporter = HTML(config)
    noteHTML = exporter.render(noteContent)

    pdf = pdfkit.from_string(noteHTML, False)

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=output.pdf'
    return response

#####JWT!!!######

# verify username and password, returns account details and notes
@app.route('/get-data', methods= ['GET'])
@jwt_required
def getData():
    current_user = get_jwt_identity()
    print("HERE", current_user)
    credentials = credentials_collection.find_one({'email': current_user})
    print(credentials)
    if (credentials):
        arrayOfNotes = getArrayOfNotes(current_user)
        credentials["_id"] = str(credentials["_id"])
        del credentials["password"]
        return jsonify({"notes": arrayOfNotes, "credentials": credentials}), 200;
    return "Invalid Email or Password", 401;

# verify username and password, returns account details and notes
@app.route('/verify', methods= ['GET'])
@jwt_required
def verify():
    current_user = get_jwt_identity()
    bool = False
    credentials = credentials_collection.find_one({'email': current_user})
    if(credentials):
        bool = True
    return jsonify({"bool": bool}), 200;

#Reissue a jwt token
@app.route('/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    ret = {
        'access_token': create_access_token(identity=current_user)
    }
    return jsonify(ret), 200


# Endpoint for revoking the current users access token
@app.route('/logout', methods=['GET'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


# Endpoint for revoking the current users refresh token
@app.route('/logout2', methods=['GET'])
@jwt_refresh_token_required
def logout2():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged2 out"}), 200


def getArrayOfNotes(email):
    userNotes = notes_collection.find({'email': email})
    arrayOfNotes = []
    for doc in userNotes:
        doc["_id"] = str(doc["_id"])
        arrayOfNotes.append(doc)
    return arrayOfNotes