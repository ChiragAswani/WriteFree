import os
import tempfile

import pytest
import json
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
def update_default_settings(client, email):
    data = {
        'email': email,
        'noteColor': '#8bc34a',
        'applicationColor' : '#8bc34a',
        'font': 'Georgia'
        #'fontSize': 11
    }
    return client.post('/update-default-settings',data=json.dumps(data),content_type='application/json')

#helper method to create new note
def create_new_note(client, email):
    data = {
        'email':email
    }
    return client.post('/new-note',query_string=data)

def save_new_note(client):
    with open('formdata.json') as f:
        data = json.load(f)
    return client.post('/save-note', query_string=data)


#Helper method to get data
def get_data(client, x):
    data = {
        'Authorization': 'Bearer {}'.format(jwt_tokens[x])
    }
    return client.get('/get-data',headers=data)


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
jwt_tokens = []

#TEST 1: Testing the creation of accounts
def test_createAccount(client):
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
        #save the jwt token created
        temp = rv.json
        jwt_tokens.append(temp['access_token'])
        assert rv.status_code==200

#TEST 3: Update default settings
def test_update_default_settings(client):
    for x in range(len(emails)):
        email = emails[x]
        rv = update_default_settings(client, email)
        assert rv.status_code==200

# #TEST 4: Getting default settings
# def test_get_default_settings(client):
#     for x in range(len(emails)):
#         email = emails[x]
#         rv = get_default_settings(client, email)
#         assert rv.status_code==200
#
# #TEST 5: Creating new note
# def test_createNewNote(client):
#     for x in range(len(emails)):
#         email = emails[x]
#         rv = create_new_note(client, email)
#         print(rv)
#         assert rv.status_code==200

# #TEST 6: Saving the note we created
# def test_saveNewNote(client):
#     for x in range(len(emails)):
#         rv = save_new_note(client)
#         assert rv.status_code==200


#TEST 7: Get-Data
def test_getData(client):
    for x in range(len(emails)):
        rv = get_data(client, x)
        assert rv.status_code==200







