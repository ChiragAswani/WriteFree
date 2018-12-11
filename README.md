# WriteFree-FrontEnd
## Installation
1. ``` cd draftjs/```
2. ``` npm install```
3. ``` npm start```
4. Open localhost:3000/login

##How to Run Tests
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
![alt text][https://github.com/ChiragAswani/WriteFree-frontend/blob/master/draftjs/src/images/async%20error.png?raw=true]

## Important!
Before you run, configure the steps from the README in [WriteFree-backend](https://github.com/ChiragAswani/WriteFree-backend)
