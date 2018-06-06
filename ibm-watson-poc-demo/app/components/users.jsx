import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import { Link } from 'react-router'
import superagent from 'superagent'

// import { replaceParams } from 'utils/localized-routes'
import LimitPermission from 'components/shared/limit-permission.jsx'
import { getCookie } from 'js/common'

const { BROWSER } = process.env

@connect(({ users: { users } }) => ({ users }))
class Users extends Component {

  static propTypes = { users: PropTypes.array.isRequired }

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  state = {}

  componentWillMount() {
    const { flux } = this.context
    flux.getActions('users').index()
    const { users = [] } = this.props
    this.state.users = users;
  }

  handleRemove(index, id) {
    const { flux } = this.context
    /** remove local */
    flux.getActions('users').remove(index)
    /** remove database */
    superagent.del(`/api/sql/users/${id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        console.log(res)
      })
  }

  putUser(index, id) {
    const time = new Date().getTime()
    const data = {
      email: `${time}.coleman83@example.com`
    }
    superagent.put(`/api/sql/users/${id}`)
      .set('Accept', 'application/json')
      .send({ data })
      .end((err, res) => {
        console.log(res)
      })
  }

  postUser() {
    console.log(this)
    const data = {
      gender: 'female',
      email: 'clara12.coleman83@example.com',
      username: 'smallsnake436',
      password: 'total',
      salt: 'ROOujBwn',
      sha1: '81f58d15787d3e0a63685facfa139399f05f947c',
      sha256: '0687fe39adb0e43c28c8ffb70e84baa2ea2e1bae0afa349db31b4e861208ec8e',
      registered: '1238304997',
      dob: '56822726',
      phone: '(951)-385-6121',
      cell: '(657)-919-3511',
      picture: 'http://api.randomuser.me/portraits/women/72.jpg',
      nationality: 'US'
    }
    superagent.post('/api/sql/users')
      .set('Accept', 'application/json')
      .send({ data })
      .end((err, res) => {
        console.log(res.body)
      })
  }

  renderUser = (user, index) => {
    const { i18n } = this.context
    const { email, id } = user

    return (
      <tr className='user--row' key={index}>
        <td>{email}</td>
        <td className='text-center'>
          <Link >{i18n('users.profile')}</Link>
        </td>
        <td className='text-center'>
          <button
            className='user--remove'
            onClick={() => this.handleRemove(index, id)}>
            X
          </button>
        </td>
        <td className='text-center'>
          <button
            onClick={() => this.putUser(index, id)}>
            Edit
          </button>
        </td>
      </tr>
    )
  }

  render() {
    const { users } = this.state
    const { i18n, flux } = this.context
    console.log(users.length)

    if (users.length === 0) {
      flux.getActions('users').index()
    }

    const permission = (BROWSER) ? getCookie('_vn_role') : '';
    return (

      <div>
        {permission !== 'root' &&
          <LimitPermission />
        }
        {permission === 'root' &&
          < div >
            <h1 className='text-center'>
              users page
            </h1>
            <button onClick={() => this.postUser()}>Add user</button>
            <table className='table'>
              <thead>
                <tr>
                  <th> {i18n('users.email')} </th>
                  <th colSpan='2'> {i18n('users.actions')} </th>
                </tr>
              </thead>
              <tbody>
                {users.map(this.renderUser)}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}

export default Users
