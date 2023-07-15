export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname']

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined')
  const pageHtml = ReactDOMServer.renderToString(
    <Page {...pageProps} />
  )

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'online editor'
  const desc = (documentProps && documentProps.description) || 'Making circles in the browser'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return { documentHtml }
}
