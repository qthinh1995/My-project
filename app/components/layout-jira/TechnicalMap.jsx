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
                <div className="tecnical-map-container">
                    <div className="technical-component main">
                        <div className="info-list">
                            <ul>
                                <li>Line 1</li>
                                <li>Line 1</li>
                                <li>Line 1</li>
                            </ul>
                        </div>
                        <div className="technical-name">
                            Server
                        </div>
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component left-top">
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component left-middle">
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component left-bottom">
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component right-top">
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component right-middle">
                    </div>
                </div>
                <div className="tecnical-map-container">
                    <div className="technical-component right-bottom">
                    </div>
                </div>
            </div >
        )
    }
}
