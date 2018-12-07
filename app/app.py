from flask import Flask, request, jsonify, session, render_template, make_response, send_file
import time
from flask_cors import CORS
from flask import Flask, request, jsonify, session, render_template, make_response, send_file
import time
from pymongo import MongoClient
import json
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
import pdfkit
import datetime
from draftjs_exporter.html import HTML
import MongoDBCalls as dbcalls
import control as control
import re

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, jwt_refresh_token_required, get_raw_jwt
)

# initializations
db_address = 'mongodb://localhost:27017/'
app = Flask(__name__)
CORS(app)
app.secret_key = 'super secret key'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
SESSION_TYPE = 'redis'
bcrypt = Bcrypt(app)

#JWT stuff ->
jwt = JWTManager(app)
blacklist = set()
CORS(app, expose_headers='Authorization')

client = MongoClient('mongodb://localhost:27017/')

credentials_collection = client['WriteFreeDB']['credentials']
notes_collection = client['WriteFreeDB']['notes']
application_collection = client['WriteFreeDB']['application']

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
    # account exists
    if dbcalls.DB_find_one(credentials_collection, {'email': email}):
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
        document = control.new_account(credentials_collection, savedDocument)
        return document, 200

# create account and store info into DB
@app.route('/create-account', methods= ['POST', 'OPTIONS'])
def create():
    email = request.args['email']
    fullName = request.args['fullName']
    password = request.args['password']
    match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', email)
    if (match == None):
        return "invalid email address", 501
    if(len(fullName) == 0):
        return "invalid name", 502
    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
    if( len(password) < 8 or regex.search(password) == None ):
        return "invalid password", 503

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
@app.route('/login', methods= ['GET'])
def login():
    email = request.args['email']
    password = request.args['password']
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    if (credentials):
        if (bcrypt.check_password_hash(credentials['password'], password.encode('utf-8'))):
            login_credential = control.get_credential(credentials, email)
            return login_credential, 200
        return "Invalid Email or Password", 401
    return "Email Does Not Exist", 401

@app.route('/login-google', methods= ['GET', 'OPTIONS'])
def login_google():
    email = request.args['email']
    google_id = request.args['googleID']
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    if (credentials):
        if (bcrypt.check_password_hash(credentials['password'], google_id.encode('utf-8'))):
            login_credential = control.get_credential(credentials, email)
            return login_credential, 200
        return "Invalid Email or Password", 401
    return "Email Does Not Exist", 401

@app.route('/get-default-settings', methods= ['GET'])
@jwt_required
def getDefaultSettings():
    email = get_jwt_identity()
    cred_and_setting = control.get_default_setting(credentials_collection, application_collection, email)
    return cred_and_setting, 200

@app.route('/get-notes', methods= ['GET'])
@jwt_required
def getNotes():
    email = get_jwt_identity()
    # form_data = json.loads(request.get_data())
    notes = control.get_note(notes_collection, email)
    return notes, 200

@app.route ('/delete-note', methods= ['DELETE', 'OPTIONS'])
@jwt_required
def deleteNote():
    email = get_jwt_identity()
    noteID = request.args['noteID']
    dbcalls.DB_delete_one(notes_collection, {'email': email, "_id": ObjectId(noteID)})
    notes = control.get_note(notes_collection, email)
    return notes, 200

@app.route ('/new-note', methods= ['GET'])
@jwt_required
def addNote():
    email = get_jwt_identity()
    print(email)
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    defaultNoteSettings = credentials['defaultNoteSettings']['draftjsObj']
    baseNewNote = {
        "email": email,
        "title": None,
        "createdAt": datetime.datetime.fromtimestamp(time.time()).strftime('%c'),
        "content": None,
        "noteSettings": defaultNoteSettings,
        "lastUpdated": datetime.datetime.fromtimestamp(time.time()).strftime('%c'),
        "category": None,
        "noteColor": credentials['defaultNoteSettings']['noteColor'],
        "wordSpacing": "0.9px",
        "lineSpacing": "0.05"
    }
    notes = control.add_note(notes_collection, baseNewNote)
    return notes, 200

@app.route ('/save-note', methods= ['POST'])
@jwt_required
def saveNote():
    print(get_jwt_identity())
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': get_jwt_identity()})
    if (credentials):
        form_data = json.loads(request.get_data())
        control.save_note(notes_collection, form_data)
        return "SAVED", 200
    return "NOT SAVED", 400

@app.route ('/update-default-settings', methods= ['POST'])
@jwt_required
def updateDefaultSettings():
    email = get_jwt_identity()
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    if credentials:
        form_data = json.loads(request.get_data())
        form_data_new = json.loads(form_data['body'])
        control.update_default_setting(credentials_collection, form_data_new, email)
        return "Default Setting updated", 200
    else:
        return "Error with JWT", 400

@app.route ('/remove-tutorial', methods= ['POST', 'OPTIONS'])
def removeTutorial():
    email = request.args['email']
    control.disable_tutorial(credentials_collection, email)
    return "Tutorial disabled", 200

@app.route ('/change-note-color', methods= ['POST', 'OPTIONS'])
def changeNoteColor():
    noteID = ObjectId(request.args['noteID'])
    noteColor = request.args['noteColor']
    query = {'$set': {'noteColor': noteColor}}
    dbcalls.DB_find_one_and_update(notes_collection, {'_id': noteID}, query)
    return "Note Color Changed", 200

@app.route ('/fetch-note/<note_id>', methods= ['GET'])
@jwt_required
def fetchNote(note_id):
    email = get_jwt_identity()
    noteID = request.args['noteID']
    note_fetched = control.fetch_note(notes_collection, {'email': email, "_id": ObjectId(noteID)})
    return note_fetched, 200

@app.route ('/renderPDF', methods= ['GET', 'OPTIONS'])
def renderPDF():
    noteID = request.args['noteID']
    response = control.render_PDF(notes_collection, noteID)
    return response

@app.route ('/change-word-spacing', methods= ['POST', 'OPTIONS'])
def changeWordSpacing():
    form_data = json.loads(request.get_data())
    noteID = form_data['noteID']
    wordSpacing = form_data['wordSpacing']
    query = {'$set': {'wordSpacing': wordSpacing}}
    print(ObjectId(noteID), wordSpacing)
    notes_collection.find_one_and_update({'_id': ObjectId(noteID)}, query)
    return "HI", 200

@app.route ('/change-line-spacing', methods= ['POST', 'OPTIONS'])
def changeLineSpacing():
    form_data = json.loads(request.get_data())
    noteID = form_data['noteID']
    lineSpacing = form_data['lineSpacing']
    query = {'$set': {'lineSpacing': lineSpacing}}
    notes_collection.find_one_and_update({'_id': ObjectId(noteID)}, query)
    return "HI", 200

#####JWT!!!######
# verify username and password, returns account details and notes
@app.route('/get-data', methods= ['GET'])
@jwt_required
def getData():
    current_user = get_jwt_identity()
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': current_user})
    if (credentials):
        note_and_credential = control.get_note_and_credential(notes_collection, credentials, current_user)
        return note_and_credential, 200
    return "Invalid Email or Password", 401

# verify username and password, returns account details and notes
@app.route('/verify', methods= ['GET'])
@jwt_required
def verify():
    current_user = get_jwt_identity()
    bool = False
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': current_user})
    if(credentials):
        bool = True
    return jsonify({"bool": bool}), 200

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
