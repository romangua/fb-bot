const _ = require('lodash');
const request = require('request');
const {Wit} = require('node-wit');
const dataProcess = require('./data');
const generateMessage = require('./message');

//Messenger API parameters
const FB_PAGE_TOKEN = "EAACkkvctpEwBABa80xLN7MSdnU7JzuoBAAg5chUiIcEIE8Gq1v4OboHKCRcZBQ4q2MOAGofrKP53N0PnOC3zduyzI5nP9mJ1nf33usfA9ELtuYwfvGVqIoUrbKpptxsZCkkdLvS5adF58G0FrWrZATLBEDUe3IwFc8z5ZAfoDgZDZD";

// Wit.ai parameters
const WIT_TOKEN = "MFZICCEHCMS2DXKNQMLZFN4XDMAIP4GF";
const clientWit = new Wit({accessToken: WIT_TOKEN});

const MENSAJE_INICIAL = "mensaje_inicial";
const EMPEZAR_DE_NUEVO_PAYLOAD = "EMPEZAR_DE_NUEVO_PAYLOAD";
const EMPEZAR_PAYLOAD = "EMPEZAR";
const EMPEZAR_ARMO_MI_VIAJE_PAYLOAD = "EMPEZAR_ARMO_MI_VIAJE_PAYLOAD";
const EMPEZAR_SORPRENDEME_PAYLOAD = "EMPEZAR_SORPRENDEME_PAYLOAD";
const ARMO_MI_VIAJE_PAYLOAD = "ARMO_MI_VIAJE_PAYLOAD";
const ARMO_MI_VIAJE_VUELOS_PAYLOAD = "ARMO_MI_VIAJE_VUELOS_PAYLOAD";
const ARMO_MI_VIAJE_HOTELES_PAYLOAD = "ARMO_MI_VIAJE_HOTELES_PAYLOAD";
const FROM_1_PAYLOAD = "FROM_1_PAYLOAD";
const FROM_2_PAYLOAD = "FROM_2_PAYLOAD";
const FROM_3_PAYLOAD = "FROM_3_PAYLOAD";
const TO_1_PAYLOAD = "TO_1_PAYLOAD";
const TO_2_PAYLOAD = "TO_2_PAYLOAD";
const TO_3_PAYLOAD = "TO_3_PAYLOAD";
const UN_ADULTO_PERSONS_PAYLOAD = "UN_ADULTO_PERSONS_PAYLOAD";
const DOS_ADULTOS_PERSONS_PAYLOAD = "DOS_ADULTOS_PERSONS_PAYLOAD";
const DOS_ADULTOS_UN_NIÑO_PERSONS_PAYLOAD = "DOS_ADULTOS_UN_NIÑO_PERSONS_PAYLOAD";
const DOS_ADULTOS_DOS_NIÑOS_PERSONS_PAYLOAD = "DOS_ADULTOS_DOS_NIÑOS_PERSONS_PAYLOAD";
const DOS_ADULTOS_UN_BEBE_PERSONS_PAYLOAD = "DOS_ADULTOS_UN_BEBE_PERSONS_PAYLOAD";
const OTROS_PERSONS_PAYLOAD = "OTROS_PERSONS_PAYLOAD";
const EN_FAMILIA_WICH_PERSONS_PAYLOAD = "EN_FAMILIA_WICH_PERSONS_PAYLOAD";
const EN_PAREJA_WICH_PERSONS_PAYLOAD = "EN_PAREJA_WICH_PERSONS_PAYLOAD";
const CON_AMIGOS_WICH_PERSONS_PAYLOAD = "CON_AMIGOS_WICH_PERSONS_PAYLOAD";
const SOLO_WICH_PERSONS_PAYLOAD = "SOLO_WICH_PERSONS_PAYLOAD";
const PLAYA_TYPE_TRAVEL_PAYLOAD = "PLAYA_TYPE_TRAVEL_PAYLOAD";
const AVENTURA_TYPE_TRAVEL_PAYLOAD = "AVENTURA_TYPE_TRAVEL_PAYLOAD";
const COMPRAS_TYPE_TRAVEL_PAYLOAD = "COMPRAS_TYPE_TRAVEL_PAYLOAD";
const RELAX_TYPE_TRAVEL_PAYLOAD = "RELAX_TYPE_TRAVEL_PAYLOAD";
const CULTURA_TYPE_TRAVEL_PAYLOAD = "CULTURA_TYPE_TRAVEL_PAYLOAD";
const GASTRONOMIA_TYPE_TRAVEL_PAYLOAD = "GASTRONOMIA_TYPE_TRAVEL_PAYLOAD";
const ALL_INCLUSIVE_TYPE_TRAVEL_PAYLOAD = "ALL_INCLUSIVE_TYPE_TRAVEL_PAYLOAD";
const NIEVE_TYPE_TRAVEL_PAYLOAD = "NIEVE_TYPE_TRAVEL_PAYLOAD";
const ECONOMICO_TYPE_TRAVEL_PAYLOAD = "ECONOMICO_TYPE_TRAVEL_PAYLOAD";
const DE_LUJO_TYPE_TRAVEL_PAYLOAD = "DE_LUJO_TYPE_TRAVEL_PAYLOAD";
const OMITIR_BUDGET_PAYLOAD = "OMITIR_BUDGET_PAYLOAD";
const NUEVA_CONSULTA_FINAL_PAYLOAD = "NUEVA_CONSULTA_FINAL_PAYLOAD";
const INICIO_FINAL_PAYLOAD = "INICIO_FINAL_PAYLOAD";


/*
  Procesa el texto ingresado por un usuario.

  Primero indico que se esta tipeando y una vez enviado proceso el texto.
  Se utiliz Wit como interprete PNL.
  Puede devolver diferentes intent como dateTime o ningun intent cuando no
  pudo asociar el texto ingresado a un intent.
*/
exports.processText = function(event, responseWit) {
  var senderId = event.sender.id;
  var message = event.message;

  // Mostramos que se esta tipeando
  callTypingAPI(senderId, function(callback) {

    // Si se mostro seguimos
    if(callback) {

      clientWit.message(message.text, {})
      .then((responseWit) => {
        console.log(JSON.stringify(responseWit));

        var menssageOrigin = responseWit._text;

        // Busco los datos actuales del usuario
        dataProcess.get(senderId).once('value')
          .then(function(snapshot) {
            var to = snapshot.val().to;
            var dateFrom = snapshot.val().dateFrom;
            var dateBack = snapshot.val().dateBack;
            var type = snapshot.val().type;
            var from = snapshot.val().from;
            var typeSearch = snapshot.val().typeSearch;
            var wichPersons = snapshot.val().wichPersons;
            var typeTravel = snapshot.val().typeTravel;
            var days = snapshot.val().days;

            // Si ingresa cualquier cosa en el menu principal
            if(type === "null" && typeSearch === "null" ) {
              callSendAPI(generateMessage.initMessage(senderId), function(callback){});
              return;
            }

            if(!_.isEmpty(responseWit.entities)) {
              console.log("Respuesta wit: " + JSON.stringify(responseWit));

                // Tipo fecha
                if(responseWit.entities.datetime) {
                  responseWit.entities.datetime.forEach(function(datetime) {
                    var confidence = datetime.confidence;
                    var value = datetime.value;

                    // Opcion Armar mi viaje
                    if(type !== "null" && type === EMPEZAR_ARMO_MI_VIAJE_PAYLOAD ) {
                      // Opcion vuelo
                      if(typeSearch === ARMO_MI_VIAJE_VUELOS_PAYLOAD) {
                        if(to !== "null" && dateFrom === "null") {
                          dataProcess.setDateFrom(senderId, value);
                          callSendAPI(generateMessage.sendTextMessage(senderId, "¿Cuándo querés volver?"), function(callback){});
                        }
                        else if(to !== "null" && dateFrom !== "null" && dateBack === "null") {
                          dataProcess.setDateBack(senderId, value);
                          callSendAPI(generateMessage.personsMessage(senderId), function(callback){});
                        }
                      }
                      // Opcion hotel
                      else if (typeSearch === ARMO_MI_VIAJE_HOTELES_PAYLOAD) {
                        if(dateFrom === "null") {
                          dataProcess.setDateFrom(senderId, value);
                          callSendAPI(generateMessage.sendTextMessage(senderId, "¿Cuándo te vas del hotel?"), function(callback){});
                        }
                        // Ingreso fecha de vuelta
                        else if(dateFrom !== "null" && dateBack === "null") {
                          dataProcess.setDateBack(senderId, value);
                          callSendAPI(generateMessage.personsMessage(senderId), function(callback){});
                        }
                      }
                    }

                    // Opcion Sorprendeme
                    else if(type !== "null" && type === EMPEZAR_SORPRENDEME_PAYLOAD) {
                      if(from !== "null" && dateFrom === "null") {
                        dataProcess.setDateFrom(senderId, value);
                        callSendAPI(generateMessage.wichPersonsMessage(senderId), function(callback){});
                      }
                    }
                  });
                }

                //Tipo Numero
                else if(responseWit.entities.number) {
                  responseWit.entities.number.forEach(function(number) {
                    var confidence = number.confidence;
                    var value = number.value;

                    // Opcion Sorprendeme
                    if(type !== "null" && type === EMPEZAR_SORPRENDEME_PAYLOAD) {

                      // Ingreso days
                      if(from !== "null" && dateFrom !== "null" && wichPersons !== "null" && typeTravel !== "null" && days === "null") {
                        // Verifico que es numerico
                        if(!isNaN(menssageOrigin)) {
                          dataProcess.setDays(senderId, menssageOrigin);
                          callSendAPI(generateMessage.sorprendemeBudgetMessage(senderId), function(callback){});
                        } else {
                          callSendAPI(generateMessage.sendTextMessage(senderId, "Ingresa la cantidad de días en formato numérico por favor"), function(callback){});
                        }
                      }

                      // Ingreso el presupuesto
                      else if(from !== "null" && dateFrom !== "null" && wichPersons !== "null" && typeTravel !== "null" && days !== "null") {
                        // Verifico que es numerico
                        if(!isNaN(menssageOrigin)) {
                          dataProcess.setBudget(senderId, menssageOrigin);
                          callSendAPI(generateMessage.sendTextMessage(senderId, "Dame un segundo mientras busco el destino más acorde a tus gustos."), function(callback){
                            if(callback) {
                              callSendAPI(generateMessage.viajesBuscadosMessage(senderId), function(callback) {
                                if(callback) {
                                  callSendAPI(generateMessage.finalMessage(senderId), function(callback){});
                                }
                              });
                            }
                          });
                        } else {
                          callSendAPI(generateMessage.sendTextMessage(senderId, "Ingresa tu presupuesto en formato numérico por favor"), function(callback){});
                        }
                      }
                    }
                  });
                }
              }

              // Si no tiene ningun entities asociado
              else {

                // Opcion Armar mi viaje
                if(type === EMPEZAR_ARMO_MI_VIAJE_PAYLOAD && typeSearch !== "null") {

                  // Opcion vuelo
                  if(typeSearch === ARMO_MI_VIAJE_VUELOS_PAYLOAD) {
                    // Ingreso ciudad de salida
                    if(from === "null") {
                      callSendAPI(generateMessage.ciudadIndicadaFromMessage(senderId), function(callback){});
                    }
                    // Ingreso ciudad de destino
                    else if(from !== "null") {
                      callSendAPI(generateMessage.ciudadIndicadaToMessage(senderId), function(callback){});
                    }
                  }
                  // Opcion hotel
                  else if(typeSearch === ARMO_MI_VIAJE_HOTELES_PAYLOAD) {
                    // Ingreso ciudad destino
                    if(to === "null") {
                      callSendAPI(generateMessage.ciudadIndicadaToMessage(senderId), function(callback){});
                    }
                  }
                }

                // Opcion Sorprendeme
                if(type !== "null" && type === EMPEZAR_SORPRENDEME_PAYLOAD && typeSearch === "null") {
                  // Ingreso ciudad de salida
                  if(from === "null") {
                    callSendAPI(generateMessage.ciudadIndicadaFromMessage(senderId), function(callback){});
                  }
                  // Indico dateFrom en forma incorrecta
                  else if(from !== "null" && dateFrom === "null") {
                    callSendAPI(generateMessage.sendTextMessage(senderId, "¿Cuándo querés salir?"), function(callback){});
                  }
                  // Indico wichPersons en forma incorrecta
                  else if(from !== "null" && dateFrom !== "null" && wichPersons === "null") {
                    callSendAPI(generateMessage.wichPersonsMessage(senderId), function(callback){});
                  }
                  // Indico typeTravel en forma incorrecta
                  else if(from !== "null" && dateFrom !== "null" && wichPersons !== "null" && typeTravel === "null") {
                    callSendAPI(generateMessage.sorprendemeTypeTravelMessage(senderId), function(callback){});
                  }
                  // Indico days en forma incorrecta
                  else if(from !== "null" && dateFrom !== "null" && wichPersons !== "null" && typeTravel !== "null" && days === "null") {
                    callSendAPI(generateMessage.sendTextMessage(senderId, "Ingresa la cantidad de días en formato numérico por favor"), function(callback){});
                  }
                  // Indico budget en forma incorrecta
                  else if(from !== "null" && dateFrom !== "null" && wichPersons !== "null" && typeTravel !== "null" && days !== "null") {
                    callSendAPI(generateMessage.sendTextMessage(senderId, "Ingresa tu presupuesto en formato numérico por favor"), function(callback){});
                  }
                }
              }
          });
        })
      .catch(console.error);
    }
  });
}

/*
  Procesa los botones del menu y el boton inicial "EMPEZAR" que presiona un usuario.
  Cada boton tiene un payload asociado.
*/
exports.processPostBack = function(event) {
  var message = "null";
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  // Mostramos que se esta tipeando
  callTypingAPI(senderId, function(callback) {

    // Si se mostro seguimos
    if(callback) {

      switch (payload) {

        case EMPEZAR_DE_NUEVO_PAYLOAD:
        case EMPEZAR_PAYLOAD:
          dataProcess.initUser(senderId);
          callSendAPI(generateMessage.initMessage(senderId), function(callback){});
          return;

        case ARMO_MI_VIAJE_PAYLOAD:
          callSendAPI(generateMessage.armoMiViajeMessage(senderId), function(callback){});
          return;
      }
      if(message !== "null") {
        callSendAPI(generateMessage.sendTextMessage(senderId, message), function(callback){});
      }
    }
  });
}

/*
  Procesa los botones quick_reply que presiona un usuario.
  Estos botones quick_reply se pueden mandar junto a un mensaje de texto.
  Cada boton tiene un payload asociado.
*/
exports.processQuickReply = function(event) {
  var message = "null";
  var senderId = event.sender.id;
  var payload = event.message.quick_reply.payload;

  // Mostramos que se esta tipeando
  callTypingAPI(senderId, function(callback) {

    // Si se mostro seguimos
    if(callback) {

      switch(payload) {

        case EMPEZAR_ARMO_MI_VIAJE_PAYLOAD:
          dataProcess.setType(senderId, EMPEZAR_ARMO_MI_VIAJE_PAYLOAD);
          callSendAPI(generateMessage.armoMiViajeMessage(senderId), function(callback){});
          return;

        case EMPEZAR_SORPRENDEME_PAYLOAD:
          dataProcess.setType(senderId, EMPEZAR_SORPRENDEME_PAYLOAD);
          message = "¿Desde qué ciudad salis?";
          break;

        case ARMO_MI_VIAJE_VUELOS_PAYLOAD:
          dataProcess.setTypeSearch(senderId, ARMO_MI_VIAJE_VUELOS_PAYLOAD);
          message = "¿Desde qué ciudad salis?";
          break;

        case ARMO_MI_VIAJE_HOTELES_PAYLOAD:
          dataProcess.setTypeSearch(senderId, ARMO_MI_VIAJE_HOTELES_PAYLOAD);
          message = "¿En qué ciudad te vas a hospedar?";
          break;

        case FROM_1_PAYLOAD:
        case FROM_2_PAYLOAD:
        case FROM_3_PAYLOAD:
          dataProcess.setFrom(senderId, payload);
          dataProcess.get(senderId).once('value')
            .then(function(snapshot) {
              var type = snapshot.val().type;
              var typeSearch = snapshot.val().typeSearch;
              var from = snapshot.val().from;

              // Armar mi viaje
              if(type === EMPEZAR_ARMO_MI_VIAJE_PAYLOAD && typeSearch !== "null") {
                message = "¿A dónde deseás viajar?";
                callSendAPI(generateMessage.sendTextMessage(senderId, message), function(callback){});
              }
              // Sorprendeme
              else if(type === EMPEZAR_SORPRENDEME_PAYLOAD && typeSearch === "null") {
                message = "¿Cuándo querés salir?";
                callSendAPI(generateMessage.sendTextMessage(senderId, message), function(callback){});
              }
            });
          break;

        case TO_1_PAYLOAD:
        case TO_2_PAYLOAD:
        case TO_3_PAYLOAD:
          dataProcess.setTo(senderId, payload);
          dataProcess.get(senderId).once('value')
            .then(function(snapshot) {
              var typeSearch = snapshot.val().typeSearch;

              // Opcion vuelo
              if(typeSearch === ARMO_MI_VIAJE_VUELOS_PAYLOAD) {
                callSendAPI(generateMessage.sendTextMessage(senderId, "¿Cuándo querés salir?"), function(callback){});
                return;
              }
              // Opcion hotel
              else if(typeSearch === ARMO_MI_VIAJE_HOTELES_PAYLOAD) {
                callSendAPI(generateMessage.sendTextMessage(senderId, "¿Cuándo vas a llegar al hotel?"), function(callback){});
                return;
              }
            });
          break;

        case UN_ADULTO_PERSONS_PAYLOAD:
        case DOS_ADULTOS_PERSONS_PAYLOAD:
        case DOS_ADULTOS_UN_NIÑO_PERSONS_PAYLOAD:
        case DOS_ADULTOS_DOS_NIÑOS_PERSONS_PAYLOAD:
        case DOS_ADULTOS_UN_BEBE_PERSONS_PAYLOAD:
        case OTROS_PERSONS_PAYLOAD:
          dataProcess.setPersons(senderId, payload);
          callSendAPI(generateMessage.sendTextMessage(senderId, "Estamos buscando el mejor precio para tu vuelo... Danos un momento."), function(callback){
            if(callback) {
              callSendAPI(generateMessage.viajesBuscadosMessage(senderId), function(callback) {
                if(callback) {
                  callSendAPI(generateMessage.finalMessage(senderId), function(callback){});
                  return;
                }
              });
            }
          });
          break;

        case EN_FAMILIA_WICH_PERSONS_PAYLOAD:
        case EN_PAREJA_WICH_PERSONS_PAYLOAD:
        case CON_AMIGOS_WICH_PERSONS_PAYLOAD:
        case SOLO_WICH_PERSONS_PAYLOAD:
          dataProcess.setWichPersons(senderId, payload);
          callSendAPI(generateMessage.sorprendemeTypeTravelMessage(senderId), function(callback){});
          return;

        case PLAYA_TYPE_TRAVEL_PAYLOAD:
        case AVENTURA_TYPE_TRAVEL_PAYLOAD:
        case COMPRAS_TYPE_TRAVEL_PAYLOAD:
        case RELAX_TYPE_TRAVEL_PAYLOAD:
        case CULTURA_TYPE_TRAVEL_PAYLOAD:
        case GASTRONOMIA_TYPE_TRAVEL_PAYLOAD:
        case ALL_INCLUSIVE_TYPE_TRAVEL_PAYLOAD:
        case NIEVE_TYPE_TRAVEL_PAYLOAD:
        case ECONOMICO_TYPE_TRAVEL_PAYLOAD:
        case DE_LUJO_TYPE_TRAVEL_PAYLOAD:
          dataProcess.setTypeTravel(senderId, payload);
          message = "¿Cuántos días tenés?";
          break;

        case OMITIR_BUDGET_PAYLOAD:
          dataProcess.setBudget(senderId, payload);
          callSendAPI(generateMessage.sendTextMessage(senderId, "Dame un segundo mientras busco el destino más acorde a tus gustos."), function(callback){
            if(callback) {
              callSendAPI(generateMessage.viajesBuscadosMessage(senderId), function(callback) {
                if(callback) {
                  callSendAPI(generateMessage.finalMessage(senderId), function(callback){});
                  return;
                }
              });
            }
          });
          break;

        case NUEVA_CONSULTA_FINAL_PAYLOAD:
          dataProcess.initUser(senderId);
          callSendAPI(generateMessage.initMessage(senderId), function(callback){});
          return;

        case INICIO_FINAL_PAYLOAD:
          dataProcess.initUser(senderId);
          dataProcess.setType(senderId, EMPEZAR_ARMO_MI_VIAJE_PAYLOAD);
          callSendAPI(generateMessage.armoMiViajeMessage(senderId), function(callback){});
          return;
      }
      if(message !== "null") {
        callSendAPI(generateMessage.sendTextMessage(senderId, message), function(callback){});
      }
    }
  });
}

/*
  Procesa mensajes enviados por el usuario que posean
  archivos adjuntos
*/
exports.processAtachments = function(event) {
  callSendAPI(generateMessage.sendTextMessage(senderId, "Por el momento no podemos procesar mensages con archivos adjuntos."));
}

/*
  Envia un mensaje a un usuario indicado dentro del messageData: recipientId
  y con el mensaje messageData: message.
*/
function callSendAPI(messageData, callback) {
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
      callback(true);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
      callback(false);
    }
  });
}

/*
  Muestra en el chat que se esta escribiendo
  Deja de mostrarlo cuando se envia otro mensaje o
  pasados 20 segundos.
*/
function callTypingAPI(recipientId, callback) {
  let messageData = {
    recipient: {
      id: recipientId
    },
      sender_action: "typing_on"
  };

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      callback(true);
    } else {
      console.error(response);
      console.error(error);
      callback(false);
    }
  });
}
