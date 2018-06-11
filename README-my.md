## Fix bugs:
/*start*/
- koa module error , need older koa module
  -> missing koa-static module
  - Solution: 
    - npm i koa@2.0.0-alpha.3
    - npm i koa-static --save


## Workflows:
/*main*/
1. create Component:  /components/home.jsx
2. create Action:     /flux/actions/home.js
    2.1: export to project: /flux/actions/index.js
3. create Store:      /flux/stores/home.js
    3.1: export to project: /flux/stories/index.js
4. export route:      /routes.jsx
5. create messages(all file): /data/en.js, /data/fr.js


## Manual Modules:
# server and client:
- lodash
- axios
- supperagent
- jsdom             : jsdom is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML Standards, for use with Node.js
- image-downloader  : downloading image to disk from a given URL
- base64-img        : Convert img to base64, or convert base64 to img
- json2xls          : utility to convert json to a excel file
- API http://translatr.varunmalhotra.xyz    : translate multi languages
# Only server:
- write             : Write data to a file, replacing the file if it already exists and creating any intermediate directories if they don't already exist
- log-to-file       : Log text to file (with timestamp).
# Only client:
- react-color       : 13 Different Pickers - Sketch, Photoshop, Chrome and many more
- videojs.com       : Video.js is a web video player built from the ground up for an HTML5 world.
- scriptjs          : Async JavaScript loader & dependency manager

## Mail Server:
- https://nodemailer.com/extras/smtp-server/

