/* eslint-disable */
import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote/CardNote';
import NavigationBar from './NavigationBar';
import '../css/dashboard.css';
import { mergeSort } from '../defaults/constants';

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
            <a onClick={() => this.sortNotes('category')}>By Category</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('lastUpdated')}>By Last Updated</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('title')}>By Name (A-Z)</a>
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
          render: (text, record) => {
              return (
              <div>
                  <a className={'editNote'} onClick={() => this.goToNote(record._id)}>Edit | </a>
                  <Popconfirm
                      title="Are you sure you want to delete this note?"
                      onConfirm={() => this.deleteNote(localStorage.getItem('email'), record._id)}
                      okText="Yes"
                      cancelText="No">
                      <a className={'deleteNote'}>Delete</a>
                  </Popconfirm>
              </div>
          );
          },
      }],
    };
  }

  componentDidMount() {
      if (!localStorage.getItem('id')){
          return this.props.history.push('/login')
      }
    const id = localStorage.getItem('id');
    const refreshToken = localStorage.getItem('refresh_token');
    let AuthStr = 'Bearer '.concat(refreshToken);
    axios.get('http://127.0.0.1:5000/refresh', { headers: { Authorization: AuthStr } }).then((response) => {
        console.log("NEW ACCESS TOKEN");
      localStorage.setItem('access_token', response.data.access_token);
        console.log(localStorage.getItem('access_token'));
    }).catch((error) => {
      console.log(error, 'ERROR - BAD REFRESH TOKEN');
    });
    const access_token_new = localStorage.getItem('access_token');
    AuthStr = 'Bearer '.concat(access_token_new);
    axios.get('http://127.0.0.1:5000/get-data', { headers: { Authorization: AuthStr }, params: { id } }).then((response) => {
      this.setState({
        notes: response.data.notes,
        credentials: response.data.credentials,
      });
    }).catch((error) => {
      console.log(error, 'ERROR - INVALID or NO COOKIES');
    });
  }



  createNote(email) {
    const accessToken = localStorage.getItem('access_token');
    const AuthStr = 'Bearer '.concat(accessToken);
    const headers = { Authorization: AuthStr };

    console.log(headers);
    axios.get('http://127.0.0.1:5000/new-note', {headers:headers}).then((response) => {
        const parsedData = response.data;
        this.goToNote(parsedData._id);
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
    if (child) {
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
      const accessToken = localStorage.getItem('access_token');
      const AuthStr = 'Bearer '.concat(accessToken);
      const headers = { Authorization: AuthStr };

      axios.get('http://127.0.0.1:5000/get-notes', {headers:headers}).then((response) => {
          var parsedData = response.data;
                  if (query.trim().length !== 0){
            const filteredNotes = [];
            for (let note in parsedData.notes){
                if (parsedData.notes[note].title.toLowerCase().includes(query.toLowerCase()) ||
                    parsedData.notes[note].category.toLowerCase().includes(query.toLowerCase())){
                    filteredNotes.push(parsedData.notes[note])
                }
            }
            this.setState({'notes': filteredNotes})
        } else {
            this.setState({'notes': parsedData.notes})
        }
      });
  }

    deleteNote(email, noteID) {
        const accessToken = localStorage.getItem('access_token');
        const AuthStr = 'Bearer '.concat(accessToken);
        const headers = { Authorization: AuthStr, 'Content-Type': 'application/x-www-form-urlencoded' };

        const deleteNote = {
            method: 'DELETE',
            url: 'http://127.0.0.1:5000/delete-note',
            qs: { noteID },
            headers: headers,
        };
        request(deleteNote, (error, response, body) => {

            const parsedData = JSON.parse(body);
            this.setState({ notes: parsedData.notes });
        });
    }

    goToNote(noteID){
        this.props.history.push({
            pathname: `/note/${noteID}`,
            state: { noteID },
        });
    }

  render() {
    document.body.style.backgroundColor = "#eaeaea";
    if (!this.state.isTableView) {
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
                       <Icon type="filter" theme="filled" style={{'color': '#466fb5'}}/>
                    </Dropdown>
                    <Switch checkedChildren="table" unCheckedChildren="card" onChange={child => this.switchView(child)} />
                    <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} />
                    <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))}>New Document</Button>
                </div>
            </div>
            <div className={"bottom"}>
              <CardNote notes={this.state.notes} history={this.props.history}/>
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
                <Icon type="filter" theme="filled" style={{'color': '#466fb5'}}/>
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
