var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('../api/request');

const urls = {
  caseApi: 'http://39.106.148.255/wechat/often/data/list/?',
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const coinData = await request.get(urls.caseApi, { currentPageForApp: 1, showCount: 10, orderField: 'ltsz_usd', orderType: 'ASC' }, true);
    res.render('list', {
      title: '币格交易助手',
      coinData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
