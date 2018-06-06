import request from 'superagent';

export function post(url, params, callBack) {
  request
    .post(url)
    .send(params)
    .set('Content-Type', 'application/json')
    .end((err, res) => {
      callBack(err, res)
    });
}

export function getImage(url, callBack) {
  request
    .get(url)
    .end((err, res) => {
      callBack(err, res)
    });
}

export function sendMail(callBack) {
  console.log('send mail api')
  request
    .post('/api/mail/send')
    .end((err, res) => {
      callBack(err, res)
    });
}
