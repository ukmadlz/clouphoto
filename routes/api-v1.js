var express  = require('express');
var router   = express.Router();
var config   = require('../config');
var cloudant = require('cloudant')(config.cloudant);
var db       = cloudant.use('clouphoto');
var fs       = require('fs');
var request  = require('request');

/* POST save message. */
router.post('/message', function(req, res, next) {
  db.insert(req.body, function(err, body) {
    console.log(req.body);
    request.get(req.body.MediaUrl0, function(error, response, data) {
      if (!error && response.statusCode == 200) {
        // Continue with your processing here.
        var fileExtension =  req.body.MediaContentType0.split('/')[1];
        var fileName = body.id + '.' + fileExtension;
        db.attachment.insert(body.id, fileName, data, req.body.MediaContentType0,
          { rev: body.rev }, function(err, body) {
            if (!err)
              console.log(body)
            else
              console.log('ERROR', err);
          });
      }
    });

  });

  res.json({error:'0'})
});

module.exports = router;
