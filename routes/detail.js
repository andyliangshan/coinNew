var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('../api/request');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    var name = req.query.tradeName;
    var singleDetailData = await request.get('http://39.106.148.255/wechat/often/data/detail', { name: name }, true) || '';
    res.render('detail', {
      title: '币格交易助手',
      singleDetailData
    });
  } catch (err) {
    next(err);
  }
});

router.get('/detailSecond', function(req, res, next) {
  try {
    res.render('detailSecond', {
      title: '币格交易助手'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
