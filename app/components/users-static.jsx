import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import { Link } from 'react-router'

import { replaceParams } from 'utils/localized-routes'

@connect(({ usersStatic: { collection } }) => ({ collection }))
class UsersStatic extends Component {

  static propTypes = { collection: PropTypes.array.isRequired }

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { flux, i18n } = this.context

    flux.getActions('helmet').update({ title: i18n('usersStatic.page-title') })
    flux.getActions('usersStatic').index()
  }

  handleRemove(index: number) {
    const { flux } = this.context
    flux.getActions('usersStatic').remove(index)
  }

  renderUser = (user: { seed: string, email: string }, index: number) => {
    const { i18n } = this.context
    const { seed, email } = user
    const profileRoute: string = replaceParams(i18n('routes.profile'), { seed })

    return (
      <tr className='user--row' key={ index }>
        <td>{ email }</td>
        <td className='text-center'>
          <Link to={ profileRoute }>{ i18n('usersStatic.profile') }</Link>
        </td>
        <td className='text-center'>
          <button
            className='user--remove'
            onClick={ () => this.handleRemove(index) }>
            X
          </button>
        </td>
      </tr>
    )
  }

  render() {
    const { collection } = this.props
    const { i18n } = this.context

    // console.log(collection)
    return (
      <div>
        <h1 className='text-center'>
          { i18n('usersStatic.title') }
        </h1>
        <table className='app--users'>
          <thead>
            <tr>
              <th><i className="fa fa-bars" aria-hidden="true"></i> { i18n('usersStatic.email') } </th>
              <th colSpan='2'><i className="fa fa-bluetooth-b" aria-hidden="true"></i> { i18n('usersStatic.actions') } </th>
            </tr>
          </thead>
          <tbody>
            { collection.map(this.renderUser) }
          </tbody>
        </table>
      </div>
    )
  }

}

export default UsersStatic
