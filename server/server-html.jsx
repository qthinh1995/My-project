import React from 'react'

type Props = {
  body: string,
  assets: Object,
  assetsManual: Object,
  locale: string,
  title: string,
  description: string,
  robotTag: string,
  url: string
};

function ServerHTML(props: Props) {
  const { body, assets, locale, title, description, assetsManual, robotTag, url } = props

  return (
    <html lang={ locale }>
      <head>
        <meta charSet='utf-8' />
        {/* Styles */}
        <link rel='icon' type='image/ico' href='/favicon.ico' />
        <link rel="canonical" href={`/${url}`}/>

        {/* robot tag */}
        { robotTag &&
          <meta name="robots" content={robotTag} />
        }

        { assetsManual.style.map((href, idx) => 
          <link key={ idx } rel='stylesheet' href={ href } />) }
        { assets.style.map((href, idx) => 
          <link key={ idx } rel='stylesheet' href={ href } />) }
        {/* SEO */}
        <title>{ title }</title>
        
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content={ description } />
        <meta name='keywords' content="viewnhanh, viewnhanh.com, tin tuc, tin trong nuoc, tin the gioi, khoa hoc, am thuc, du lich, doi song, phap luat, kinh te, bat dong san" />
        {/* <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-52d34a5433d85b84"></script> */}
        <div id="fb-root"></div>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </head>
      <body>
        <div id='content' dangerouslySetInnerHTML={ { __html: body } } />
        { assets.script.map((src, idx) =>
          <script key={ idx } src={ src } />) }
        { assetsManual.script.map((src, idx) =>
          <script key={ idx } src={ src } />) }
        {/* <script async defer id='github-bjs' src='https://buttons.github.io/buttons.js' /> */}
        
        <script type="text/javascript" src="//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1029863337063139"></script>  
        <script src="//platform.linkedin.com/in.js" type="text/javascript"> lang: en_US</script>
        <script type="text/javascript" async defer src="//assets.pinterest.com/js/pinit.js"></script>
        <script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=596c3732e29218001169f4c6&product=sticky-share-buttons"></script>
      </body>
    </html>
  )
}

export default ServerHTML
