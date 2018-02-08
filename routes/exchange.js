var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('../api/request');

const urls = {
  caseApi: 'http://39.106.148.255/wechat/often/data/bourse/?',
  selApi: 'http://39.106.148.255/wechat/often/data/trade/?',
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let tradeName;
    if (req.query.tradeName) {
      tradeName = req.query.tradeName;
    } else {
      tradeName = 'OKEX';
    }
    const coinType = await request.get(urls.caseApi, { currentPageForApp: 1, showCount: 10 }, true);
    const resetSubNav = function (str = 'OKEX') {
      let activeObj;
      const res = coinType.pagedata.filter(item => {
        if (item.bourse_name !== str) {
          return true;
        } else {
          activeObj = item;
          return false;
        }
      });
      res.unshift(activeObj);
      return res;
    };
    const coinNewType = resetSubNav(str = tradeName);
    const selData = await request.get(urls.selApi, { currentPageForApp: 1, showCount: 10, bourseName: tradeName, orderField: 'jg_usd', orderType: 'ASC' }, true);
    res.render('exchange', {
      title: '币格交易助手',
      selData,
      tradeName,
      coinNewType,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
