import React from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import '../css/cardnote.css';

class CardListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTitle: props.note.title,
      note: props.note,
    };
  }
  displayNoteData(note) {
    this.setState({ moreNoteData: `${note.lastUpdated} | ${note.category}`, noteDelete: <a>x</a> });
  }
  editNote(email, noteID) {
    this.props.history.push({
      pathname: `/note/${noteID}`,
      state: { noteID },
    });
  }

  render() {
    return (
      <div>
        <Card
          extra={this.state.noteDelete}
          onClick={() => this.editNote(localStorage.getItem('email'), this.state.note._id)}
          onMouseEnter={() => this.displayNoteData(this.state.note)}
          onMouseLeave={() => this.setState({ moreNoteData: undefined, noteDelete: undefined })}
          style={{ backgroundColor: this.state.note.noteColor }}
        >
          {this.state.noteTitle} <br />
          {this.state.moreNoteData}
        </Card>
      </div>
    );
  }
}

const CardList = (props) => {
  const videoItems = props.notes.map(note => (
    <CardListItem key={note._id} note={note} history={props.history} />
  ));
  return (
    <ul className="col-md-4 list-group">
      {videoItems}
    </ul>
  );
};

const CardNote = props => (
  <div className="cont">
    <CardList notes={props.notes} history={props.history} />
  </div>
);

export default withRouter(CardNote);
