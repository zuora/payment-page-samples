# Zuora Payment Page 2.0 Integration Sample

Zuora Payment Pages Example is nodejs-express project which demonstrates how to integrate with Zuora Payment Pages 2.0 in customer's e-commerce web site and is compliant with PCI-DSS

For more information on Zuora Payment Page 2.0, please refer to the [Payment Pages 2.0](https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/B_Security_Measures_for_Payment_Pages_2.0) on Zuora Knowledge Center. Zuora also strongly reccommend adopting the [Security Measures for Payment Pages 2.0](https://knowledgecenter.zuora.com/Billing/Billing_and_Payments/LA_Hosted_Payment_Pages/B_Payment_Pages_2.0/B_Security_Measures_for_Payment_Pages_2.0) which is built-in 


## Requirements

Node 16 or higher

## Installation

Install the package with:

```sh
npm install 
```

## Running this sample
1. Clone this project

2. Modify the Hosted Page configurations (Hosted Domain and Callback Path) in Zuora (`Payments` -> `Setup Hosted Page`)

* Hosted Domain: set to the hosted domain for example: in this sample, it is listening|http://localhost:3000
* Callback Path: set to /payment_page/callback 

3. Execute the shell command:

```sh
npm start
```
	
4. In browser access the project's URL, for example: http://localhost:3000

