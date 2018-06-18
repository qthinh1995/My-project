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
        component: require('./components/layout-IBM-Watson-POC/index')
      }) }
      <Route path='*' component={ require('./pages/not-found') } />
    </Route>
  )
}
