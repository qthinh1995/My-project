import React from 'react'
import { Route } from 'react-router'

import { generateRoute } from 'utils/localized-routes'
// import { isConnected } from 'utils/routes-hooks'

export default function (flux) { /* eslint react/display-name: 0 */
  console.log('Route-------------------_')
  console.log(flux.stores.helmet.state)
  return (
    <Route component={ require('./components/app') }>
      {/*** default of project */}
      {/* Public router */}
      { generateRoute({
        paths: [ '/profile/:seed', '/profil/:seed' ],
        component: require('./components/profile')
      }) }
      {/* CMS TEAM */}
      { generateRoute({
        paths: [ '/' ],
        component: require('./components/layout-default/header')
      }) }
      { generateRoute({
        paths: [ '/guides' ],
        component: require('./components/guides')
      }) }
      { generateRoute({
        paths: [ '/users' ],
        component: require('./components/layout-research/home')
      }) }
      { generateRoute({
        paths: [ '/newpage' ],
        component: require('./pages/not-found')
      }) }
      { generateRoute({
        paths: [ '/login' ],
        component: require('./components/layout-IBM-Watson-POC')
      }) }
      <Route path='*' component={ require('./pages/not-found') } />
    </Route>
  )
}
