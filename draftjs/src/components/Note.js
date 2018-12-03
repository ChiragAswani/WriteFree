/* eslint-disable */
import React from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { Input, Button, Select, Tabs, Icon, Switch } from 'antd';
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
        noteCategoryIconColor: undefined
    };
    hyphenate = hyphenate.bind(this)
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.toggleInlineStyle = style => this._toggleInlineStyle(style);
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
            let contentState = parsedData.noteSettings;
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw((contentState))),
                noteColor: parsedData.noteColor
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

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
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
        if (key === "basicFeatures"){
            this.setState({'toolbar': {}, 'toolbarCustomButtons': []})
        }
        else if (key === "dyslexicFeatures"){
            this.setState({'toolbar': {'options': []}, 'toolbarCustomButtons': [<WordSpacingOption/>, <LineSpacingOption/>,
                    <HyphenationOption/>,
                    <SpeechOption speechText={convertToRaw(this.state.editorState.getCurrentContent())}/>,
                    <NoteColor noteColor={this.state.noteColor} noteID={this.props.location.state.noteID}/>]})
        }
    }

    changeNoteCategory(noteCategory){
        if(noteCategory){
            this.setState({noteCategory, noteCategoryIconColor: "#466fb5"})
        } else {
            this.setState({noteCategory, noteCategoryIconColor: "gray"})
        }

    }
    render() {
        const {editorState} = this.state;
        document.body.style.backgroundColor = "#f5f5f5"
        return (
            <div style={{background: "#f5f5f5"}}>
                <NavigationBar/>
                <div className={"add-title"}>
                    <Input className={"enter-title-here"} placeholder={"Untitled"} value={this.state.noteTitle} onChange={noteTitle => this.setState({noteTitle: noteTitle.target.value})}></Input>
                    <Icon type="book" theme="filled" style={{'color': this.state.noteCategoryIconColor}} className={"note-category-icon"} />
                    <Input className={"enter-category-here"} placeholder={"Category"} value={this.state.noteCategory} onChange={noteCategory => this.changeNoteCategory(noteCategory.target.value)}></Input>
                    <ConvertToPDF/>
                </div>
                    <Tabs animated={false} defaultActiveKey="1" onChange={this.changeToolBar} className={"tab-bar"}>
                        <TabPane tab="Tools" key="basicFeatures"/>
                        <TabPane tab="Note Settings" key="dyslexicFeatures"/>
                    </Tabs>
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

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 60,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
        );
    }
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

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
        this.state = {}
    }
    // spacing methods
    changeWordSpacing(value) {
        var textfiled = document.getElementsByClassName('DraftEditor-root');
        textfiled[0].style.wordSpacing = value;
    }

    render() {
        return (
            <div>
                <Select defaultValue="0.9px" style={{ width: 150 }} onChange={(value) => this.changeWordSpacing(value)}>
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
        var textfiled = document.getElementsByClassName('DraftEditor-root');
        textfiled[0].style.lineHeight = value;
    }

    render() {
        return (
            <div>
                <Select defaultValue="0.05" style={{ width: 150 }} onChange={(value) => this.changeLineSpacing(value)}>
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
class HyphenationOption extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Switch checkedChildren="On" unCheckedChildren="Off" onChange={(child) => hyphenate(child)}/>
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
