import React, { Component, PropTypes } from 'react'
// import HeaderDefault from 'components/layout-default/header'
// import Footer from 'components/layout-default/footer'

/** this.context: flux + store
 *  this.props: route + location
*/
/* istanbul ignore next */
if (process.env.BROWSER) {
  console.log('process', process)
  require('styles/app.css')
}

class App extends Component {

  static propTypes = { children: PropTypes.node }
  static contextTypes = { flux: PropTypes.object.isRequired }

  state = { i18n: this.context
      .flux.getStore('locale').getState() }

  componentDidMount() {
    const { flux } = this.context
    flux.getStore('helmet').listen(this.handleTitleChange)
  }

  componentWillUnmount() {
    const { flux } = this.context
    flux.getStore('helmet').unlisten(this.handleTitleChange)
  }

  handleTitleChange({ titleBase, title }) {
    document.title = titleBase + title
  }

  render() {
    const { children } = this.props
    // console.log(children.props.route)
    // const newsLayoutComponents = [ '/', '/news' ]
    // if (newsLayoutComponents.some(e => e === children.props.route.path)) {
    //   Header = HeaderForNews
    // }
    return (
      <div>
        { children }
      </div>
    )
  }

}

export default App
