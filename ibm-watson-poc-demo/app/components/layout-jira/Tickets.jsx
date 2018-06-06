import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import superagent from 'superagent'
import { set, get, cloneDeep, remove } from 'lodash'
import moment from 'moment'

import { arrToObj } from 'js/common'
import TicketsNew from 'components/layout-jira/TicketsNew'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class Tickets extends Component {
    static propTypes = {
        session: PropTypes.object
    }

    static contextTypes = {}

    state = {
        tickets: [],
        value: '',
        where: {
            title: '',
            key: '',
            createdAt: ''
        },
        task: {}
    }

    componentDidMount() {
        this.getTasks()
        this.getUsers()
        this.getProjects()
    }

    contextFunc(funcName, params, isNotRender) {
        if (this[funcName]) {
            this[funcName](params, isNotRender)
        } else {
            console.log(`${funcName} function is null.`)
        }
	}

    onSetState({ path, data }, isNotRender) {
		set(this.state, path, data)
        if (!isNotRender) {
            this.setState(this.state)
        }
	}

    getTasks() {
        const where = this.initWhere()
        superagent.post('/api/search/sql/tickets')
            .send(where)
            .end((err, res) => {
                if (!err) {
                    this.setState({ tickets: res.body })
                }
                console.log(res.body)
            })
    }

    getUsers() {
        superagent.post('/api/search/sql/users')
            .end((err, res) => {
                if (!err) {
                    this.setState({ users: res.body, usersObj: arrToObj({arr: res.body}) })
                }
                console.log(res.body)
            })
    }

    getProjects() {
        superagent.post('/api/search/sql/projects')
            .end((err, res) => {
                if (!err) {
                    this.setState({ projects: res.body, projectsObj: arrToObj({arr: res.body}) })
                }
                console.log(res.body)
            })
    }

    getData({path = ''}) {
        const data = get(this.state, path)
        return cloneDeep(data)
    }

    initWhere() {
        const data = {}
        const { where } = this.state
        console.log('initWhere')
        Object.keys(where).forEach((key) => {
            if (where[key]) {
                if (key === 'createdAt') {
                    data[key] = { between: [ '2014-08-26 10:53:36', new Date(where[key]) ] }
                } else {
                    data[key] = { like: `%${where[key]}%` }
                }
            }
        })
        return data
    }

    showEdit({ task, i } = {}) {
        this.setState({isShowEdit: true, task, taskIndex: i })
    }

    onChange({key, e}) {
        const { where } = this.state
        where[key] = e.target.value
        this.setState(where)
    }

    onAddTask({ task }) {
        const {tickets} = this.state
        tickets.push(task)
        this.setState({tickets})
    }
    onRemoveTask({ task }) {
        const {tickets} = this.state
        remove(tickets, (o) => {
            return task.id === o.id
        })
        this.setState({tickets})
    }

    showCreateTask({i} = {}) {
        this.setState({isShowEdit: true, task: {}, taskIndex: i})
    }

    render() {
        const { tickets, isShowEdit, where, task, taskIndex, usersObj = {}, projectsObj = {}, projects = [] } = this.state
        return (
            <div className="container-fluid tecnical-map-container">
                <div className="row">
                    { Object.keys(where).map((key, i) => {
                        return (
                            <div key={i} className="col-sm-3">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span onClick={(e) => this.getTasks(e)} className="input-group-text" id="basic-addon1">{key}</span>
                                    </div>
                                    <input onChange={(e) => this.onChange({key, e})} type="text" className="form-control" placeholder="search..." aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                            </div>
                        )
                    })}
                    <div className="col-sm-3">
                        <button className="btn btn-primary" onClick={() => this.showCreateTask()}>Create task</button>
                    </div>
                </div>
                <div className="row">
                    <div className={`list-area ${isShowEdit? 'col-sm-9': 'col-sm-12'}`}>
                        <table className='table table-striped'>
                            <tbody>
                                {tickets.map((obj, i) => {
                                    const { type, title, key, priority, assignee, status, projectId, createdAt } = obj
                                    return (
                                        <tr key={i}>
                                            <td width="10%">{key}</td>
                                            <td width="5%">{type}</td>
                                            <td>{title}</td>
                                            <td width="5%">{priority}</td>
                                            <td width="100px">{status}</td>
                                            <td width="100px">{assignee && usersObj[assignee] ? usersObj[assignee].username : ''}</td>
                                            <td width="50px">{projectId && projectsObj[projectId] ? projectsObj[projectId].title : ''}</td>
                                            <td width="150px">
                                                {moment(createdAt).format('MMM Do YY')}
                                            </td>
                                            <td width="20px">
                                                <a onClick={(e) => this.showEdit({task: obj, i, e})}><i className="fa fa-cogs" aria-hidden="true"></i></a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={`edit-area ${isShowEdit ? 'col-sm-3': 'hidden-area'}`}>
                       <TicketsNew
                            task={task}
                            taskIndex={taskIndex}
                            projectsObj={projectsObj}
                            projects={projects}
                            contextFunc={(funcName, params, isNotRender) => this.contextFunc(funcName, params, isNotRender)}/>
                    </div>
                </div>
            </div >
        )
    }
}
