'use strict';

const express = require('express');
const firebase = require('firebase');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const crypto = require('crypto');
const {Wit, log} = require('node-wit');
const process = require('./process');

// Wit.ai parameters
const WIT_TOKEN = "MFZICCEHCMS2DXKNQMLZFN4XDMAIP4GF";

//Messenger API parameters
const FB_PAGE_TOKEN = "EAACkkvctpEwBABa80xLN7MSdnU7JzuoBAAg5chUiIcEIE8Gq1v4OboHKCRcZBQ4q2MOAGofrKP53N0PnOC3zduyzI5nP9mJ1nf33usfA9ELtuYwfvGVqIoUrbKpptxsZCkkdLvS5adF58G0FrWrZATLBEDUe3IwFc8z5ZAfoDgZDZD";
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

// Setting up our bot
const clientWit = new Wit({accessToken: WIT_TOKEN});

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
          receivedPostback(event);
        } else if (event.message && event.message.quick_reply) {
          receivedQuickReply(event);
        }
        else if (event.message && event.message.text) {
          receivedMessage(event);
        }
        else if (event.message.attachments) {
          callSendAPI(sendTextMessage(event.sender.id, "Por el momento no podemos procesar mensages con archivos adjuntos."));
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

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;

  console.log("receivedMessage: " + JSON.stringify(event));

  if (message.text) {
    clientWit.message(message.text, {})
    .then((responseWit) => {
      callSendAPI(process.processText(event, responseWit, message.text));
    })
    .catch(console.error);
  }
}

function receivedPostback(event) {
  console.log("receivedPostback: " + JSON.stringify(event));

  var responseProcess = process.processPostBack(event);
  callSendAPI(responseProcess);
}

function receivedQuickReply(event) {
  console.log("receivedQuickReply: " + JSON.stringify(event));

  var responseProcess = process.processQuickReply(event);
  callSendAPI(responseProcess);
}

function callSendAPI(messageData) {
  console.log("Mensaje a enviar: " + JSON.stringify(messageData));

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

function sendTextMessage (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  return messageData;
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

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
