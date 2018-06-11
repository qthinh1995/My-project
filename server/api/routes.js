import axios from 'axios'
import jsdom from 'jsdom'
import _ from 'lodash'
import base64Img from 'base64-img';
import imgDownload from 'image-downloader'
import writeFile from 'write'
// import Twitter from 'twitter'
// import superagent from 'superagent'
import { users } from './data.json'
import models from './sequelize/models'
import SocialCommon from './social/common'
import json2xls from 'json2xls'
import fs from 'fs' 

const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }))

/** table configuration */
const ITEM_LIMIT = 1000
const TABLE_MAP = {
  users: {
    table: 'User',
    limit: ITEM_LIMIT,
    searchKey: 'id'
  },
  news: {
    table: 'news_beauty_tb',
    limit: ITEM_LIMIT,
    searchKey: 'key'
  },
  tickets: {
    table: 'Ticket',
    limit: ITEM_LIMIT,
    searchKey: 'id'
  },
  projects: {
    table: 'Project',
    limit: ITEM_LIMIT,
    searchKey: 'id'
  }
}
const ATT_EXCLUDE = { exclude: [ 'updatedAt' ] }
const locales = [
  { locale: 'vi' },
  { locale: 'af' }
  // { locale: 'bn' },
  // { locale: 'cy' },
  // { locale: 'eo' },
  // { locale: 'fi' },
  // { locale: 'ha' },
  // { locale: 'hu' },
  // { locale: 'it' },
  // { locale: 'kk' },
  // { locale: 'lo' },
  // { locale: 'mk' },
  // { locale: 'mt' },
  // { locale: 'ar' },
  // { locale: 'az' },
  // { locale: 'be' },
  // { locale: 'bg' },
  // { locale: 'bs' },
  // { locale: 'ca' },
  // { locale: 'ceb' },
  // { locale: 'cs' },
  // { locale: 'da' },
  // { locale: 'de' },
  // { locale: 'el' },
  // { locale: 'en' },
  // { locale: 'es' },
  // { locale: 'et' },
  // { locale: 'eu' },
  // { locale: 'fa' },
  // { locale: 'fr' },
  // { locale: 'ga' },
  // { locale: 'gl' },
  // { locale: 'gu' },
  // { locale: 'hi' },
  // { locale: 'hmn' },
  // { locale: 'hr' },
  // { locale: 'ht' },
  // { locale: 'hy' },
  // { locale: 'id' },
  // { locale: 'ig' },
  // { locale: 'is' },
  // { locale: 'iw' },
  // { locale: 'ja' },
  // { locale: 'jw' },
  // { locale: 'ka' },
  // { locale: 'km' },
  // { locale: 'kn' },
  // { locale: 'ko' },
  // { locale: 'la' },
  // { locale: 'lt' },
  // { locale: 'lv' },
  // { locale: 'mg' },
  // { locale: 'mi' },
  // { locale: 'ml' },
  // { locale: 'mn' },
  // { locale: 'mr' },
  // { locale: 'ms' },
  // { locale: 'my' },
  // { locale: 'ne' },
  // { locale: 'nl' },
  // { locale: 'no' },
  // { locale: 'ny' },
  // { locale: 'pa' },
  // { locale: 'pl' },
  // { locale: 'pt' },
  // { locale: 'ro' },
  // { locale: 'ru' },
  // { locale: 'si' },
  // { locale: 'sk' },
  // { locale: 'sl' },
  // { locale: 'so' },
  // { locale: 'sq' },
  // { locale: 'sr' },
  // { locale: 'st' },
  // { locale: 'su' },
  // { locale: 'sv' },
  // { locale: 'sw' },
  // { locale: 'ta' },
  // { locale: 'te' },
  // { locale: 'tg' },
  // { locale: 'th' },
  // { locale: 'tl' },
  // { locale: 'tr' },
  // { locale: 'uk' },
  // { locale: 'ur' },
  // { locale: 'uz' },
  // { locale: 'yi' },
  // { locale: 'yo' },
  // { locale: 'zh' },
  // { locale: 'zh-CN' },
  // { locale: 'zh-TW' },
  // { locale: 'zu' }
]


function routes(router) {
  router.get('/users-static', async function (ctx) {
    ctx.body = simplifyUsers(users.slice(0, 10))
  })

  router.get('/users-static/:seed', async function (ctx) {
    const { seed } = ctx.params
    const [ result ] = simplifyUsers(users.filter(user => user.seed === seed))
    if (!result) {
      ctx.body = { error: { message: 'User not found' } }
    } else {
      ctx.body = result
    }
  })

  /* Start sequelize mySQL */
  router.get('/sql/:tb', async function (ctx) {
    /** get all*/ 
    const { tb } = ctx.params
    const { table, limit } = TABLE_MAP[tb]
    await models[table].findAll({ limit })
      .then((arr) => {
        ctx.body = arr;
      }).catch((error) => {
        ctx.body = error
      })
  })

  router.get('/sql/:tb/:id', async function (ctx) {
    /** get one*/
    const { id, tb } = ctx.params
    const { table, searchKey } = TABLE_MAP[tb]
    const where = `{ '${searchKey}': '${id}' }`
    await models[table].find({where: JSON.parse(where), attributes: ATT_EXCLUDE})
      .then((obj) => {
        ctx.body = obj;
      }).catch((error) => {
        ctx.body = error
      })
  })

  router.del('/sql/:tb/:id', async function (ctx) {
    /** delete one*/
    const { id, tb } = ctx.params
    const { table } = TABLE_MAP[tb]
    await models[table].destroy({ where: { id } })
      .then((obj) => {
        ctx.body = obj;
      }).catch((error) => {
        ctx.body = error
      })
  })

  router.post('/sql/:tb', async function (ctx) {
    /** add new one*/
    const { tb } = ctx.params
    const { table } = TABLE_MAP[tb]
    const { data } = ctx.request.body
    await models[table].create(data)
      .then((obj) => {
        ctx.body = obj
      }).catch((error) => {
        ctx.status = 400;
        ctx.body = error
      })
  })

  router.put('/sql/:tb/:id', async function (ctx) {
    /** edit one*/
    const { id, tb } = ctx.params
    const { table } = TABLE_MAP[tb]
    const { data } = ctx.request.body
    await models[table].update(data, { where: { id } })
      .then((obj) => {
        ctx.body = obj
      }).catch((error) => {
        ctx.body = error
      })
  })

  /* End sequelize mySQL */
  router.post('/read-meta-tag', async function (ctx) {
    const { url } = ctx.request.body
    await axios.get(url)
      .then((response) => {
        ctx.body = { data: response.data, error: false }
      }).catch((error) => {
        ctx.body = { data: '', error }
      })
  })
  router.post('/image/base64', async function (ctx) {
    const { url } = ctx.request.body
    const promiseArr = []
    const p = new Promise((resolve) => {
      base64Img.requestBase64(url, (err, res2, body) => {
        resolve({ base64Str: body, err, res2 })
      });
    }
    );
    promiseArr.push(p)

    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = { base64Str: arr[0].base64Str }
    })
  })

  router.post('/read-meta-tag-with-jsdom', async function (ctx) {
    const { url } = ctx.request.body
    const promiseArr = []
    const p = new Promise((resolve) => {
      axios.get(url)
        .then((response) => {
          const html = response.data;
          jsdom.env(
            html,
            (err, window) => {
              resolve({ body: window.document.body.outerHTML });
            }
          );
        }).catch((error) => {
          resolve({ body: '', error });
        })
    }
    );
    promiseArr.push(p)
    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = arr[0]
    })
  })

  router.post('/google-translate', async function (ctx) {
    const promiseArr = []
    const params = {
      userText: 'man',
      l: locales
    }
    const obj = {
      man: 'man',
      chicken: 'chicken',
      ok: 'ok',
      good: 'good',
      bad: 'bad',
      yes: 'yes',
      no: 'no',
      question: 'question',
      any: 'any',
      boy: 'boy',
      girl: 'girl',
      woman: 'woman',
      child: 'child',
      run: 'run',
      ran: 'ran',
      wrong: 'wrong',
      best: 'best',
      you: 'you',
      me: 'me',
      chickend: 'chickend'
    }

    _.forEach(obj, (k) => {
      params.userText = k
      const p = new Promise((resolve) => {
        axios.post('http://translatr.varunmalhotra.xyz', params)
          .then((response) => {
            if (response.data && response.data.translatedText) {
              resolve({ data: response.data.translatedText });
            } else {
              resolve({ data: '', error: true });
            }
          }).catch((error) => {
            resolve({ data: '', error });
          })
      }
      );
      promiseArr.push(p)
    })

    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = { arr }
    })
  })
  /*
  - upload folder must be existed and have all permissions
  */
  router.post('/saveImageFromUrl', async function (ctx) {
    // const { url } = ctx.request.body
    const promiseArr = []
    const p = new Promise((resolve) => {
      const options = {
        url: 'https://cdn.pixabay.com/photo/2016/01/12/19/16/painting-1136443_960_720.jpg',
        dest: '/home/binh.nguyen/Documents/bitBucket_wave/example_react/app/images/upload/test.jpg'                  // Save to /path/to/dest/image.jpg 
      }
      imgDownload.image(options)
        .then(({ filename, image }) => {
          console.log('File saved to', filename)
          resolve({ filename, image });
        }).catch((error) => {
          resolve({ error });
        })
    }
    );
    promiseArr.push(p)
    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = arr[0]
    })
  })

  router.post('/saveStrToFile', async function (ctx) {
    const str = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="//www.daikynguyenvn.com/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>http://www.daikynguyenvn.com/post-sitemap1.xml</loc>
		<lastmod>2014-12-26T08:37:36+06:00</lastmod>
	</sitemap>
</sitemapindex>`
    const promiseArr = []
    const p = new Promise((resolve) => {
      writeFile('app/images/upload/222.xml', str, (err) => {
        if (err) {
          resolve({err})
        } else {
          resolve({result: 'save file ok'})
        }
      });
    }
    );
    promiseArr.push(p)
    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = arr[0]
    })
  })

  router.post('/sharesocial/:type', async function (ctx) {
    const { type } = ctx.params
    const promiseArr = []

    /*Share LinkedIn*/
    if (type === 'all' || type ==='linkedin') {
      const pLinkedIn = SocialCommon.shareLinkedinPromise();
      promiseArr.push(pLinkedIn)
    }
    /*Share Twitter*/
    if (type === 'all' || type ==='twitter') {
      const pTwitter = SocialCommon.shareTwitterPromise();
      promiseArr.push(pTwitter)
    }
    /*Share Facebook*/
    if (type === 'all' || type ==='facebook') {
      const pFacebook = SocialCommon.shareFBPromise();
      promiseArr.push(pFacebook)
    }
    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = arr
    })
  })

  router.post('/getprofile', async function (ctx) {
    const promiseArr = []
    promiseArr.push(SocialCommon.profileFBPromise())
    promiseArr.push(SocialCommon.profileTwitterPromise())
    promiseArr.push(SocialCommon.profileLinkedinPromise())

    /** start promise */
    await Promise.all(promiseArr).then(async (arr) => {
      ctx.body = arr
    })
  })

  router.get('/jsontoxls', async function (ctx) {
    const json = {
      foo: 'bar',
      qux: 'moo',
      poo: 123,
      stux: new Date()
    }
    //export only the field 'poo'
    let xls = json2xls(json, {
      fields: [ 'poo' ]
    });

    //export only the field 'poo' as string
    xls = json2xls(json, {
      fields: { poo: 'string' }
    });

    fs.writeFileSync('data.xlsx', xls, 'binary');
    ctx.body = { data: xls }
  })

  router.get('/sql/login/:username/:password', async function (ctx) {
    const { password, username } = ctx.params
    const { table } = TABLE_MAP.users
    await models[table].find({ where: { username, password } })
      .then((obj) => {
        ctx.body = obj
      }).catch((error) => {
        ctx.body = error
      })
  })

  /* Start sequelize mySQL */
  router.post('/search/sql/:tb', async function (ctx) {
    /** get all*/
    const { tb } = ctx.params
    const { table, limit } = TABLE_MAP[tb]
    const body = ctx.request.body || {}

    const where = {}
    Object.keys(body).forEach((key) => {
      if (body[key]) {
        where[key] = body[key]
      }
    })

    await models[table].findAll({ limit, where, attributes: ATT_EXCLUDE })
      .then((arr) => {
        ctx.body = arr;
      }).catch((error) => {
        ctx.body = error
      })
  })
}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes
