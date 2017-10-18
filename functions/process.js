const _ = require('lodash');
const redis = require('./redis');

const MENSAJE_INICIAL = "mensaje_inicial";
const EMPEZAR_DE_NUEVO_PAYLOAD = "EMPEZAR_DE_NUEVO_PAYLOAD";
const EMPEZAR_PAYLOAD = "EMPEZAR";
const EMPEZAR_ARMO_MI_VIAJE_PAYLOAD = "EMPEZAR_ARMO_MI_VIAJE_PAYLOAD";
const EMPEZAR_SORPRENDEME_PAYLOAD = "EMPEZAR_SORPRENDEME_PAYLOAD";
const ARMO_MI_VIAJE_PAYLOAD = "ARMO_MI_VIAJE_PAYLOAD";
const ARMO_MI_VIAJE_VUELOS_PAYLOAD = "ARMO_MI_VIAJE_VUELOS_PAYLOAD";
const ARMO_MI_VIAJE_HOTELES_PAYLOAD = "ARMO_MI_VIAJE_HOTELES_PAYLOAD";

exports.processText = function(event, responseWit, menssageOrigin) {
  var messageText = "No se reconoce el texto ingresado. Reintente por favor";

  if(!_.isEmpty(responseWit.entities)) {

    console.log("Respuesta wit: " + JSON.stringify(responseWit));
    // Tipo fecha
    if(responseWit.entities.datetime) {
      responseWit.entities.datetime.forEach(function(datetime) {
        var confidence = datetime.confidence;
        var value = datetime.value;

        messageText = confidence + " " + value;
      });
    }
    /*// Texto sin intent especial
    else if(responseWit.entities.intent) {
      responseWit.entities.intent.forEach(function(intent) {
        var confidence = intent.confidence;
        var value = intent.value;

        if(confidence > 0.7) {
          // Podriamos trabajar flujos sobre diferentes intent, en este caso
          // si viene un intent directamente vuelvo al saludo inicial
          //if(value == MENSAJE_INICIAL)
          return initMessage(event.sender.id);
        }
      });
    }*/
  } else {
    messageText = menssageOrigin;
  }
  return sendTextMessage(event.sender.id, messageText);
}

exports.processPostBack = function(event) {
  let message = "No se reconoce processPostBack";

  switch (event.postback.payload) {
    case EMPEZAR_DE_NUEVO_PAYLOAD:
    case EMPEZAR_PAYLOAD:
      return initMessage(event.sender.id);

    case ARMO_MI_VIAJE_PAYLOAD:
      return armoMiViajeMessage(event.sender.id);
  }
  return sendTextMessage(event.sender.id, message);
}

exports.processQuickReply = function(event) {
  let message = "No se reconoce processQuickReply";

  switch (event.message.quick_reply.payload) {
    case EMPEZAR_SORPRENDEME_PAYLOAD:
      message = "¿Desde qué ciudad salis?";
      break;

    case ARMO_MI_VIAJE_VUELOS_PAYLOAD:
      message = "¿Desde qué ciudad salis?";
      break;

    case ARMO_MI_VIAJE_HOTELES_PAYLOAD:
      message = "¿En qué ciudad te vas a hospedar?";
      break;

    case EMPEZAR_ARMO_MI_VIAJE_PAYLOAD:
      return armoMiViajeMessage(event.sender.id);
  }
  return sendTextMessage(event.sender.id, message);
}

function initMessage(recipientId) {
  let mensajeInicial = {
  "recipient":{
      "id":recipientId
    },
    "message":{
      "text": "Hola 🙂 Soy Kevin Bot, el asistente virtual de viajes de Almundo. ¿Querés que te sorprenda o armás tu viaje?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Armo mi viaje",
          "payload":"EMPEZAR_ARMO_MI_VIAJE_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Sorprendeme",
          "payload":"EMPEZAR_SORPRENDEME_PAYLOAD"
        }
      ]
    }
  };
  return mensajeInicial;
}

function armoMiViajeMessage(recipientId) {
  let mensaje = {
  "recipient":{
      "id":recipientId
    },
    "message":{
      "text": "¿Qué deséas buscar?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Vuelos",
          "payload":"ARMO_MI_VIAJE_VUELOS_PAYLOAD"
        },
        {
          "content_type":"location"
        },
        {
          "content_type":"text",
          "title":"Hoteles",
          "payload":"ARMO_MI_VIAJE_HOTELES_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

function ciudadIndicadaMessage(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿A cuál de estos lugares te referís? Si no es ninguno de estos, verificá el nombre de la ciudad y volvé a enviarlo.",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Cordoba, Cordoba",
          "payload":"PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Marcos Juares, Cordoba",
          "payload":"PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Leones, Cordoba",
          "payload":"PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Villa Maria, Cordoba",
          "payload":"PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"BellVille, Cordoba",
          "payload":"PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Carlos Paz, Cordoba",
          "payload":"PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

function sendTextMessage (recipientId, messageText) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  return messageData;
}
