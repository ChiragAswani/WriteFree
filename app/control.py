import MongoDBCalls as dbcalls
from flask import jsonify, make_response, request
from bson.objectid import ObjectId
import datetime
import time
from draftjs_exporter.html import HTML
import pdfkit
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, jwt_refresh_token_required, get_raw_jwt
)
"""
This is the file containing the functions that handles the DB data before returning to the front-end
"""
# input:
#       cred_db: the credential database object
#       savedDocument: new account profile
# output: saved profile in json format
def new_account(cred_db, savedDocument):
    dbcalls.DB_insert_one(cred_db, savedDocument)
    savedDocument["_id"] = str(savedDocument["_id"])
    del savedDocument['password']
    access_token = create_access_token(identity=savedDocument["email"])
    refresh_token = create_refresh_token(identity=savedDocument["email"])
    return jsonify({"credentials": savedDocument, "access_token": access_token, "refresh_token": refresh_token})

# input:
#       DB: the database object for notes
#       savedDocument: new account profile
# output: jsonified data for notes and credentials
def get_note_and_credential(note_db, credentials, email):
    arrayOfNotes = getArrayOfNotes(note_db, email)
    credentials["_id"] = str(credentials["_id"])
    del credentials["password"]
    return jsonify({"notes": arrayOfNotes, "credentials": credentials})

# input:
#       credential: the credential object
#       email: user email for db retrieval
# output: jsonified data for credentials
def get_credential(credentials, email):
    credentials["_id"] = str(credentials["_id"])
    del credentials["password"]
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return jsonify({"credentials": credentials, "access_token": access_token, "refresh_token": refresh_token})

# input:
#       note_db: the note database object
#       email: user email for db retrieval
# output: jsonified data for note
def get_note(note_db, email):
    arrayOfNotes = getArrayOfNotes(note_db, email)
    return jsonify({"notes": arrayOfNotes})

# input:
#       note_db: the note database object
#       base_note: new note object with default setting
# output: jsonified data for the inserted note
def add_note(note_db, base_note):
    _id = dbcalls.DB_insert(note_db, base_note)
    x = dbcalls.DB_find_one(note_db, {"_id": ObjectId(_id)})
    x["_id"] = str(x["_id"])
    return jsonify(x)

# input:
#       note_db: the note database object
#       form_data: new note data
# output: None
def save_note(note_db, form_data):
    query = {"_id": ObjectId(form_data["noteID"])}
    new_values = {"title": form_data['title'], "category": form_data['category'], "content": form_data['noteContent'],
                  "lastUpdated": datetime.datetime.fromtimestamp(time.time()).strftime('%c')}
    dbcalls.DB_update_one(note_db, {"$set": new_values}, query)

def get_default_setting(cred_db, app_db, email):
    credentials = dbcalls.DB_find_one(cred_db, {'email': email})
    credentials["_id"] = str(credentials["_id"])
    del credentials['password']
    # WARNING: this assume that there is only one application setting within the database
    applicationSettings = dbcalls.DB_find_one(cred_db, {})
    applicationSettings["_id"] = str(applicationSettings["_id"])
    return jsonify({"credentials": credentials, "applicationSettings": applicationSettings})

# input:
#       cred_db: credential data
#       form_data: new note data
# output: None
def update_default_setting(cred_db, form_data):
    email = form_data['email']
    noteColor = form_data['noteColor']
    fontName = form_data['fontName']
    fontSize = form_data['fontSize']
    draftjs = {"blocks":[{"key":"9043t","text":" ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":1,"style":"fontsize-" + str(fontSize)},{"offset":0,"length":1,"style":"fontfamily-" + fontName}],"entityRanges":[],"data":{}}],"entityMap":{}}
    query = {'$set': {'defaultNoteSettings': {'noteColor': noteColor, 'fontName': fontName, 'fontSize': fontSize, 'draftjsObj': draftjs}}}
    dbcalls.DB_find_one_and_update(cred_db, {'email': email}, query)

# input:
#       cred_db: the credential database object
#       email
# output: None
def disable_tutorial(cred_db, email):
    query = {'$set': {'runTutorial': False}}
    dbcalls.DB_find_one_and_update(cred_db, {'email': email}, query)
# input:
#       cred_db: the credential database object
#       value: value used for retrieval (dictionary)
# output: jsonified note data
def fetch_note(cred_db, value):
    data = dbcalls.DB_find_one(cred_db, value)
    data["_id"] = str(data["_id"])
    return jsonify(data)

# input:
#       note_db: the note database object
#       noteID: value used for retrieval
# output: response
def render_PDF(note_db, noteID):
    noteData = dbcalls.DB_find_one(noteID)
    noteContent = noteData['content']
    config = {}
    exporter = HTML(config)
    noteHTML = exporter.render(noteContent)
    pdf = pdfkit.from_string(noteHTML, False)
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=output.pdf'
    return response

# input:
#       DB: the database object storing the notes
#       email: info used for data retrieval
# output: list of notes
def getArrayOfNotes(note_db, email):
    userNotes = dbcalls.DB_find(note_db, {'email': email})
    arrayOfNotes = []
    for doc in userNotes:
        doc["_id"] = str(doc["_id"])
        arrayOfNotes.append(doc)
    return arrayOfNotes

