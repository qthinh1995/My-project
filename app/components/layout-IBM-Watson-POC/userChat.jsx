import React, { Component } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
      
    }
    static contextTypes = {
       
    }


    state = {
        
    }

    render() {
        return (
            <div className="user-chatboard">
                <img src="http://i.imgur.com/UwK68Ce.png"/>
            </div >
        )
    }
}
