var   express = require('express');
var   router  = express.Router();
const axios   = require('axios').default;
const fs      = require('fs');
const base64  = require('base-64');


router.get('/', function(req, res, next) {
  res.render('payment_result', {req, data:{}});
});   

module.exports = router;
