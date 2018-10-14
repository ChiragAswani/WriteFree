from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
from mongoengine import *
import time
from flask_cors import CORS
from pymongo import MongoClient


# initializations
app = Flask(__name__)
CORS(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'WriteFreeDB',
    'host': '127.0.0.1',
    'port': 27017
}
mongoDB = MongoEngine(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['WriteFreeDB']


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
    credentials_collection = db['credentials']
    if(credentials_collection.find_one({'email': email})):
        return "An account already exists with " + email, 401;
    else:
        credentials(timeStamp=timeStamp, email=email, fullName=fullName, password=password).save()
        savedDocument = {
            'timeStamp': timeStamp,
            'email': email,
            'fullName': fullName,
            'password': password
        }
        return jsonify(savedDocument), 200;

# verify username and password, returns account details and notes
@app.route('/login', methods= ['GET', 'OPTIONS'])
def login():
    email = request.args['email']
    password = request.args['password']
    savedDocument = {
        'email': email,
        'password': password
    }
    credentials_collection = db['credentials']
    credentials = credentials_collection.find_one({'email': email, 'password': password})
    if (credentials):
        del credentials['_id']
        return jsonify(credentials), 200;
    return "Invalid Username or Password", 401;

# retrieve the account info and display it to the web
@app.route ('/retrieve')
def retrieve():
    for post in Post.objects:
        print(post.title)
    return 'Done retrieving'