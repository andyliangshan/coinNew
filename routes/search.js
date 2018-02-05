/**
 * Created by andy on 18/1/29.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    try {
        res.render('search', {
            title: '币格交易助手'
        });
    } catch (err) {
        next(err);
    }

});

module.exports = router;