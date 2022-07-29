# Zuora Payment Page 2.0 Integration Sample

Zuora Payment Pages Example is nodejs-express project which demonstrates how to integrate with Zuora Payment Pages 2.0 in customer's web site and in a way compliant with PCI-DSS. This project demonstrates multipe flows that can be integrated based on your requirements.

For more information on Zuora Payment Page 2.0, please refer to the [Payment Pages 2.0](https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/B_Security_Measures_for_Payment_Pages_2.0) on Zuora Knowledge Center. Zuora also strongly reccommends adopting the [Security Measures for Payment Pages 2.0](https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/B_Security_Measures_for_Payment_Pages_2.0) which is built-in.


## Requirements

Node 16 or higher

## Installation

Install the package with:

```sh
npm install 
```

## Running this sample
1. Clone this project

2. Create/Modify the Hosted Page with configurations (Hosted Domain and Callback Path) in Zuora (`Settings` -> `Payments` -> `Setup Hosted Page`)

* Hosted Domain: set to the hosted domain for example: in this sample, it is listening|http://localhost:3000
* Callback Path: set to /payment_page/callback 

3. Modify the file payment-page-samples/conf/config.json to set HPM configurations. Here are the descriptions of the properties in it:

Authorization: This sample page provides two types of authorization namely Basic Auth and OAuth2 to interact with Zuora. Either of these two can be used to run this sample code with preference given to OAuth Token.

* username : Zuora account username.
* password : Zuora account password.
* oauth_token : OAuth Token generated using API: /oauth/token (https://www.zuora.com/developer/api-reference/#operation/createToken)
* rsa_signature : Zuora's RSA Signature path which is fixed at /v1/rsa-signatures
* zuora_base_url : Zuora's RSA Signature API end point host url: For the production environment: https://www.zuora.com, For the API Sandbox environment: https://apisandbox.zuora.com
* payment_page_url : Zuora's Hosted Page URL, For the Production Environment: https://www.zuora.com/apps/PublicHostedPageLite.do , For the API Sandbox Environment: https://apisandbox.zuora.com/apps/PublicHostedPageLite.do
* pageId: Page Id of the Hosted Page, it can be retrieved in Zuora application through the following path: ((`Settings` -> `Payments` -> `Setup Hosted Page` -> `Page List` -> `Show Page Id`).
* accountId (Optional): The ID of the customer account present at Zuora's side. Whenever we perform any transaction using this sample code, we can associate it with account Id using this field.
* publicKey : Public key, it can be retrieved in Zuora application through the following path: (`Settings` -> `Payments` -> `Setup Hosted Page` -> `Security Keys` -> `Get HPM2.0 Key`).

```sh
    "us_sandbox":{
        "username" : "abd",
        "password" : "*****",
        "oauth_token" : "a8bc1f351e6e43f68fd5e7eb76fcab23",
        "rsa_signature": "/v1/rsa-signatures",
        "zuora_base_url": "https://rest.apisandbox.zuora.com",
        "payment_page_url": "https://apisandbox.zuora.com/apps/PublicHostedPageLite.do",
        "pageId": "8ad0877b82126d1c018214b14ff515e1",
        "accountId":"40289da98233ea23018233f79044000f",
        "publicKey": "*****"
    }
```

4. Modify the file payment-page-samples/conf/prepopulate.json to set the values for pre-populating fields in HPM page.

5. Execute the shell command:

```sh
npm start
```
	
6. In browser access the project's URL, for example: http://localhost:3000

