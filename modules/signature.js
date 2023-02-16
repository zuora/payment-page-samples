const axios = require('axios').default;
const fs = require('fs');
const base64 = require('base-64');

exports.syncGetToken = new Promise((resolve, reject) => {
  let config = fs.readFileSync('./conf/config.json', 'utf-8');
  let error = { status: 'error' };

  if (config) {
    let configjson = JSON.parse(config);
    let zuora_base_url = configjson.zuora_base_url;
    let zuora_rsa_signature = configjson.rsa_signature;
    let zuora_payment_page_url = configjson.payment_page_url;
    let username = configjson.username;
    let password = configjson.password;
    let pageId = configjson.pageId;
    let zuora_signature_full_url =
      zuora_base_url + zuora_rsa_signature;
    let basicauth = base64.encode(username + ':' + password);
    let basicauth_base64 = 'Basic ' + basicauth;

    axios
      .post(
        zuora_signature_full_url,
        {
          pageId: pageId,
          uri: zuora_payment_page_url,
          currency: 'USD',
          method: 'POST',
        },
        {
          headers: {
            Authorization: basicauth_base64,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  } else {
    reject(result);
  }
});

exports.generateTokenSignature = function (callback) {
  let config = fs.readFileSync('./conf/config.json', 'utf-8');
  let result = { status: 'error' };
  if (config) {
    let configjson = JSON.parse(config);
    let zuora_base_url = configjson.zuora_base_url;
    let zuora_rsa_signature = configjson.rsa_signature;
    let zuora_payment_page_url = configjson.payment_page_url;
    let username = configjson.username;
    let password = configjson.password;
    let pageId = configjson.pageId;
    let zuora_signature_full_url =
      zuora_base_url + zuora_rsa_signature;
    let basicauth = base64.encode(username + ':' + password);
    let basicauth_base64 = 'Basic ' + basicauth;

    axios
      .post(
        zuora_signature_full_url,
        {
          pageId: pageId,
          uri: zuora_payment_page_url,
          currency: 'USD',
          method: 'POST',
        },
        {
          headers: {
            Authorization: basicauth_base64,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        callback(response.data);
      })
      .catch(function (error) {
        callback(error);
      });
  }
};
