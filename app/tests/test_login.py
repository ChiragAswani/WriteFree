import os
import tempfile

import pytest

from app import app
import mongomock
from pytest_mongodb.plugin import mongo_engine
from pytest import mark

import string
import random


@pytest.fixture
def client():
    # db_fd, app.app.config['DATABASE'] = MongoClient('mongodb://localhost:27017/')
    app.app.config['TESTING'] = True

    client = app.app.test_client()

    # app.app.config['DATABASE'] = mongomock.MongoClient().db.collection
    # with app.app.app_context():
    #     app.init_db()

    yield client
    #
    # #os.close(db_fd)
    # #os.unlink(app.app.config['DATABASE'])
    # db_address = 'mongodb://localhost:27017/'
    # # app = Flask(__name__)
    # CORS(app)
    # app.secret_key = 'super secret key'
    # app.config['JWT_BLACKLIST_ENABLED'] = True
    # app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
    # SESSION_TYPE = 'redis'
    # bcrypt = Bcrypt(app)
    #
    # jwt = JWTManager(app)
    # blacklist = set()
    #
    # db = MongoClient('mongodb://localhost:27017/')
    #
    # credentials_collection = db['WriteFreeDB']['credentials']
    # notes_collection = db['WriteFreeDB']['notes']
    # application_collection = db['WriteFreeDB']['application']


#create random ID for the email
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


#HELPER METHODS ---->>>>
#creating an accont
def create_account(client, email, fullName, password):
    data = {
        'email':email,
        'fullName':fullName,
        'password':password
    }
    return client.post('/create-account',query_string=data)

#loging in
def login(client, email, password):
    data = {
        'email':email,
        'password':password
    }
    return client.get('/login',query_string=data)

#helper method to get  default settings
def get_default_settings(client, email):
    data = {
        'email':email
    }
    return client.get('/get-default-settings',query_string=data)

#helper method to update default settings
def get_default_settings(client, email):
    data = {
        'email':email,
        'noteColor': '#8bc34a',
        'fontName' : 'Georgia',
        'fontSize' : 11
    }
    return client.get('/get-default-settings',query_string=data)

#helper method to create new note
def create_new_note(client, email):
    data = {
        'email':email
    }
    return client.post('/new-note',query_string=data)

#helper method to create fake users
def create_emails(num_emails):
    emails = []
    names = []
    base = "@gmail.com"
    for x in range(num_emails):
        temp = id_generator() + base
        emails.append(temp)
        names.append(id_generator())
    return emails, names




#GLOBAL VARIABLES: Users:
emails, names = create_emails(num_emails=5)

#TEST 1: Testing the creation of accounts
def test_create_account(client):
    for x in range(len(emails)):
        email = emails[x]
        name = names[x]
        rv= create_account(client, email, name, "test1234!")
        assert rv.status_code==200

#TEST 2: Testing login into said accounts
def test_login(client):
    for x in range(len(emails)):
        email = emails[x]
        rv= login(client, email, "test1234!")
        assert rv.status_code==200

#TEST 3: Update default settings
def test_update_default_settings(client):
    for x in range(len(emails)):
        email = emails[x]
        rv = update_default_settings(client, email)
        assert rv.status_code==200

#TEST 4: Getting default settings
def test_get_default_settings(client):
    for x in range(len(emails)):
        email = emails[x]
        rv = get_default_settings(client, email)
        assert rv.status_code==200

# #TEST 5: Creating newe note
# def test_create_new_note(client):
#     for x in range(len(emails)):
#         email = emails[x]
#         rv = create_new_note(client, email)
#         assert rv.status_code==200



#TESTS: New note, save note, get default settings, get notes*, get data,
#Test login, then get-data


