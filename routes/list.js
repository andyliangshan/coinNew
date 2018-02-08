var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('../api/request');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    res.render('list', {
      title: '币格交易助手',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
