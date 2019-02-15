# WriteFree-FrontEnd
## Learn more on my [Website](https://sidpremkumar.com/writefree.html)
## Installation
1. ``` cd draftjs/```
2. ``` npm install```
3. ``` npm start```
4. Open localhost:3000/login

## How to Run Tests
1. cd into draftjs/src/tests
2. for every file run... ()
````
npm test <file_name>
````
^we were unable to automate this but follow the tutorial for running Enzyme and Jest for React component testing.

## Known Bugs
1. HTML/CSS gets inconsistent when you resize the window.
2. CovertToPDF doesn't work pefectly: it only works with background color, bold and italic.
3. TextToSpeech doesn't work consistently: it does not read the proper text sometimes. And it only works in Chrome.
4. Hyphenation functionality is disabled because we are not able to set the React state properly. But the algorithm is properly implemented and can be used in the future development.
5. Trash can icon on the notecard does not work.
6. Text does not wrap when typing a note. It just overlapstext on eachother
7. Always have your developer console running during testing. If you see the error below. Please reload the application.
![alt text](https://github.com/ChiragAswani/WriteFree-frontend/blob/master/draftjs/src/images/async%20error.png?raw=true)

## Important!
Before you run, configure the steps from the README in [WriteFree-backend](https://github.com/ChiragAswani/WriteFree-backend)


# WriteFree-Backend
## Configure Database

#### Download MongoDB
https://docs.mongodb.com/manual/installation/

#### Initialize Mongo
```
mongod
```
#### Create Database
```
use WriteFreeDB
```
#### Import "application" collection
1. Download [MongoDB GUI](https://www.mongodb.com/products/compass) 
2. Connect to your local mongod instance (localhost:27017)
3. Click on WriteFreeDB. If you do not see it, click on "+ Create Database." Name database "WriteFreeDB". Name collection "application"
4. Click on "application" collection on the left. 
5. On the top tool bar click on "Collection" and "Import Data"
6. Import the application.json collection and the data should be populated


### Install Virtual Enviornment

#### Install Python 3 
```
brew install python3
```
#### Create Python3 virtual environment
```
python3 -m venv venv
```

### Starting Virtual Enviornment (required)

#### Activate virtual env:
```
source venv/bin/activate
```
#### Install Dependencies (need to be in the app folder)
```
pip install -r requirements.txt
```


## Run Application
```
cd into the app/ folder (cd .., cd .., cd app/)
FLASK_APP=app.py
flask run
```

## How to Run Test Cases
1. Switch to the unit-tests branch. (git checkout unit-tests)
2. Activate the virtual enviornment and install the dependencies (see above)
3. cd into the app/tests folder
````
pytest test_login.py -p no:warnings
````
#### Changing the number of Unit Tests
1. open test_login.py
2. naviage to line 108
3. Change x here
````
emails, names = create_emails(num_emails=x)
````
