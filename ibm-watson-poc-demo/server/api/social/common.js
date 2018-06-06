import axios from 'axios'
import Twitter from 'twitter'
import superagent from 'superagent'

const message = 'test http://bit.ly/2xnq50Y   test new tes2'
const SOCIALINFO = {
	facebook: {
		config: {
			accessToken: 'EAATaYEbTlH8BAMWAgDNfSO72UyLja7YxGUBQEdpVd9TYT3khlCA9HW9b4MyYKmPZAgKJV1vsqvZBoo6dFiLdxjJkgajzLk9PZBOZAl2y3DhSYpk28XkuPTwDAnMJZCVitcjEF7iYxMnPLVzePBXh4qFPB2onT7lZB20S9X4wO6uIfc4ZBHGyu3ZC',
			pageId: '290621477994105'
		},
		data: {
			message,
			name: 'test',
			description: 'wnow',
			link: 'http://wnow.ddev1.worldnow.com/story/35607350/2017/08/22/test',
			picture: ''
		},
		dataArticle: {
			html_source: '<!doctype html>\n<html lang="en" prefix="op: http://media.facebook.com/op#">\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta property="op:markup_version" content="v1.0">\n\t\t<link rel="canonical" href="http://wnow.ddev1.worldnow.com/story/35607350/2017/08/22/test">\n\t</head>\n<body>\n\t<article>\n\t\t<header>\n\t\t\t<!-- The published and last modified time stamps -->\n\t\t\t<time class="op-published" dateTime="2017-08-22T08:13:37.073Z">August 22nd, 15:13 PM</time>\n\t\t\t<time class="op-modified" dateTime="2017-08-22T08:13:37.843Z">August 22nd, 15:13 PM</time>\n<!-- The authors of your article -->\n\t  <h1> test </h1>\n\t\t\t<h2> wnow </h2>\n\t\t</header>\n\t\t\t<!-- Content of article -->\n<div> \n<p>test</p><style>div[data-mml-type="relatedcategory"]{border: thin solid #e7e7e7;} .categories-right-icon{display: none;} .stories-area > hr{margin: 0px;} .stories-area > iframe {border: white;} div[data-mml-type]{ overflow: hidden; } div[data-mml-status="draft"] {display: none !important;} div.fb-post span, div.fb-post span iframe{max-width: 100%;} div[data-mml-type="twitter"].left, div[data-mml-type="instagram"].left, div[data-mml-type="facebook"].left{  float: left;  position: relative;  overflow:hidden; max-width:100%;}div[data-mml-type="twitter"].right,div[data-mml-type="instagram"].right,div[data-mml-type="facebook"].right{  float: right;  position: relative;  overflow:hidden; max-width:100%;}div[data-mml-type="twitter"].center,div[data-mml-type="instagram"].center,div[data-mml-type="facebook"].center{  width: 100% !important;  overflow:hidden; text-align: center;}div[data-mml-type="twitter"].center iframe,div[data-mml-type="twitter"].center twitterwidget,div[data-mml-type="instagram"].center iframe,div[data-mml-type="facebook"].center iframe{  margin: auto !important;}div[data-mml-type="facebook"].center > span{  margin: auto !important;  display: block !important;} .mml-display-none{display: none !important;} div[data-mml-type="gmaps"], div[data-mml-type="youtube"] {position:relative; width:100%; padding-bottom:56.25%;} div[data-mml-type="gmaps"] iframe, div[data-mml-type="youtube"] iframe {position:absolute; left:0; top:0;} div[data-embed-type="clip"],div[data-mml-type="clip"]{position: relative;padding-bottom: 56.25%;width: 100%;box-sizing: border-box;} div[data-embed-type="clip"] iframe { position: absolute;}}</style><style>div[data-embed-type="social"], {position: relative;padding-bottom: 56.25%;width: 100%;box-sizing: border-box;} div[data-embed-type="social"] iframe,div[data-mml-type="clip"] iframe { position: absolute;}}.frankly-img{max-width:100%;}</style><script></script>\n</div>\n<figure class="op-ad">\n\t<iframe src="http://content.worldnow.com/global/vendor/facebook/instantarticlead.html?client=wnow&natsplit=50&locsplit=50" frameborder="0" height="300" width="320"></iframe>\n</figure>\n<footer>\n\t\t<!-- Copyright details for your article -->\n\t\t<small>All content &copy; Copyright 2000 - 2015  WorldNow. All Rights Reserved.<BR>For more information on this site, please read our <A HREF=\'/global/story.asp?s=18990\'>Privacy Policy</A> and <A   REF=\'/global/story.asp?s=18991\'>Terms of Service</A></small>\n</footer>\n\t</article>\n</body>\n</html>',
			published: true
		}
	},
	twitter: {
		config: {
			consumerKey: 'WseKWfIwvjc55BSiSQ9UXgakD',
			consumerSecret: 'ikdix2kWdjyd0raSApJJ6bVtXNOuTCYNHgIE6RVz5F3hJtJX5Y',
			accessTokenKey: '891934720413454336-OQVO69owoEQGdSURDLye9wQ148ReT9V',
			accessTokenSecret: 'hTArVSPVCvmR7P2dw5rZ4Jx8VdwQUtKAd1r2qeWjsUAn9'
		},
		data: { status: message }
	},
	linkedin: {
		config: {
			accessToken: 'AQV9yqLbNEgHepXW4jrpXaz1tJUldIjh7jn5G5y_A2GL_QBeIIKh1HyjgGGWi6bvYBz3hT93Rz74wVDA2-TTePC6s0SJEDIIVfLvjfg1zkjpYBykKJ0rY8nMYBDUp_DcoCKWw09rMdgIZERNSX94eIqzMNor3XHrBZxu8g63u5V8BN1h1dM'
		},
		data: {
			comment: message,
			content: {
				title: 'test',
				description: 'wnow',
				'submitted-url': 'http://bit.ly/2xnq50Y',
				'submitted-image-url': ''
			},
			visibility: { code: 'anyone' }
		}
	}
}

const SocialCommon = {
	shareFBPromise() {
		const { dataArticle, data: dataTmp, config } = SOCIALINFO.facebook
		const p = new Promise((resolve) => {
			const facebookType = 'feed' //instant_articles
			const data = (facebookType === 'instant_articles') ? dataArticle : dataTmp
			const url = `https://graph.facebook.com/${config.pageId}/${facebookType}?access_token=${config.accessToken}`
			axios.post(url, data)
				.then((res) => {
					/*
					res.data = {id: "664867177022360_891509147691494"}
					*/
					resolve({ data: res.data })
				}).catch((res) => {
					/*
					res.data = { error: 
					{ message: 'Malformed access token AAOop75fcuMBAGEM4DqZBo2LmTkRJ4NN007KucQpZAWgPkZB22nZCV0gWseG0co35sAb0Fjh3u8L6ZCVBVccWKhDACeHla4yWvoCjlyeZCCaPvapit2d0iL2y489XMOftG0ixp1DwyAejZABOuBG2bATFiMDU4PrBtcf4oXZAHAZCTgZDZD',
						type: 'OAuthException',
						code: 190,
						fbtrace_id: 'BMFsqRpsTxt' }
					}
					*/
					resolve(res.data);
				})
		}
		);
		return p
	},

	shareTwitterPromise() {
		const { data, config } = SOCIALINFO.twitter
		const p = new Promise((resolve) => {
			const twitter = new Twitter({
				consumer_key: config.consumerKey,
				consumer_secret: config.consumerSecret,
				access_token_key: config.accessTokenKey,
				access_token_secret: config.accessTokenSecret
			})
			twitter.post('statuses/update', data, (error, tweet) => {
				resolve({ error, data: tweet });
			});
		}
		);
		return p
	},

	shareLinkedinPromise() {
		const { data, config } = SOCIALINFO.linkedin
		const p = new Promise((resolve) => {
			const url = `https://api.linkedin.com/v1/people/~/shares?format=json&oauth2_access_token=${config.accessToken}`
			superagent
				.post(url)
				.send(data)
				.end((error, response) => {
					if (!error) {
						resolve({ data: JSON.parse(response.text) });
					} else {
						resolve({ error: JSON.parse(response.text) });
					}
				});
		}
		);
		return p
	},

	profileFBPromise() {
		const { config } = SOCIALINFO.facebook
		const url = `https://graph.facebook.com/664867177022360?access_token=${config.accessToken}`
		const p = new Promise((resolve) => {
			axios.get(url)
				.then((res) => {
					/*
					res.data = {name: "Franckly news", id: "664867177022360"}
					* icon: https://graph.facebook.com/${id}/picture
					*/
					resolve({ data: res.data })
				}).catch((res) => {
					/*
					*/
					resolve(res.data);
				})
		}
		);
		return p
	},
	profileTwitterPromise() {
		const { data, config } = SOCIALINFO.twitter
		const p = new Promise((resolve) => {
			const twitter = new Twitter({
				consumer_key: config.consumerKey,
				consumer_secret: config.consumerSecret,
				access_token_key: config.accessTokenKey,
				access_token_secret: config.accessTokenSecret
			})
			twitter.get('/account/verify_credentials', data, (error, tweet) => {
				resolve({ error, data: tweet });
			});
		}
		);
		return p
	},
	profileLinkedinPromise() {
		const { config } = SOCIALINFO.linkedin
		const p = new Promise((resolve) => {
			const url = `https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url,firstName,lastName,headline,siteStandardProfileRequest)?format=json&oauth2_access_token=${config.accessToken}`
			superagent.get(url)
				.end((error, response) => {
					if (!error) {
						resolve({ data: JSON.parse(response.text) });
					} else {
						resolve({ error: JSON.parse(response.text) });
					}
				});
		}
		);
		return p
	}
}

export default SocialCommon
