/* eslint arrow-body-style:0 */

import request from 'superagent';
import querystring from 'querystring';

const HttpClient = {

  cookie: '',

  get: (url, query) => new Promise((resolve, reject) => {
    const preTime = Date.now();
    console.log(url);
    console.log(query);
    const req = request
      .get(url)
      .timeout(config.apiTimeout)
      .set('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT')
      .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      logger.info('request-get-url: ' + url + '?' + querystring.encode(query) + '****' + (Date.now() - preTime) + 'ms');
      if (err) {
        logger.error('request-get-url-error: ' + err + ' ,status: ' + err.status + ' ,url:' + url + '****' + (Date.now() - preTime) + 'ms');
        if (err.status === 404) {
          resolve(null);
        } else {
          reject(err);
        }
      } else {
        resolve(res.body || res);
      }
    });
  }),

  put: (url, data, query) => new Promise((resolve, reject) => {
    const req = request.put(url)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body || res);
      }
    });
  }),

  post: (url, data, query) => new Promise((resolve, reject) => {
    const preTime = Date.now();
    const req = request.post(url)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      logger.info('request-get-url: ' + url + '****' + (Date.now() - preTime) + 'ms');
      if (err) {
        logger.error('request-get-url-error: ' + err + ' ,status: ' + err.status + ' ,url:' + url + '****' + (Date.now() - preTime) + 'ms');
        reject(err);
      } else {
        resolve(res.body || res);
      }
    });
  }),

  del: (url, query) => new Promise((resolve, reject) => {
    const req = request.del(url)
      .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body || res);
      }
    });
  }),

};

export default HttpClient;
