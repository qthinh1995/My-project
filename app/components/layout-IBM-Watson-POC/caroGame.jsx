import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroGame extends Component {
    static propTypes = {
      
    }
    static contextTypes = {
      
    }

    state = {

    }

    componentWillMount() {
     
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
