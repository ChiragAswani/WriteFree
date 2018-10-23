## Configure Database
#### Initialize Mongo
```
mongod
```
#### Create Database
```
use WriteFreeDB
```
[MongoDB GUI](https://www.mongodb.com/products/compass) 


## Run Through Virtual Enviornment
#### Install Python 3 
```
brew install python3
```
#### Create Python3 virtual environment
```
python3 -m venv venv
```
#### Activate virtual env:
```
source venv/bin/activate
```
#### Install Dependencies:
```
pip install -r requirements.txt
```
#### Run Application:
```
cd into the app/ folder (cd .., cd .., cd app/)
FLASK_APP=app.py
flask run
```
