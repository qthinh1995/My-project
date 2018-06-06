import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class LeftMenu extends Component {
	static propTypes = {
		inProgress: PropTypes.bool,
		session: PropTypes.object,
		changePage: PropTypes.func
	}
	static contextTypes = {
		locales: PropTypes.array.isRequired,
		flux: PropTypes.object.isRequired,
		i18n: PropTypes.func.isRequired
	}

	state = {
		menus: [
			{func: 'ReactCycle', title: 'React cycle'},
			{func: 'FetchContent', title: 'Fetch Content'},
			{func: 'Translate', title: 'Translate'},
			{func: 'ImgToBase64', title: 'Img To Base64'},
			{func: 'ImgWithJimp', title: 'Img With Jimp'},
			{func: 'SaveFile', title: 'Save File'},
			{func: 'PublishingFacebook', title: 'Publishing Facebook'},
			{func: 'ShareLikeSocial', title: 'Share & Like Social'},
			{func: 'VideoWithVideojs', title: 'Video with videojs'},
			{func: 'Canvas', title: 'Canvas demo'},
			{func: 'ColorPicker', title: 'Color Picker'}
		]
	}

	changePage(page) {
		this.props.changePage(page)
	}

	render() {
		const { menus } = this.state
		return (
			<div>
				<ul>
					{menus && menus.length &&
						menus.map((e, i) => {
							const { func, title } = e
							return (
								<li key={i} onClick={() => this.changePage(func)}>{title}</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}
