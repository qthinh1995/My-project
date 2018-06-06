import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class Report extends Component {
    static propTypes = {
        session: PropTypes.object
    }

    static contextTypes = {
        flux: PropTypes.object.isRequired
    }

    state = {
        list: [
            { type: 'task', name: 'NMVP-1234', desc: 'headline', priority: 'low', label: 'Clip library', reporter: 'binh nguyen', assignee: 'binh nguyen' }
        ]
    }

    render() {
        return (
            <div className="container-fluid">
                <h1>Report Page</h1>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Desc</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>name</td>
                            <td>
                                description
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div >
        )
    }
}
