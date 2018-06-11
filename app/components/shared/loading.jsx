import React, { Component, PropTypes } from 'react'

export default class Loading extends Component {
    static propTypes = {
		isLoading: PropTypes.bool
    }
    static contextTypes = {
    }

	state = {
		styleDiv: {
			position: 'fixed',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			zIndex: 99998,
			background: 'black',
			opacity: '0.1'
		},
		styleContent: {
			position: 'fixed',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			zIndex: 99999,
			textAlign: 'center',
			paddingTop: '100px'
		}
	}

    render() {
		const { styleDiv, styleContent } = this.state
		const { isLoading } = this.props
		console.log('Loading')
        return (
            <div className="loading-area" style={{display: isLoading ? 'block' : 'none'}}>
				<div style={styleDiv}></div>
				<div style={styleContent}>
					<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
        )
    }
}
