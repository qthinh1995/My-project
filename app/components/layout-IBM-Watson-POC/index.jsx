import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
        inProgress: PropTypes.bool, 
        session: PropTypes.object
    }
    static contextTypes = {
        locales: PropTypes.array.isRequired,
        flux: PropTypes.object.isRequired,
        i18n: PropTypes.func.isRequired
    }

    state = {

    }

    componentWillMount() {
        console.log('----------componentWillMount home')
        const { flux } = this.context
        // console.log(flux.stores.helmet.state)
        flux.getActions('helmet').update({ title: 'home page title', description: 'home page description' })
        flux.getActions('users').index()
    }

    componentDidMount() {
  
    }

    render() {
        console.log('----------render')
       
        return (
            <div>
                <h1>
                    Caro Game
                </h1>   
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1">@</span>
					</div>
					<input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
				</div> 
            </div >
        )
    }
}
