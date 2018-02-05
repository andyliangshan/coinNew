var path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    debug: true,
    canRegister: true,
    root: rootPath,
    app: {
      name: 'vShow',
    },
    port: 8000,
    sessionSecret: 'vShow-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    apiRoot: 'http://api.vshowdome.com/project/',

    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.vshow.com',
    qiniu: {
      ACCESS_KEY: 'qgdHNv_xV0rZgs3ZTTVFc4AQEQxsLoGcSDi2ov7X',
      SECRET_KEY: 'd_spzzJzPcGJPWfD8UDTzW-A8DtCe2VPzB9t_pZ7',
      bucket: 'awscrp',
      host: 'https://o4j9nyfdf.qnssl.com',
      prefix: 'crpacc/',
    },
  },

  production: {
    debug: false,
    canRegister: true,
    root: rootPath,
    app: {
      name: 'vShow',
    },
    port: 8002,
    sessionSecret: 'vShow-prod',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    apiRoot: 'http://api.vshowdome.com/project/',
    apps: { // 授权app
      crp: {
        allowEmail: false,
        r: '',
      },
    },
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.vshow.com',
    qiniu: {
      ACCESS_KEY: 'qgdHNv_xV0rZgs3ZTTVFc4AQEQxsLoGcSDi2ov7X',
      SECRET_KEY: 'd_spzzJzPcGJPWfD8UDTzW-A8DtCe2VPzB9t_pZ7',
      bucket: 'awscrp',
      host: 'https://o4j9nyfdf.qnssl.com',
      prefix: 'crpacc/',
    },
  },
};

module.exports = config[env];
// export default config[env];
