var express = require('express');
const fs = require('fs');
var router = express.Router();

let config = fs.readFileSync('./conf/config.json', 'utf-8');
let error = { status: 'error' };
let configjson;
let defaultEnv;

if (config) {
  configjson = JSON.parse(config);
  defaultEnv = configjson.default_env;
  delete configjson['default_env'];
} else {
  reject(error);
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { defaultEnv, configjson });
});

module.exports = router;
