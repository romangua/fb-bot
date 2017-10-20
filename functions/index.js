'use strict';

const express = require('express');
const firebase = require('firebase');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const crypto = require('crypto');
const process = require('./process');

//Messenger API parameters
const FB_APP_SECRET = "002a1bc533d92ffa4ff370b16ce00b8e";
let FB_VERIFY_TOKEN = null;
crypto.randomBytes(8, (err, buff) => {
  if (err) throw err;
  FB_VERIFY_TOKEN = buff.toString('hex');
});

//Firebase parameters
var config = {
    apiKey: "AIzaSyCAgdg4LNIIhe_9o8XnGagKSsCkIW2yI_w",
    authDomain: "facebook-bot-a6f58.firebaseapp.com",
    databaseURL: "https://facebook-bot-a6f58.firebaseio.com",
    projectId: "facebook-bot-a6f58",
    storageBucket: "facebook-bot-a6f58.appspot.com",
    messagingSenderId: "579671298783"
};
firebase.initializeApp(config);

// Starting our webserver
const app = express();
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));

// ----------------------------------------------------------------------------
// Messenger API specific code
// ----------------------------------------------------------------------------
app.post('/webhook', function (req, res) {
  var data = req.body;

  console.log("/webhook: ", JSON.stringify(data));

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      entry.messaging.forEach(function(event) {
        if (event.postback) {
          process.processPostBack(event);
        } else if (event.message && event.message.quick_reply) {
          process.processQuickReply(event);
        }
        else if (event.message && event.message.text) {
          process.processText(event);
        }
        else if (event.message.attachments) {
          process.processAtachments();
        }
        else {
          console.log("Webhook received unknown event: ", JSON.stringify(entry));
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

// Webhook setup
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

exports.app = functions.https.onRequest(app);
