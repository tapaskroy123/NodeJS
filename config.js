/*
*
* Create and export configuration variable
*/

//environment object

var environments ={};

//Staging {default} environment
environments.staging ={
    'httpPort': 3000,
    'httpsPort':3001,
    'envName':'staging'

};

//Production environment
environments.production = {
'httpPort': 5000,
'httpsPort':5001,
'envName' : 'production'

};

//Determine which environment is passed as a command line argument

var currentEnv = typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV:'';

//Make sure the environment is one from the above or default to staging environment
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv]: environments.staging;

module.exports = environmentToExport;

