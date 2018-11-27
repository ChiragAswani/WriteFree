from flask import Flask, request, jsonify, session, render_template, make_response, send_file
import time
from flask_cors import CORS
from pymongo import MongoClient
import json
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
import pdfkit
import datetime
from draftjs_exporter.constants import BLOCK_TYPES, ENTITY_TYPES
from draftjs_exporter.defaults import BLOCK_MAP, STYLE_MAP
from draftjs_exporter.dom import DOM
from draftjs_exporter.html import HTML

import MongoDBCalls as dbcalls
import control as control
# initializations
db_address = 'mongodb://localhost:27017/'
app = Flask(__name__)
CORS(app)
app.secret_key = 'super secret key'
SESSION_TYPE = 'redis'
bcrypt = Bcrypt(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'WriteFreeDB',
    'host': '127.0.0.1',
    'port': 27017
}
client = MongoClient(db_address)
db = client['WriteFreeDB']
credentials_collection = db['credentials']
notes_collection = db['notes']

@app.before_request
def session_management():
    # make the session last indefinitely until it is cleared
    session.permanent = True

@app.route('/create-account_google', methods= ['POST', 'OPTIONS'])
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
        return (document, 200)

# create account and store info into DB
@app.route('/create-account', methods= ['POST', 'OPTIONS'])
def create():
    email = request.args['email']
    fullName = request.args['fullName']
    password = request.args['password']
    createdAt = datetime.datetime.fromtimestamp(time.time()).strftime('%c')
    # hash the password and save it in pw_hash
    pw_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
    if dbcalls.DB_find_one(credentials_collection, {'email': email}):
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
        document = control.new_account(credentials_collection, savedDocument)
        return (document, 200)

# verify username and password, returns account details and notes
@app.route('/login', methods= ['GET', 'OPTIONS'])
def login():
    email = request.args['email']
    password = request.args['password']
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    if (credentials):

        # what does this if case do?
        if (bcrypt.check_password_hash(credentials['password'], password.encode('utf-8'))):
            arrayOfNotes = control.getArrayOfNotes(notes_collection, email)
        hashed_password = bcrypt.generate_password_hash(password)
        if (bcrypt.check_password_hash(hashed_password, password.encode('utf-8'))):
            notes_and_credential = control.get_note_and_credential(notes_collection, credentials, email)
            return notes_and_credential, 200
        return "Invalid Email or Password", 401
    return "Email Does Not Exist", 401

@app.route('/login_google', methods= ['GET', 'OPTIONS'])
def login_google():
    email = request.args['email']
    google_id = request.args['google_id']
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    if (credentials):
        if (bcrypt.check_password_hash(credentials['password'], google_id.encode('utf-8'))):
            notes_and_credential = control.get_note_and_credential(notes_collection, credentials, email)
            return notes_and_credential, 200
        return "Invalid Email or Password", 401
    return "Email Does Not Exist", 401

@app.route('/get-default-settings', methods= ['GET', 'OPTIONS'])
def getDefaultSettings():
    email = request.args['email']
    credentials = control.get_credential(credentials_collection, email)
    return credentials, 200

# verify username and password, returns account details and notes
@app.route('/get-data', methods= ['GET', 'OPTIONS'])
def getData():
    email = request.args['email']
    id = request.args['id']
    credentials = dbcalls.DB_find_one(credentials_collection, {'email': email})
    db_id = credentials['_id']
    if (credentials):
        if (id == str(db_id)):
            notes_and_credential = control.get_note_and_credential(notes_collection, credentials, email)
            return notes_and_credential, 200
        return "Invalid Email or Password", 401
    return "Email Does Not Exist", 401

@app.route('/get-notes', methods= ['GET', 'OPTIONS'])
def getNotes():
    email = request.args['email']
    notes = control.get_note(notes_collection, email)
    return notes, 200

@app.route ('/delete-note', methods= ['DELETE', 'OPTIONS'])
def deleteNote():
    email = request.args['email']
    noteID = request.args['noteID']

    dbcalls.DB_delete_one(notes_collection, {'email': email, "_id": ObjectId(noteID)})
    notes = control.get_note(notes_collection, email)
    return notes, 200

@app.route ('/new-note', methods= ['POST', 'OPTIONS'])
def addNote():
    email = request.args['email']
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
    }
    notes = control.add_note(notes_collection, baseNewNote)
    return notes, 200

@app.route ('/save-note', methods= ['POST', 'GET', 'OPTIONS'])
def saveNote():
    form_data = json.loads(request.get_data())
    control.save_note(notes_collection, form_data)
    return "SAVED", 200

@app.route ('/update-default-settings', methods= ['POST', 'OPTIONS'])
def updateDefaultSettings():
    form_data = json.loads(request.get_data())
    control.update_default_setting(credentials_collection, form_data)
    return "Default setting updated", 200

@app.route ('/remove-tutorial', methods= ['POST', 'OPTIONS'])
def removeTutorial():
    _id = ObjectId(request.args['_id'])
    control.disable_tutorial(credentials_collection, _id)
    return "Tutorial disabled", 200

@app.route ('/fetch-note/<note_id>', methods= ['GET', 'OPTIONS'])
def fetchNote(note_id):
    email = request.args['email']
    noteID = request.args['noteID']
    note_fetched = control.fetch_note(notes_collection, {'email': email, "_id": ObjectId(noteID)})
    return note_fetched, 200

@app.route ('/renderPDF', methods= ['GET', 'OPTIONS'])
def renderPDF():
    noteID = request.args['noteID']
    response = control.render_PDF(notes_collection, noteID)
    return response
