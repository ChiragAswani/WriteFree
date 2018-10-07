import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertFromHTML, ContentState} from 'draft-js';

class App extends React.Component {
    constructor(props) {
        super(props);
        const sampleMarkup =
    '<b>Chirag</b>, <i>Italic text</i><br/ ><br />' +
    '<a href="http://www.facebook.com">Example link</a>';

  const blocksFromHTML = convertFromHTML(sampleMarkup);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
);
        this.state = {editorState: EditorState.createWithContent(state)};
        this.onChange = (editorState) => this.setState({editorState});
    }
    method(){

    }
    render() {
        console.log(this.state.editorState)
        return (
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
        );
    }
}

export default App;
