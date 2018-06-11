import React from 'react'
import { Route } from 'react-router'

import { generateRoute } from 'utils/localized-routes'
import { isConnected } from 'utils/routes-hooks'

export default function (flux) { /* eslint react/display-name: 0 */
  console.log('Route-------------------_')
  console.log(flux.stores.helmet.state)
  return (
    <Route component={ require('./components/app') }>
      {/*** default of project */}
      {/* Public router */}
      { generateRoute({
        paths: [ '/users-static', '/utilisateurs' ],
        component: require('./components/users-static')
      }) }
      { generateRoute({
        paths: [ '/guides' ],
        component: require('./components/guides')
      }) }
      { generateRoute({
        paths: [ '/profile/:seed', '/profil/:seed' ],
        component: require('./components/profile')
      }) }
      { generateRoute({
        paths: [ '/login', '/connexion' ],
        component: require('./pages/login')
      }) }
      { generateRoute({
        paths: [ '/research' ],
        component: require('./components/layout-research/home')
      }) }
      { generateRoute({
        paths: [ 'users' ],
        component: require('./components/users'),
        onEnter: isConnected(flux)
      }) }
      {/* Private router */}
      { generateRoute({
        paths: [ '/account' ],
        component: require('./pages/account'),
        onEnter: isConnected(flux)
      }) }

      {/*** Manual of project */}
      {/* Public router */}
     
      {/* Private router */}
      {/*{ generateRoute({
        paths: [ '/manager/news' ],
        component: require('./components/manager-news'),
        layout: 'news',
        onEnter: isConnected(flux)
      }) }
      { generateRoute({
        paths: [ '/manager/news/:id' ],
        component: require('./components/manager-news-detail'),
        onEnter: isConnected(flux)
      }) }*/}
      { generateRoute({
        paths: [ '/tuuopm', '/tuuopm/tasks' ],
        component: require('./components/layout-jira/Tickets'),
        layout: 'jira',
        onEnter: isConnected(flux)
      }) }
      { generateRoute({
        paths: [ '/tuuopm/report/:date' ],
        component: require('./components/layout-jira/Report'),
        layout: 'jira',
        onEnter: isConnected(flux)
      }) }
      { generateRoute({
        paths: [ '/tuuopm/technical-map' ],
        component: require('./components/layout-jira/TechnicalMap'),
        layout: 'jira',
        onEnter: isConnected(flux)
      }) }
      {/* CMS TEAM */}
      { generateRoute({
        paths: [ '/' ],
        component: require('./components/layout-IBM-Watson-POC/index')
      }) }
      <Route path='*' component={ require('./pages/not-found') } />
    </Route>
  )
}
