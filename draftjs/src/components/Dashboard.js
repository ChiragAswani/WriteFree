import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote';
import '../css/dashboard.css';
import { mergeSort } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Search = Input.Search;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: null,
      credentials: { runTutorial: null },
      menu: (
        <Menu>
          <Menu.Item>
            <a onClick={() => this.sortNotes('category')}>Document Category</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('lastUpdated')}>Date Modified</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('title')}>Document Name</a>
          </Menu.Item>
        </Menu>
      ),
      noteColumns: [{
        title: 'Document Name',
        dataIndex: 'title',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Date Created',
        dataIndex: 'createdAt',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Last Updated',
        dataIndex: 'lastUpdated',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Category',
        dataIndex: 'category',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Action',
        render: (text, record) => (
          <div>
            <a className={'editNote'} onClick={() => this.editNote(localStorage.getItem('email'), record._id)}>Edit | </a>
            <a className={'deleteNote'} onClick={() => this.deleteNote(localStorage.getItem('email'), record._id)}>Delete</a>
          </div>
        ),
      }],
    };
  }

  componentDidMount() {
    const id = localStorage.getItem('id');
    const refreshToken = localStorage.getItem('refresh_token');
    let AuthStr = 'Bearer '.concat(refreshToken);
    axios.get('http://127.0.0.1:5000/refresh', { headers: { Authorization: AuthStr } }).then((response) => {
      localStorage.setItem('access_token', response.data.access_token)
    }).catch((error) => {
      console.log(error, 'ERROR - BAD REFRESH TOKEN');
    });
    AuthStr = 'Bearer '.concat(id);
    axios.get('http://127.0.0.1:5000/get-data', { headers: { Authorization: AuthStr }, params: { id } }).then((response) => {
      this.setState({
        notes: response.data.notes,
        credentials: response.data.credentials,
      });
    }).catch((error) => {
      console.log(error, 'ERROR - INVALID or NO COOKIES');
    });
  }

  editNote(email, noteID) {
    this.props.history.push({
      pathname: `/note/${noteID}`,
      state: { noteID },
    });
  }

  deleteNote(email, noteID) {
      // const deleteNote = {
      //   method: 'DELETE',
      //   url: 'http://127.0.0.1:5000/delete-note',
      //   qs: { email, noteID },
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // };
      // request(deleteNote, (error, response, body) => {
      //   const parsedData = JSON.parse(body);
      //   this.setState({ notes: parsedData.notes });
      // });
      const accessToken = localStorage.getItem('access_token');
      const AuthStr = 'Bearer '.concat(accessToken);

      axios.get('http://127.0.0.1:5000/delete-note', {



  createNote(email) {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const AuthStr = 'Bearer '.concat(accessToken);
    const AuthStr2 = 'Bearer '.concat(refreshToken);
    const headers = { Authorization: AuthStr };

    console.log(headers);
    axios.get('http://127.0.0.1:5000/new-note', {headers:headers}).then((response) => {
        const parsedData = response.data;
        this.props.history.push({
            pathname: `/new-note/${parsedData._id}`,
            state: { noteID: parsedData._id },
        });
    });

  }

  logout() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const AuthStr = 'Bearer '.concat(accessToken);
    const AuthStr2 = 'Bearer '.concat(refreshToken);
    const headers = { Authorization: AuthStr };
    axios.get('http://127.0.0.1:5000/logout', { headers });
    axios.get('http://127.0.0.1:5000/logout2', { headers: { Authorization: AuthStr2 } }).then((response) => {
      localStorage.clear();
      this.props.history.push('/login');
    });
  }

  switchView(child) {
    if (!child) {
      this.setState({ isCardView: true });
    } else {
      this.setState({ isCardView: false });
    }
  }

  sortNotes(option) {
    const sortedNotes = mergeSort(this.state.notes, option);
    this.setState({ notes: sortedNotes });
  }

  searchNotes(query){

      // let obj = { email: localStorage.getItem('email') }
      // const getNotes = {
      //     method: 'POST',
      //     url: 'http://127.0.0.1:5000/get-notes',
      //     body: JSON.stringify(obj),
      //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // };
      // request(getNotes, function (error, response, body) {
      //     var parsedData = JSON.parse(body);
      //     if (query.trim().length !== 0){
      //         const filteredNotes = [];
      //         for (var note in parsedData.notes){
      //             if (parsedData.notes[note].title.includes(query)){
      //                 filteredNotes.push(parsedData.notes[note])
      //             }
      //         }
      //         this.setState({'notes': filteredNotes})
      //     } else {
      //         this.setState({'notes': parsedData.notes})
      //     }
      //
      // }.bind(this));

      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const AuthStr = 'Bearer '.concat(accessToken);
      const AuthStr2 = 'Bearer '.concat(refreshToken);
      const headers = { Authorization: AuthStr };

      axios.get('http://127.0.0.1:5000/get-notes', {headers:headers}).then((response) => {
          var parsedData = response.data;
          console.log(parsedData);
          if (query.trim().length !== 0){
              const filteredNotes = [];
              for (var note in parsedData.notes){
                  if (parsedData.notes[note].title != null && parsedData.notes[note].title.includes(query)){
                      filteredNotes.push(parsedData.notes[note])
                  }
              }
              this.setState({'notes': filteredNotes})
          } else {
              this.setState({'notes': parsedData.notes})
          }
      });


  }

  render() {
    if (this.state.isCardView) {
      return (
        <div style={{background: "#f5f5f5"}}>
          <Walkthrough runTutorial={this.state.credentials.runTutorial} />
          <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('access_token'))}>New Document</Button>
          <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={child => this.switchView(child)} />
          <Search
            placeholder="note title"
            onChange={searchContent => this.searchNotes(searchContent.target.value)}
            style={{ width: 200 }}
          />
            <Dropdown overlay={this.state.menu}>
                <a className="ant-dropdown-link" href='#'><FontAwesomeIcon icon="filter" /> </a>
            </Dropdown>
            <FontAwesomeIcon icon="cog" onClick={() => this.props.history.push('/default-settings')} />
            <FontAwesomeIcon icon="user" onClick={() => this.logout()} />
            <CardNote notes={this.state.notes} history={this.props.history} />
        </div>
      )
    }
    return (
      <div style={{background: "#f5f5f5"}}>
        <Walkthrough runTutorial={this.state.credentials.runTutorial} />
        <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('access_token'))}>New Document</Button>
        <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={child => this.switchView(child)} />
        <Search
          placeholder="input search text"
          onChange={searchContent => this.searchNotes(searchContent.target.value)}
          style={{ width: 200 }}
        />
        <Dropdown overlay={this.state.menu}>
          <a className="ant-dropdown-link" href='#'><FontAwesomeIcon icon="filter" /> </a>
        </Dropdown>
          <FontAwesomeIcon icon="cog" onClick={() => this.props.history.push('/default-settings')} />
          <FontAwesomeIcon icon="user" onClick={() => this.logout()} />
          <Table
          dataSource={this.state.notes}
          className="notesTable"
          rowKey="_id"
          columns={this.state.noteColumns}
        />
      </div>
    );
  }
}

export default withRouter(Dashboard);
