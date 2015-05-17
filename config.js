/*
  Control the site's config
 */

// Load .env if found
var fs = require('fs');
if (fs.existsSync('.env')) {
  require('dotenv').load();
}

// Load in VCAP SERVICES
var vcapServices = {
  cloudantNoSQLDB: [],
  twilio: {}
};
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  // 3rd Party
  if (vcapServices.user-provided) {
    for (i = 0; i < vcapServices.user-provided.length; i++) {
      // Twilio
      if (vcapServices.user-provided[i].credential.url == 'https://api.twilio.com') {
        vcapServices.twilio = vcapServices.user-provided[i].credential;
      }
    }
  }
}

var config = {};

// Cloudant
config.cloudant = {
  account: (vcapServices.cloudantNoSQLDB[0])? vcapServices.cloudantNoSQLDB[0].credentials.username : process.env.CLOUDANT_USERNAME,
  password: (vcapServices.cloudantNoSQLDB[0])? vcapServices.cloudantNoSQLDB[0].credentials.password : process.env.CLOUDANT_PASSWORD
}

// Twilio
config.twilio = {
  sid: vcapServices.twilio.accountSID || process.env.TWILIO_SID,
  token: vcapServices.twilio.authToken || process.env.TWILIO_TOKEN
}

console.log(config);

exports = config;
