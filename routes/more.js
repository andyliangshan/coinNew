var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  try {
    res.render('more', {
      title: '币格交易助手'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/form', function(req, res, next) {
  try {
    res.render('moreFrom', {
      title: '币格交易助手'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
