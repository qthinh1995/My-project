import debug from 'debug'

import React from 'react'
import { renderToString } from 'react-dom/server'

import createFlux from 'flux/createFlux'

import ServerHTML from './server-html'
import ApiClient from '../shared/api-client'
import universalRender from '../shared/universal-render'
import assetsManualFn from './webpack-stats-fn'

export default async function (ctx) {
  console.log('/************* Define layout type by url: ctx */')
  // Init alt instance
  const client = new ApiClient(ctx.get('cookie'))
  const flux = createFlux(client)

  // Get request locale for rendering
  const locale = ctx.cookies.get('_lang') ||
    ctx.acceptsLanguages(require('../internals/config/private').locales) ||
    'en'

  const { messages } = require(`data/${locale}`)

  // Get auth-token from cookie
  const username = ctx.cookies.get('_auth')

  // Populate store with locale
  flux
    .getActions('locale')
    .switchLocale({ locale, messages })

  // Populate store with auth
  if (username) {
    flux
      .getActions('session')
      .update({ username })
  }

  debug('dev')(`locale of request: ${locale}`)

  console.log('*** process.env.DB_HO', process.env.DB_HO)
  

  try {
    const { body, title, statusCode, description, robotTag } =
      await universalRender({ flux, location: ctx.request.url })

    // Assets name are found into `webpack-stats`
    const assets = require('./webpack-stats.json')

    /*
    * Customize multi layout with: css link, script link, image link
    */
    console.log('/************* Customize multi layout : webpack-stats-manual.json */')

    // Don't cache assets name on dev
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[require.resolve('./webpack-stats.json')]
    }

    debug('dev')('return html content')
    const props = { body, assets, assetsManual: assetsManualFn.getAssets({ url: ctx.request.url }), locale, title, description, robotTag, url: ctx.request.url }
    const html = renderToString(<ServerHTML { ...props } />)
    ctx.status = statusCode
    ctx.body = `<!DOCTYPE html>${html}`
  } catch (err) {
    // Render 500 error page from server
    const { error, redirect } = err
    if (error) throw error

    // Handle component `onEnter` transition
    if (redirect) {
      const { pathname, search } = redirect
      ctx.redirect(pathname + search)
    } else {
      throw err
    }
  }
}
