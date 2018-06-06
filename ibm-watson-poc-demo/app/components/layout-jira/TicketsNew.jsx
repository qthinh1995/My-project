import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import superagent from 'superagent'
import { forEach, isEmpty } from 'lodash'

const STATUS = [
    {label: 'todo', key: 1},
    {label: 'in process', key: 2},
    {label: 'dev complete', key: 3},
    {label: 'close', key: 4},
    {label: 'need clerification', key: 5}
]

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class TicketsNew extends Component {
    static propTypes = {
        session: PropTypes.object,
        task: PropTypes.object,
        taskIndex: PropTypes.number,
        contextFunc: PropTypes.func,
        projects: PropTypes.array,
        projectsObj: PropTypes.object
    }

    static contextTypes = {
        flux: PropTypes.object.isRequired
    }

    state = {
        task: {
            projectId: 14,
            status: 'todo'
        }
    }

    initDefaultTask() {
        return  {
            projectId: '14',
            status: 'todo'
        }
    }

    componentWillReceiveProps(nextProps) {
        const task = isEmpty(nextProps.task) ? { projectId: 14, status: 'todo'} : nextProps.task
        this.setState({task})
    }

    onChange({e, key}) {
        console.log(e) 
        const { task } = this.state
        task[key] = e.target.value
        this.setState({task})
    }

    onUpdate() {
        const { task } = this.state
        const { taskIndex } = this.props
        this.props.contextFunc('onSetState', {path: 'isShowEdit', data: false}, true)
        this.props.contextFunc('onSetState', {path: `tickets[${taskIndex}]`, data: task})
        superagent.put(`/api/sql/tickets/${task.id}`)
            .send({ data: task })
            .end((err, res) => {
                console.log(res.body)
            })
    }

    onDelete() {
        const { task } = this.state
        
        superagent.delete(`/api/sql/tickets/${task.id}`)
            .send({ data: task })
            .end((err, res) => {
                console.log(res.body)
                this.props.contextFunc('onRemoveTask', {task})
                this.props.contextFunc('onSetState', {path: 'isShowEdit', data: false}, true)
            })
    }

    onCreateNew() {
        const { task } = this.state
        if (this.validateTask({task})) {
            superagent.post('/api/sql/tickets')
                .send({ data: task })
                .end((err, res) => {
                    this.props.contextFunc('onAddTask', {task})
                    this.props.contextFunc('onSetState', {path: 'isShowEdit', data: false}, true)
                    console.log(res.body)
                })
        }
    }

    validateTask({task}) {
        const validateArr = [ 'key', 'title', 'status', 'projectId' ]
        let isStatus = true
        forEach(validateArr, (val) => {
            if (!task[val]) {
                isStatus = false
                console.log('Missing field: ', val)
            }
        })
        return isStatus
    }

    onSelect({ val, key } = {}) {
        console.log(val)
        const { task } = this.state
        task[key] = val
        this.setState({task})
    }

    render() {
        const { task } = this.state
        const { title = '', desc = '', status = '', key = '', projectId = ''} = task
        const { taskIndex, projects } = this.props

        const isNew = isNaN(taskIndex)

        console.log(taskIndex, '-----------')
        return (
            <div>
                {projects.length > 0 &&
                    <div className="col-sm-12">
                        <span>Project:  </span>
                        <select 
                            onChange={(e) => this.onChange({e, key: 'projectId'})}
                            value={projectId}
                            className="form-control" > 
                            {projects.map((o, i) => {
                                const { title: titlePrj, id } = o
                                return (
                                    <option key={i} value={id}>{titlePrj}</option>
                                )
                            })}
                        </select>
                    </div>
                }
                <div className="col-sm-12">
                    <span>Ticket: </span>
                    <input onChange={(e) => this.onChange({e, key: 'key'})} className="form-control" value={key}/>
                </div>
                <div className="col-sm-12">
                    <span>Title: </span>
                    <input onChange={(e) => this.onChange({e, key: 'title'})} className="form-control" value={title}/>
                </div>
                <div className="col-sm-12">
                    <span>Description: </span>
                    <textarea onChange={(e) => this.onChange({e, key: 'desc'})} className="form-control" value={desc}> </textarea>
                </div>
                <div className="col-sm-12">
                    <span>Status: </span>
                    <select
                        onChange={(e) => this.onChange({e, key: 'status'})}
                        value={status}
                        className="form-control"> 
                        {STATUS.map((o, i) => {
                            const { label } = o
                            return (
                                <option key={i} value={label}>{label}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-sm-12 text-right">
                     {!isNew &&
                        <button onClick={() => this.onDelete()} className="btn btn-primary">Delete</button>   
                    }
                    {!isNew &&
                        <button onClick={() => this.onUpdate()} className="btn btn-primary">Update</button>   
                    }
                    {isNew &&
                        <button onClick={() => this.onCreateNew()} className="btn btn-primary">Create New</button>   
                    }
                    <button className="btn">Cancel</button>
                </div>
            </div>
        )
    }
}
