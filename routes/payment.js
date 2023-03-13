var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const fs = require('fs');
var crypto = require('crypto');
const base64 = require('base-64');

const getToken = (reqBody) => {
  return new Promise((resolve, reject) => {
    let config = fs.readFileSync('./conf/config.json', 'utf-8');
    let error = { status: 'error' };
    let defaultEnv = reqBody.env;
    let request = {};
    let authorizationHeader;
    const pageId = reqBody.pageid;
    const accountId = reqBody.accountid;
    const currency = reqBody.currency;
    // Fields for on session payments
    const integrationType = reqBody.integrationtype;
    const pmamount = reqBody.pmamount;

    if (config) {
      let configjson = JSON.parse(config);
      if (typeof defaultEnv === 'undefined') {
        defaultEnv = configjson.default_env;
      }
      if (typeof authorizationType === 'undefined') {
        authorizationType = 'basic';
      }
      // if (integrationType === "onSessionPayment" && invoiceIds){
      //   invoices = invoiceIds.split(",");
      // }
      let zuora_base_url = configjson[defaultEnv].zuora_base_url;
      let zuora_rsa_signature = configjson[defaultEnv].rsa_signature;
      let zuora_payment_page_url =
        configjson[defaultEnv].payment_page_url;
      let zuora_signature_full_url =
        zuora_base_url + zuora_rsa_signature;
      let oAuthToken = configjson[defaultEnv].oauth_token;

      if (oAuthToken === '') {
        username = configjson[defaultEnv].username;
        password = configjson[defaultEnv].password;
        authorizationHeader =
          'Basic ' + base64.encode(username + ':' + password);
      } else {
        authorizationHeader = 'Bearer ' + oAuthToken;
      }
      if (integrationType === 'onSessionPayment') {
        request = {
          ...(!reqBody.invoiceIds && {
            authorizationAmount: pmamount,
          }),
          pageId: pageId,
          uri: zuora_payment_page_url,
          // On session specifc parameters to be passed to support server side validation https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/J_Implement_Payment_Pages_2.0_to_support_one-time_payment_flows
          accountId: accountId,
          currency: currency,
          method: 'POST',
        };
      } else {
        request = {
          pageId: pageId,
          uri: zuora_payment_page_url,
          accountId: accountId,
          // Please note that optional parameters are to be passed as and when needed. We also need to make sure that the same are passed in loadPaymentPages() when "Validate Client-Side HPM Parameters" has been enabled.
          // locale: "fr",
          authorizationAmount: pmamount,
          method: 'POST',
        };
      }

      axios
        .post(zuora_signature_full_url, request, {
          headers: {
            Authorization: authorizationHeader,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          response.data.pageId = pageId;
          response.data.url = zuora_payment_page_url;
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    } else {
      reject(error);
    }
  });
};

router.post('/', function (req, res, next) {
  const prepopulate = fs.readFileSync(
    './conf/prepopulate.json',
    'utf-8'
  );
  let config = fs.readFileSync('./conf/config.json', 'utf-8');
  let prepopulatejson = JSON.parse(prepopulate);
  let configjson = JSON.parse(config);
  var env = req.body.env;
  var prepopulateFields = preparePrePopulatefields(
    prepopulatejson,
    configjson[env]
  );
  getToken(req.body)
    .then(function (data) {
      console.log(JSON.stringify(data, ' '));
      if (
          req.body.pagetype === 'inside' ||
          req.body.pagetype === 'overlay'
      ) {
        res.render('payment_page_inside', {
          resultcode: 'success',
          resultdata: data,
          prePopulateData: prepopulateFields,
          req: req.body,
        });
      } else {
        res.render('payment_page_outside', {
          resultcode: 'success',
          resultdata: data,
          prePopulateData: prepopulateFields,
          req: req.body,
        });
      }
    })
    .catch(function (error) {
      if (
        req.body.pageType === 'inside' ||
        req.body.pageType === 'overlay'
      ) {
        res.render('error', { message: 'failed', error });
      } else {
        res.render('error', { message: 'failed', error });
      }
    });
});

// This is used for parsing callback from button outside
router.get('/callback', function (req, res, next) {
  if (req.query.success !== 'true') {
    let reqBody = {};
    if (req.query.field_passthrough2 === 'doPaymentTrue') {
      reqBody = {
        pageid: req.query.field_passthrough1,
        accountid: req.query.field_passthrough3,
        pmamount: req.query.field_passthrough4,
        authorizationtype: req.query.field_passthrough6,
        env: req.query.field_passthrough7,
        invoiceIds: req.query.field_passthrough8,
        currency: req.query.field_passthrough9,
        integrationtype: 'onSessionPayment',
      };
    } else {
      reqBody = {
        pageid: req.query.field_passthrough1,
        authorizationtype: req.query.field_passthrough6,
        env: req.query.field_passthrough7,
        // We can go on to add additional values for signature creation
      };
    }
    getToken(reqBody)
      .then(function (data) {
        res.render('payment_result', { req, data });
      })
      .catch(function (error) {
        res.render('error', { message: 'failed', error });
      });
  } else {
    res.render('payment_result', { req, data: {} });
  }
});

function preparePrePopulatefields(prepopulatedata, configjson) {
  const fieldToEncrypt = new Set();
  var prepopulateFields = {};
  fieldToEncrypt.add('creditCardNumber');
  fieldToEncrypt.add('cardSecurityCode');
  fieldToEncrypt.add('creditCardExpirationYear');
  fieldToEncrypt.add('creditCardExpirationMonth');
  fieldToEncrypt.add('bankAccountNumber');
  fieldToEncrypt.add('bankAccountName');

  var publicKey = configjson.publicKey;

  const fullPublicKey = '-----BEGIN PUBLIC KEY-----\n'
    .concat(publicKey)
    .concat('\n-----END PUBLIC KEY-----');
  const publickKeyObject = crypto.createPublicKey(fullPublicKey);
  publickKeyObject.export({ format: 'pem', type: 'pkcs1' });
  const mainkeys = Object.keys(prepopulatedata);
  var subkeys = [];
  var keyValue = {};
  for (let i = 0; i < mainkeys.length; i++) {
    subkeys = Object.keys(prepopulatedata[mainkeys[i]]);
    keyValue = prepopulatedata[mainkeys[i]];
    for (let j = 0; j < subkeys.length; j++) {
      const key = subkeys[j];
      var buffer = keyValue[key];
      if (fieldToEncrypt.has(key)) {
        var encrypted = crypto
          .publicEncrypt(
            {
              key: publickKeyObject,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(buffer)
          )
          .toString('base64');
        prepopulateFields[key] = encrypted;
      } else {
        prepopulateFields[key] = keyValue[key];
      }
    }
  }
  return prepopulateFields;
}

module.exports = router;
