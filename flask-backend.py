from flask import Flask, request
from flask_mongoengine import MongoEngine

'''
Date: Oct 7th 2018
Descrption: This is the file for the flask backend
'''
# initializations
app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'WriteFreeDB',
    'host': 'localhost',
    'port': 27017
}
db = MongoEngine(app)
#global counter
counter = 0

@app.route('/')
def hello():
    return 'hello!'

# create account and store info into DB
@app.route('/create-account', methods= ['GET'])
def create():
    
    return 'Account added'

# retrieve the account info and display it to the web
@app.route ('/retrieve')
def retrieve():
    return 'retrieve'