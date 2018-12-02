import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote';
import NavigationBar from './NavigationBar';
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
        className: "classNameOfColumn",
        render: (text, record) => (
          <div style={ {background: record.noteColor} }>
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
    const email = localStorage.getItem('email');
    AuthStr = 'Bearer '.concat(id);
    axios.get('http://127.0.0.1:5000/get-data', { headers: { Authorization: AuthStr }, params: { email, id } }).then((response) => {
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
    const deleteNote = {
      method: 'DELETE',
      url: 'http://127.0.0.1:5000/delete-note',
      qs: { email, noteID },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(deleteNote, (error, response, body) => {
      const parsedData = JSON.parse(body);
      this.setState({ notes: parsedData.notes });
    });
  }


  createNote(email) {
    const postNewNote = {
      method: 'POST',
      url: 'http://127.0.0.1:5000/new-note',
      qs: { email },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(postNewNote, (error, response, body) => {
      const parsedData = JSON.parse(body);
      this.props.history.push({
        pathname: `/new-note/${parsedData._id}`,
        state: { noteID: parsedData._id },
      });
    });
  }

  switchView(child) {
    if (!child) {
      this.setState({ isTableView: true });
    } else {
      this.setState({ isTableView: false });
    }
  }

  sortNotes(option) {
    const sortedNotes = mergeSort(this.state.notes, option);
    this.setState({ notes: sortedNotes });
  }

  searchNotes(query){
    let obj = { email: localStorage.getItem('email') }
    const getNotes = {
        method: 'POST',
        url: 'http://127.0.0.1:5000/get-notes',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(getNotes, function (error, response, body) {
        var parsedData = JSON.parse(body);
        if (query.trim().length !== 0){
            const filteredNotes = [];
            for (let note in parsedData.notes){
                if (parsedData.notes[note].title.includes(query)){
                    filteredNotes.push(parsedData.notes[note])
                }
            }
            this.setState({'notes': filteredNotes})
        } else {
            this.setState({'notes': parsedData.notes})
        }

    }.bind(this));
  }

  render() {
    document.body.style.backgroundColor = "#eaeaea";
    if (this.state.isTableView) {
      return (
        <div style={{background: "#eaeaea"}}>
            <NavigationBar/>
            <div className={"middle"}>
                <div className={"child"}>
                    <Walkthrough runTutorial={this.state.credentials.runTutorial} />
                    <Search
                        onChange={searchContent => this.searchNotes(searchContent.target.value)}
                        style={{ width: 200 }}
                    />
                    <Dropdown overlay={this.state.menu}>
                        <a className="ant-dropdown-link" href='#'><FontAwesomeIcon icon="filter" /> </a>
                    </Dropdown>
                    <Switch checkedChildren="table" unCheckedChildren="card" onChange={child => this.switchView(child)} />

                    <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} />
                    <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))}>New Document</Button>
                </div>
            </div>
            <div className={"bottom"}>
              <CardNote notes={this.state.notes} history={this.props.history} />
            </div>
        </div>
      )
    }
    return (
      <div style={{background: "#eaeaea"}}>
        <NavigationBar/>
        <div className={"middle"}>
            <div className={"child"}>
            <Walkthrough runTutorial={this.state.credentials.runTutorial} />
                  <Search
                      onChange={searchContent => this.searchNotes(searchContent.target.value)}
                      style={{ width: 200 }}
                  />
            <Dropdown overlay={this.state.menu}>
                <a className="ant-dropdown-link" href='#'><FontAwesomeIcon icon="filter" /> </a>
            </Dropdown>
            <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={child => this.switchView(child)} />
            <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} />
            <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))}>New Document</Button>
            </div>
        </div>
        <div className={"bottom"}>
            <Table
                dataSource={this.state.notes}
                className="notesTable"
                rowKey="_id"
                columns={this.state.noteColumns}
                pagination={{defaultPageSize: 5}}
                rowClassName={(record) => record.noteColor}
            />
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
