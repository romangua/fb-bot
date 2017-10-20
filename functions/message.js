
exports.sendTextMessage = function(recipientId, messageText) {
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

exports.initMessage = function(recipientId) {
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

exports.armoMiViajeMessage = function(recipientId) {
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
          "content_type":"text",
          "title":"Hoteles",
          "payload":"ARMO_MI_VIAJE_HOTELES_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.ciudadIndicadaFromMessage = function(recipientId) {
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
          "payload":"FROM_1_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Marcos Juares, Cordoba",
          "payload":"FROM_2_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Leones, Cordoba",
          "payload":"FROM_3_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.ciudadIndicadaToMessage = function(recipientId) {
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
          "title":"Buenos Aires, Buenos Aires",
          "payload":"TO_1_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"La Plata, Buenos Aires",
          "payload":"TO_2_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"CABA, Buenos Aires",
          "payload":"TO_3_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.personsMessage = function(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿Cuántos adultos, niños y/o bebés en brazos van a viajar? Recordá que las edades al momento del arribo al regresar debe ser mayor de 11 años para los adultos, 11 años o menos los niños y 2 años o menos los bebés en brazos.",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"1 adulto",
          "payload":"UN_ADULTO_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"2 adultos",
          "payload":"DOS_ADULTOS_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"2 adultos y 1 niño",
          "payload":"DOS_ADULTOS_UN_NIÑO_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"2 adultos y 2 niños",
          "payload":"DOS_ADULTOS_DOS_NIÑOS_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"2 adultos y 1 bebé",
          "payload":"DOS_ADULTOS_UN_BEBE_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Otro",
          "payload":"OTROS_PERSONS_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.wichPersonsMessage = function(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿Con quién viajás?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"En familia",
          "payload":"EN_FAMILIA_WICH_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"En pareja",
          "payload":"EN_PAREJA_WICH_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Con amigos",
          "payload":"CON_AMIGOS_WICH_PERSONS_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Solo",
          "payload":"SOLO_WICH_PERSONS_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.sorprendemeTypeTravelMessage = function(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿Qué tipo de viaje querés hacer?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Playa",
          "payload":"PLAYA_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Aventura",
          "payload":"AVENTURA_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Compras",
          "payload":"COMPRAS_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Relax",
          "payload":"RELAX_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Cultura",
          "payload":"CULTURA_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Gastronomía",
          "payload":"GASTRONOMIA_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"All inclusive",
          "payload":"ALL_INCLUSIVE_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Nieve",
          "payload":"NIEVE_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Económico",
            "payload":"ECONOMICO_TYPE_TRAVEL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"De lujo",
          "payload":"DE_LUJO_TYPE_TRAVEL_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.sorprendemeBudgetMessage = function(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿Que presupuesto tenés?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Omitir",
          "payload":"OMITIR_BUDGET_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.finalMessage = function(recipientId) {
  let mensaje = {
  "recipient":{
      "id": recipientId
  },
  "message":{
      "text": "¿Querés volver a consultar o ir al inicio?",
      "quick_replies":
      [
        {
          "content_type":"text",
          "title":"Nueva consulta",
          "payload":"NUEVA_CONSULTA_FINAL_PAYLOAD"
        },
        {
          "content_type":"text",
          "title":"Inicio",
          "payload":"INICIO_FINAL_PAYLOAD"
        }
      ]
    }
  };
  return mensaje;
}

exports.viajesBuscadosMessage = function(recipientId) {
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
            title: "Curacao - Precio Final: $63668",
            subtitle: "The Ritz Village Hotel - Solo la habitación",
            item_url: "https://almundo.com.ar/vuelo-hotel/detail/1f220625-dd3b-4981-b71f-5aed58a95235?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
            image_url: "https://images.almundo.com/201/6000000/5020000/5013200/5013176/5013176_187_b.jpg",
            buttons: [{
              type: "web_url",
              url: "https://almundo.com.ar/vuelo-hotel/detail/1f220625-dd3b-4981-b71f-5aed58a95235?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
              title: "Comprar"
            }]
          }, {
            title: "Maceio - Precio Final: $39417",
            subtitle: "Hotel Ponta Verde Maceio - Solo la habitación",
            item_url: "https://almundo.com.ar/vuelo-hotel/detail/5d0ac574-350a-445b-a35f-4458bfc1bf27?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
            image_url: "https://images.almundo.com/201/9000000/8100000/8099600/8099524/07105e5e_b.jpg",
            buttons: [{
              type: "web_url",
              url: "https://almundo.com.ar/vuelo-hotel/detail/5d0ac574-350a-445b-a35f-4458bfc1bf27?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
              title: "Comprar"
            }]
          }, {
            title: "Oranjestad - Aruba - Precio Final: $49901",
            subtitle: "Tropicana Aruba Resort & Casino - Solo la habitación",
            item_url: "https://almundo.com.ar/vuelo-hotel/detail/933c4cd4-6c47-42f2-a82f-299a9c072958?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
            image_url: "https://images.almundo.com/201/1000000/20000/15900/15876/15876_287_b.jpg",
            buttons: [{
              type: "web_url",
              url: "https://almundo.com.ar/vuelo-hotel/detail/933c4cd4-6c47-42f2-a82f-299a9c072958?utm_source=chatbot&utm_medium=facebook&utm_campaign=first_release",
              title: "Comprar"
            }]
          }]
        }
      }
    }
  };
  return messageData;
}
