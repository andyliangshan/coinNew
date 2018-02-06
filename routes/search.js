/**
 * Created by andy on 18/1/29.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('../api/request');

router.get('/', function (req, res, next) {
    try {
        res.render('searchFrom', {
            title: '币格交易助手'
        });
    } catch (err) {
        next(err);
    }
});

router.get('/result', async function (req, res, next) {
    try {
        var url = req.url;
        var tradeNameVal = url.split('?')[1];
        var searchDetailData = await request.get('http://39.106.148.255/wechat/often/data/searchtradedatas',
            { currentPageForApp: 1, showCount: 10, orderField: 'jg_usd', orderType: 'ASC', tradeName: tradeNameVal }, true);
        res.render('search', {
            title: '币格交易助手',
            searchDetailData,
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;