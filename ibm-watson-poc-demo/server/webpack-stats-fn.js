const WebpackState = {
    data: {
        goliath: {
            script: [],
            style: [
            ],
            images: []
        },
        default: {
            script: [
                'http://vjs.zencdn.net/5.11/video.js',
                '/public/styles/lib/jimp/jimp.min.js'
            ],
            style: [
                '/public/styles/lib/bootstrap/bootstrap.min.css',
                '/public/styles/lib/font-awesome/css/font-awesome.min.css',
                '/public/styles/lib/bootstrap/bootstrap-colorpicker.min.css',
                'http://vjs.zencdn.net/5.11/video-js.css'
            ]
        },
        research: {
            script: [
                'http://vjs.zencdn.net/5.11/video.js',
                '/public/styles/lib/jimp/jimp.min.js'
            ],
            style: [
                '/public/styles/lib/bootstrap/bootstrap.min.css',
                '/public/styles/lib/font-awesome/css/font-awesome.min.css',
                '/public/styles/lib/bootstrap/bootstrap-colorpicker.min.css',
                'http://vjs.zencdn.net/5.11/video-js.css',
                '/public/styles/lib/videojs/custom.css'
            ],
            images: []
        }
    },
    getAssets({ url = '' }) {
        let layout = 'default';
        layout = (url.indexOf('/goliath') > -1) ? 'goliath' : layout;
        return this.data[layout];
    }
}

export default WebpackState;
