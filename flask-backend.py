from flask import Flask, request
from flask_mongoengine import MongoEngine
from mongoengine import *
'''
Date: Oct 7th 2018
Descrption: This is the file for the flask backend
'''
# initializations
app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'WriteFreeDB',

    'host': '127.0.0.1',
    'port': 27017
}
db = MongoEngine(app)
#global counter
counter = 0

# defining the document structure
class credentials(Document):
    name = StringField(required=True, max_length=15)
    pwd = StringField(required=True, max_length=12)

# post definition
class Post(Document):
    title = StringField(max_length=120, required=True)
    author = ReferenceField(credentials)
    # allow for inheritance
    meta = {'allow_inheritance': True}

# --------------------------------------URL binding -----------------------------------------
@app.route('/')
def hello():
    global counter
    return str(counter)

# create account and store info into DB
@app.route('/create-account', methods= ['POST'])
def create():
    global counter
    counter += 1
    if request.method == 'POST':
        usrname = request.args['username']
        pwd = request.args['password']
    usr = credentials(name=usrname, pwd=pwd).save()
    post = Post(title=usrname, author=usr)
    post.save()
    return 'Account ' + str(counter) + ' added'

# retrieve the account info and display it to the web
@app.route ('/retrieve')
def retrieve():
    for post in Post.objects:
        print(post.title)
    return 'Done retrieving'