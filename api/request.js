var request = require('superagent');
var config = require('./config');

var omitDeep = function(obj, key, depth) {
    for (var k in obj) {
        if (k == key) {
            delete obj[k];
        } else if (typeof(obj[k]) == 'object' && depth > 1) {
            omitDeep(obj[k], key, depth - 1);
        }
    }
};

const generateError = (err) => {
  return Object.assign(err.response ? err.response.body : {code: err.code}, err.response ? err.response.error : {status: 501, message: 'timeout'}, {raw: err});
};

const timeout = 120 * 1000;

const getMethod = {
  //  isUseConfigApiRoot： 是否使用apiroot 进行地址拼接
  get: (path, query, isUseConfigApiRoot) => new Promise((resolve, reject) => {
    const req = request
        .get(isUseConfigApiRoot ? path : config.apiRoot + path)
        .timeout(timeout)
        .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  put: (path, data, query) => new Promise((resolve, reject) => {
    const req = request.put(config.apiRoot + path)
        .timeout(timeout)
        .accept('application/json')
        .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  post: (path, data, query, isUseConfigApiRoot) => new Promise((resolve, reject) => {
    const req = request
        .post(isUseConfigApiRoot ? path : config.apiRoot + path)
        .timeout(timeout)
        .accept('application/json')
        .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  del: (path, query) => new Promise((resolve, reject) => {
    const req = request.del(config.apiRoot + path)
        .timeout(timeout)
        .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),
};
module.exports = getMethod;