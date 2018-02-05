var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('detail', {
      title: '币格交易助手'
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
