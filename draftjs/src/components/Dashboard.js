import React from 'react';
import { Table, Button } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
//import createHistory from "history/createBrowserHistory";
//const history = createHistory()

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [{
                title:"Document Name",
                dataIndex: "title",
                key: "title",
                render: (text,record) => <a onClick={() => console.log(record)}>{text}</a>,
            }, {
                title:"Date Modified",
                dataIndex:"timeStamp",
                key:"timeStamp",
            }, {    
                title:"Category",
                dataIndex: "category",
                key: "category",
            }, {
                title: 'Action',
                key: 'action',
                render: () => (
                    <span>
                        <a href="javascript:;">Delete</a>
                    </span>
                ),
            }]
        }
    }


    createTable(){
        var data = JSON.parse(this.props.location.state.userData);
        var userNotes = data.userNotes;

        // for(var i = 0; i < userNotes.length; i++) {
        //     delete userNotes[i]["noteSettings"]
        // }
        return userNotes;
    }

    rowSelection(){
        var rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return rowSelection;
    }

    render() {
        console.log(this.state)
        console.log(this.props)
        return (
            <div>
            <Button type="primary" onClick={() =>this.props.history.push({ pathname: "/new-note", state: {userData: this.props.location.state.userData}})}>New Note</Button>
                <Table  rowSelection={this.rowSelection} dataSource={this.createTable()} columns={this.state.columns} />
            </div>
        )
    }
}

export default withRouter(Dashboard);
