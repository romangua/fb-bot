const firebase = require('firebase');

exports.initUser = function(recipient) {
  firebase.database().ref('users/' + recipient).set({
      type: "null",
      typeSearch: "null",
      from: "null",
      to: "null",
      dateFrom: "null",
      dateBack: "null",
      persons: "null",
      wichPersons: "null",
      days: "null",
      typeTravel: "null",
      budget: "null"
   });
}

exports.get = function(recipient) {
  return firebase.database().ref('users/' + recipient);
}

// type: EMPEZAR_ARMO_MI_VIAJE_PAYLOAD, EMPEZAR_SORPRENDEME_PAYLOAD
exports.setType = function(recipient, type) {
  firebase.database().ref('users/' + recipient).update({ type: type });
}

// typeSearch: ARMO_MI_VIAJE_VUELOS_PAYLOAD, ARMO_MI_VIAJE_HOTELES_PAYLOAD
exports.setTypeSearch = function(recipient, typeSearch) {
  firebase.database().ref('users/' + recipient).update({ typeSearch: typeSearch });
}

// hace referencia a la ciudad de origen
exports.setFrom = function(recipient, from) {
  firebase.database().ref('users/' + recipient).update({ from: from });
}

// hace referencia a la ciudad de destino
exports.setTo = function(recipient, to) {
  firebase.database().ref('users/' + recipient).update({ to: to });
}

exports.setDateFrom = function(recipient, dateFrom) {
  firebase.database().ref('users/' + recipient).update({ dateFrom: dateFrom });
}

exports.setDateBack = function(recipient, dateBack) {
  firebase.database().ref('users/' + recipient).update({ dateBack: dateBack });
}

exports.setDays = function(recipient, days) {
  firebase.database().ref('users/' + recipient).update({ days: days });
}

// persons: UN_ADULTO_PERSONS_PAYLOAD
//          DOS_ADULTOS_PERSONS_PAYLOAD
//          DOS_ADULTOS_UN_NIÑO_PERSONS_PAYLOAD
//          DOS_ADULTOS_DOS_NIÑOS_PERSONS_PAYLOAD
//          DOS_ADULTOS_UN_BEBE_PERSONS_PAYLOAD
//          OTROS_PERSONS_PAYLOAD
exports.setPersons = function(recipient, persons) {
  firebase.database().ref('users/' + recipient).update({ persons: persons });
}

// wichPersons: EN_FAMILIA_WICH_PERSONS_PAYLOAD
//          EN_PAREJA_WICH_PERSONS_PAYLOAD
//          CON_AMIGOS_WICH_PERSONS_PAYLOAD
//          SOLO_WICH_PERSONS_PAYLOAD
exports.setWichPersons = function(recipient, wichPersons) {
  firebase.database().ref('users/' + recipient).update({ wichPersons: wichPersons });
}

// typeTravel: PLAYA_TYPE_TRAVEL_PAYLOAD
//          AVENTURA_TYPE_TRAVEL_PAYLOAD
//          COMPRAS_TYPE_TRAVEL_PAYLOAD
//          RELAX_TYPE_TRAVEL_PAYLOAD
//          CULTURA_TYPE_TRAVEL_PAYLOAD
//          GASTRONOMIA_TYPE_TRAVEL_PAYLOAD
//          ALL_INCLUSIVE_TYPE_TRAVEL_PAYLOAD
//          NIEVE_TYPE_TRAVEL_PAYLOAD
//          ECONOMICO_TYPE_TRAVEL_PAYLOAD
//          DE_LUJO_TYPE_TRAVEL_PAYLOAD
exports.setTypeTravel = function(recipient, typeTravel) {
  firebase.database().ref('users/' + recipient).update({ typeTravel: typeTravel });
}

// budget: OMITIR_BUDGET_PAYLOAD
exports.setBudget = function(recipient, budget) {
  firebase.database().ref('users/' + recipient).update({ budget: budget });
}
