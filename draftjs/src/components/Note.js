/* eslint-disable */
import React from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { Input, Button, Select, Tabs, Icon, Slider } from 'antd';
import request from 'request';
import Speech from 'react-speech';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import { CirclePicker } from 'react-color';
import '../css/note.css';
import 'antd/dist/antd.css';
import NavigationBar from "./NavigationBar";

const Option = Select.Option;

const TabPane = Tabs.TabPane;

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
        var parsedData = JSON.parse(body)
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
            let contentState = parsedData.content
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
        if(!title){
            this.handleJelly()
        } else {
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
    }

    async goToDashBoard(title){
        if(!title){
            this.handleJelly()
        } else {
            await this.saveNote(this.state.noteTitle, this.state.noteCategory, this.props.location.state.noteID, this.state.editorState.getCurrentContent())
            this.props.history.push("/dashboard")
        }
    }

    speechNote(noteContent){
        var text = '';
        for (var line in noteContent.blocks){
            text = text + (noteContent.blocks[line].text) + ". "
        }
        return text
    }
    handleJelly() {
        Alert.error('Please Enter a Note Header!', {
            position: 'top-right',
            effect: 'jelly'
        });
    }
    changeToolBar(key){
        if (key === "tools"){
            this.setState({
                toolsButtonHighlight: {'background-color': '#466fb5', 'color': 'white', isSelected: true},
                noteSettingsButtonHighlight: {'border': 'none', isSelected: false},
                'toolbar': {}, 'toolbarCustomButtons': []
            })
        }
        else if (key === "noteSettings"){
            this.setState({
                noteSettingsButtonHighlight: {'background-color': '#466fb5', 'color': 'white', isSelected: true},
                toolsButtonHighlight: {'border': 'none', isSelected: false},
                'toolbar': {'options': []}, 'toolbarCustomButtons': [<WordSpacingOption noteID={this.props.location.state.noteID} wordSpacing={this.state.wordSpacing} />,  <LineSpacingOption noteID={this.props.location.state.noteID} lineSpacing={this.state.lineSpacing}/>, <SpeechOption speechText={convertToRaw(this.state.editorState.getCurrentContent())}/>, <NoteColor noteColor={this.state.noteColor} noteID={this.props.location.state.noteID}/>]
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

                <Alert stack={true} timeout={3000} />
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
                <Button style={{"width": "100%"}}type="primary" onClick={() => this.goToDashBoard(this.state.noteTitle)}>Go To Dashboard</Button>

            </div>
        );
    }
}

function setDocumentLineSpacing(lineSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.lineHeight = lineSpacing;
}

function setDocumentWordSpacing(wordSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.wordSpacing = wordSpacing;
}


const SpeechOption = (props) => {
    function speechNote(noteContent) {
        var text = '';
        for (var line in noteContent.blocks){
            text = text + (noteContent.blocks[line].text) + ". "
        }
        return text
    }
    return (
        <Speech
            text={speechNote(props.speechText)}
            displayText={"Text to Speech"}
            textAsButton={true}
            voice="Google UK English Female" />
    );
};

class WordSpacingOption extends React.Component {
    constructor(props){
        super(props)
    }


    changeWordSpacing(value) {
        const obj = {'noteID': this.props.noteID, 'wordSpacing': value}
        const changeWordSpacing = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-word-spacing',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        request(changeWordSpacing, (error, response, body) => {
            setDocumentWordSpacing(value);
        });
    }

    render() {
        const marks = {
            0.9: '0.0px',
            1: 'normal',
            10: '10px',
            20: '20px',
            50: '50px',
        };
        return (
            <div>
                <h4>Word Spacing</h4>
                <Slider style={{'width': 500}} marks={marks} step={null} defaultValue={1} />
                <Select defaultValue={this.props.wordSpacing} style={{ width: 150 }} max={51} onChange={(value) => this.changeWordSpacing(value)}>
                    <Option value="0.9px" disabled>Word Spacing</Option>
                    <Option value="normal">Default</Option>
                    <Option value="10px">10px</Option>
                    <Option value="20px">20px</Option>
                    <Option value="50px">50px</Option>
                </Select>
            </div>
        );
    }
}

class LineSpacingOption extends React.Component {
    constructor(props){
        super(props)
    }

    changeLineSpacing(value) {
        const obj = {'noteID': this.props.noteID, 'lineSpacing': value}
        const changeLineSpacing = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-line-spacing',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        request(changeLineSpacing, (error, response, body) => {
            setDocumentLineSpacing(value);
        });

    }

    render() {
        const marks = {
            0.06: 'Default',
            0.6: '1.6',
            1: '2',
            4: '5',
        };
        return (
            <div>
                <h4>Line Spacing</h4>
                <Slider style={{ width: 400, margin: 50 }} marks={marks} step={null} defaultValue={0.06} />
                <Select defaultValue={this.props.lineSpacing} style={{ width: 150 }} onChange={(value) => this.changeLineSpacing(value)}>
                    <Option value="0.05" disabled>Line Spacing</Option>
                    <Option value="0.06">Default</Option>
                    <Option value="0.6">1.6</Option>
                    <Option value="1">2</Option>
                    <Option value="4">5</Option>
                </Select>

            </div>
        );
    }
}

class ConvertToPDF extends React.Component {
    constructor(props){
        super(props)
    }

    renderPDF(noteID){
        window.open("http://www.localhost:5000/renderPDF?noteID="+noteID);
    }

    render() {
        return (
            <Button className={'convert-to-pdf'} onClick={() => this.renderPDF(this.props.noteID)}>Convert to PDF</Button>
        );
    }
}

class NoteColor extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount(){
        this.setState({noteColor: this.props.noteColor})
    }

    changeNoteColor(noteColor) {
        const noteID = this.props.noteID
        var changeNoteColor = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-note-color',
            qs: {noteID, noteColor: noteColor.hex},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(changeNoteColor, function (error, response, body) {
            this.setState({ noteColor: noteColor.hex });
        }.bind(this));
    };

    render() {
        return (
            <div>
                <CirclePicker
                    color={this.state.noteColor}
                    onChangeComplete={color => this.changeNoteColor(color)}
                    colors={["#FCDFD7", "#FCF9DA", "#D4ECDC", "#E1EBF5", "#F0E5EB"]}
                />
            </div>
        );
    }
}


export default withRouter(Note);
