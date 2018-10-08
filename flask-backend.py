from flask import Flask
from numpy import np
from flask_mongoengine import MongoEngine
'''
Date: Oct 7th 2018
Descrption: This is the file for the flask backend
'''
app = Flask(__name__)
app.config.from_pyfile('the-config.cfg')
db = MongoEngine(app)