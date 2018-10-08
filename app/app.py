from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
from mongoengine import *
import time
from flask_cors import CORS

# initializations
app = Flask(__name__)
CORS(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'WriteFreeDB',
    'host': '127.0.0.1',
    'port': 27017
}
db = MongoEngine(app)

# stored class
class credentials(Document):
    timeStamp = StringField(required=True)
    email = StringField(required=True)
    fullName = StringField(required=True)
    password = StringField(required=True)

# post definition
class Post(Document):
    title = StringField(max_length=120, required=True)
    author = ReferenceField(credentials)
    # allow for inheritance
    meta = {'allow_inheritance': True}

# create account and store info into DB
@app.route('/create-account', methods= ['POST', 'OPTIONS'])
def create():
    email = request.args['email']
    fullName = request.args['fullName']
    password = request.args['password']
    timeStamp = str(time.time())
    credentials(timeStamp=timeStamp, email=email, fullName=fullName, password=password).save()
    savedDocument = {
        'timeStamp': timeStamp,
        'email': email,
        'fullName': fullName,
        'password': password
    }
    return jsonify(savedDocument), 200;

# retrieve the account info and display it to the web
@app.route ('/retrieve')
def retrieve():
    for post in Post.objects:
        print(post.title)
    return 'Done retrieving'