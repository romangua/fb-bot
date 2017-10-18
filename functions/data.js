const firebase = require('firebase');

exports.createUser = function(recipient) {
  firebase.database().ref('/fb-bot/').child(recipient);
}

exports.setFrom = function(recipient, fromID) {
  firebase.database().ref('/fb-bot/').child(recipient).set({ from: fromID });
}

exports.setTo = function(recipient, toID) {
  firebase.database().ref('/fb-bot/').child(recipient).set({ to: toID });
}

exports.setDate = function(recipient, date) {
  firebase.database().ref('/fb-bot/').child(recipient).set({ date: date });
}
