/* eslint-disable */
import React from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { Input, Button, Select, Tabs, Icon, Switch, Slider } from 'antd';
import request from 'request';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../css/note.css';
import 'antd/dist/antd.css';
import NavigationBar from "../NavigationBar";
import ConvertToPDF from "./ToolBarOptions/ConvertToPDF";
import HyphenationOption from "./ToolBarOptions/Hyphenation";
import NoteColor from "./ToolBarOptions/NoteColor";
import SpeechOption from "./ToolBarOptions/TextToSpeech";
import WordSpacingOption from "./ToolBarOptions/WordSpacing";
import LineSpacingOption from "./ToolBarOptions/LineSpacing";

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      noteCategory: undefined,
      noteTitle: undefined,
        noteCategoryIconColor: undefined,
        toolsButtonHighlight: {'background-color': '#466fb5', 'color': 'white', isSelected: true},
        noteSettingsButtonHighlight: {'border': 'none', isSelected: false}
    };
    hyphenate = hyphenate.bind(this)
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.changeToolBar = this.changeToolBar.bind(this);
  }
  componentDidMount() {
    const noteID = this.props.location.state.noteID;
    const fetchNote = {
      method: 'GET',
      url: `http://127.0.0.1:5000/fetch-note/${String(noteID)}`,
      qs: { email: localStorage.getItem('email'), noteID },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(fetchNote, function (error, response, body) {
        var parsedData = JSON.parse(body);
        if (parsedData.noteSettings){
            setDocumentWordSpacing(parsedData.wordSpacing);
            setDocumentLineSpacing(parsedData.lineSpacing);
            let contentState = parsedData.noteSettings
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw((contentState))),
                noteColor: parsedData.noteColor,
                wordSpacing: parsedData.wordSpacing,
                lineSpacing: parsedData.lineSpacing
            });
        }
        if (parsedData.title){
            let contentState = parsedData.content;
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw((contentState))),
                noteTitle: parsedData.title,
                noteCategory: parsedData.category,
                noteCategoryIconColor: "#466fb5",
                noteColor: parsedData.noteColor
            });
        }
    }.bind(this));
  }

    async componentWillUnmount(){
      if (this.state.noteTitle && this.state.noteCategory){
          await this.saveNote(this.state.noteTitle, this.state.noteCategory, this.props.location.state.noteID, this.state.editorState.getCurrentContent())
      } else if (this.state.noteTitle === undefined && this.state.noteCategory === undefined) {
          await this.saveNote("Untitled", "N/A", this.props.location.state.noteID, this.state.editorState.getCurrentContent())
      } else if (this.state.noteCategory === undefined) {
          await this.saveNote(this.state.noteTitle, "N/A", this.props.location.state.noteID, this.state.editorState.getCurrentContent())
      } else if (this.state.noteTitle === undefined) {
          await this.saveNote("Untitled", this.state.noteCategory, this.props.location.state.noteID, this.state.editorState.getCurrentContent())
      }
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    saveNote(title, category, noteID, noteContent){
        const convertedNoteContent = convertToRaw(noteContent)
        const obj = {title, category, noteID, noteContent: convertedNoteContent}
        var saveNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/save-note',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        return request(saveNote)
    }


    speechNote(noteContent){
        var text = '';
        for (var line in noteContent.blocks){
            text = text + (noteContent.blocks[line].text) + ". "
        }
        return text
    }

    changeToolBar(key){
        if (key === "tools"){
            this.setState({
                toolsButtonHighlight: {'background-color': '#466fb5', 'color': 'white', isSelected: true},
                noteSettingsButtonHighlight: {'border': 'none', isSelected: false},
                'toolbar': {}, 'toolbarCustomButtons': []
            })
        }
        else if (key === "noteSettings") {
            this.setState({
                noteSettingsButtonHighlight: {'background-color': '#466fb5', 'color': 'white', isSelected: true},
                toolsButtonHighlight: {'border': 'none', isSelected: false},
                'toolbar': {'options': []},
                'toolbarCustomButtons': [
                    <HyphenationOption hyphenate={hyphenate}/>,
                    <WordSpacingOption setDocumentWordSpacing={setDocumentWordSpacing} noteID={this.props.location.state.noteID} wordSpacing={this.state.wordSpacing}/>,
                    <LineSpacingOption setDocumentLineSpacing={setDocumentLineSpacing} noteID={this.props.location.state.noteID} lineSpacing={this.state.lineSpacing}/>,
                    <SpeechOption speechText={convertToRaw(this.state.editorState.getCurrentContent())}/>,
                    <NoteColor noteColor={this.state.noteColor} noteID={this.props.location.state.noteID}/>]
            })
        }
    }

    changeNoteCategory(noteCategory){
        if(noteCategory){
            this.setState({noteCategory, noteCategoryIconColor: "#466fb5"})
        } else {
            this.setState({noteCategory, noteCategoryIconColor: "gray"})
        }

    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log('do validate');
        }
    }

    showSelectedButton(buttonType){
      if (buttonType === "tools"){
          if (!this.state.toolsButtonHighlight.isSelected){
              this.setState({'toolsButtonHighlight': {'background-color': '#466fb5', 'color': 'white', isSelected: false}})
          }
      }
        if (buttonType === "noteSettings"){
            if (!this.state.noteSettingsButtonHighlight.isSelected){
                this.setState({'noteSettingsButtonHighlight': {'background-color': '#466fb5', 'color': 'white', isSelected: false}})
            }
        }

    }

    hideSelectedButton(buttonType){
        if (buttonType === "tools"){
            if (!this.state.toolsButtonHighlight.isSelected){
                this.setState({'toolsButtonHighlight': {'border': 'none', isSelected: false}})
            }
        }
        if (buttonType === "noteSettings"){
            if (!this.state.noteSettingsButtonHighlight.isSelected){
                this.setState({'noteSettingsButtonHighlight': {'border': 'none', isSelected: false}})
            }

        }

    }
    render() {
        const {editorState} = this.state;
        document.body.style.backgroundColor = "#f5f5f5"
        return (
            <div style={{background: "#f5f5f5"}}>
                <NavigationBar/>
                <div className={"add-title"}>
                    <Input className={"enter-title-here"} placeholder={"Untitled"} onKeyPress={this._handleKeyPress} value={this.state.noteTitle} onChange={noteTitle => this.setState({noteTitle: noteTitle.target.value})}></Input>
                    <Icon type="book" theme="filled" style={{'color': this.state.noteCategoryIconColor}} className={"note-category-icon"} />
                    <Input className={"enter-category-here"} placeholder={"Category"} value={this.state.noteCategory} onChange={noteCategory => this.changeNoteCategory(noteCategory.target.value)}></Input>
                    <ConvertToPDF/>
                </div>
                <div className={"tab-bar"}>
                    <Button
                        style={this.state.toolsButtonHighlight}
                        className={"tab-buttons"}
                        onMouseEnter={() => this.showSelectedButton("tools")}
                        onMouseLeave={() => this.hideSelectedButton("tools")}
                        onClick={() => this.changeToolBar("tools")}>
                        Tools
                    </Button>
                    <Button
                        style={this.state.noteSettingsButtonHighlight}
                        className={"tab-buttons"}
                        onMouseEnter={() => this.showSelectedButton("noteSettings")}
                        onMouseLeave={() => this.hideSelectedButton("noteSettings")}
                        onClick={() => this.changeToolBar("noteSettings")}>
                        Note Settings
                    </Button>
                </div>

            <div className="RichEditor-root" id={"textEdiotr"}>
                <Editor
                    spellCheck={true}
                    editorState={editorState}
                    toolbarClassName="rdw-storybook-toolbar"
                    wrapperStyle={{background: "#f5f5f5"}}
                    editorStyle={{backgroundColor: this.state.noteColor}}
                    onEditorStateChange={this.onChange}
                    toolbarCustomButtons={this.state.toolbarCustomButtons}
                    toolbar={this.state.toolbar}
                />
            </div>
                <br/>
            </div>
        );
    }
}

function setDocumentWordSpacing(wordSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.wordSpacing = wordSpacing;
}

function setDocumentLineSpacing(lineSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.lineHeight = lineSpacing;
}

// Function for hyphenating the contents in text editor, binded with Note class.
function hyphenate(child) {
    // hyphenation on
    var newContents = convertToRaw(this.state.editorState.getCurrentContent())
    console.log(newContents)
    var hyphenation = "";
    // enable hyphenation
    if (child) {
        var Hypher = require('hypher'),
            english = require('hyphenation.en-us'),
            h = new Hypher(english);
        for (var line = 0; line < newContents.blocks.length; line++) {
            //counts the number of dots added
            var numberOfDots = 0;
            //parse the line into words by spaces
            var oneLine = newContents.blocks[line]['text'].split(" ");
            var hyphenatedLine = "";
            //hyphenate each work
            for (var i = 0; i < oneLine.length; i++) {
                var hyphenatedWord = h.hyphenate(oneLine[i]);
                for (var j = 0; j < hyphenatedWord.length - 1; j++) {
                    // add unicode dot for each syllables
                    hyphenatedLine += hyphenatedWord[j] + "\u2022";
                    numberOfDots += 1;
                }
                hyphenatedLine += hyphenatedWord[hyphenatedWord.length - 1] + " ";
            }
            newContents.blocks[line]['text'] = hyphenatedLine;
            //change inline css style for the extra dot characters
            newContents.blocks[line]['inlineStyleRanges'][0]['length'] += numberOfDots;
            newContents.blocks[line]['inlineStyleRanges'][1]['length'] += numberOfDots;
        }
        //convert to  note content
        console.log(newContents);
        this.setState({
            editorState: EditorState.createWithContent(convertFromRaw((newContents))),
        });
    }
    //eliminate the splitter
    else
    {
        console.log();
        var restored = hyphenation.split("\u2022")
        var str = "";
        for (var i = 0; i < restored.length - 1; i++) {
            str += restored[i] + " ";
        }
        str += restored[restored.length - 1];
    }
}

export default withRouter(Note);
