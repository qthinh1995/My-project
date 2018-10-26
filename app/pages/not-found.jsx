import React, { Component } from 'react'
import PropTypes from 'prop-types';

class NotFound extends Component {

  static contextTypes = { flux: PropTypes.object.isRequired }

  componentWillMount() {
    const { flux } = this.context
    flux.getActions('helmet')
      .update({ title: 'Page not found', statusCode: 404, robotTag: 'noindex' })
  }

  render() {
    return <h1>404</h1>
  }

}

export default NotFound
