//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  CAPAS - WFS   ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/////////////////////
////  PUENTES WFS V3

// - - > Variables para estilo
var ultimoclick = null;
var highlight_puentes = {
/*  'fillColor': '',*/
  'color': 'red',   //---> si se activa usa este color, si usamos solo 'fillColor' permite resaltar con el propio color del vector.
  'weight': 10,
  'opacity': 1,
/*'permanent': false*/    //---> no funciona
};
var pt_estilo1 = {
  radius: 5,
  weight: 1,
  opacity: 1,
  color: 'black',
  fillColor: 'orange',
  fillOpacity: 1
};

// MÉTODO FETCH
    //- - > datos para llamada de capa
var puentes = 'http://10.7.20.214:8080/geoserver/sigiv/wfs?';
var defaultParameters = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'sigiv:puentes_v3',
    srsname: 'EPSG:4326',
    outputFormat: 'application/json'
};
var parameters = new URLSearchParams(defaultParameters);

    //- - > inicio LLAMADA FETCH
fetch(puentes + parameters)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {       // Se crea la capa GeoJSON a llamar con los datos obtenidos de la URL
      var fetch_puentes = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, pt_estilo1)
        },
        onEachFeature: function (feature, layer) {
          /* EVENTO INTERNO que crea el HIGHLIGHT DE PUENTES (deja tildado al seleccionar)*/
          layer.on("click", function (e) {
              if (ultimoclick) {
                ultimoclick.setStyle(pt_estilo1) // Restablecer estilo de la capa puentes previamente seleccionada
              }
              layer.setStyle(highlight_puentes);  // Establece el estilo de resaltado para la capa puentes clickeada
              ultimoclick = layer; // Actualiza la capa puentes seleccionada, vuelve al parámetro "layer"
          });
      }
      }).bindPopup(function (layer) {
        return (`<b> Identificador.: </b>` + layer.feature.properties.id +  '<br>' +
        '<FONT COLOR="orange">' + '<b> Long. mts.: </b>' + '</FONT>' + layer.feature.properties.longitud_t + '<br>' +
        '<FONT COLOR="orange">' + '<b> N° de luces y long. c/u mts.: </b>' + '</FONT>' + layer.feature.properties.cantidad_t + ' * ' + layer.feature.properties.luz_parcia + '<br>' +
        '<FONT COLOR="orange">' + '<b> Ampliación: </b>' + '</FONT>' +layer.feature.properties.ampliacion + '<br>' +
        '<FONT COLOR="orange">' + '<b> Ensanche: </b>' + '</FONT>' + layer.feature.properties.ensanche + '<br>' +
        '<FONT COLOR="orange">' + '<b> Losa de aproximación: </b>' + '</FONT>' + '<br>' + layer.feature.properties.losa_de_ap + '<br>' + layer.feature.properties.longitud_2 + ' - ' + layer.feature.properties.carpeta_ro + '<br>'
        // '<b> Fecha de relevamiento: </b>' + layer.feature.properties.pu_fecha  // - - - > en el visor aparece con una Z al final cada dato
        );
      });
      /*fetch_puentes.on('click', function (e) {  //--- > permite zoom hacia objeto seleccionado en capa (configurado tambien en plugin)
        visor.setView(e.latlng,10)
      });*/
      layerControl.addOverlay(fetch_puentes, "Puentes"); //---> se agrega la capa al árbol de capas
      // fetch_puentes.addTo(visor);   // ---> Al comentar la línea permito que se desactive al inicar el mapa (PERO si no estuviera el buscador de objetos que parece que inhibe a esta linea)      

        // Evento que deselecciona capas al clickear otra parte del div "visor"
      visor.on('click', function() {
        if (ultimoclick) {
          ultimoclick.setStyle(pt_estilo1); // Restablecer el estilo de la capa seleccionada
          ultimoclick = null; // Restablece a la variable original
        }
      });

      ////// BUSCADOR PUENTES
      /*var searchControl = new L.Control.Search({ //---> permite zoom hacia objeto seleccionado con plugin (configurado tambien en capa)
        layer: fetch_puentes, propertyName: 'id', circleLocation: false,
        textPlaceholder:'Búsqueda por n° de puente', position: 'topleft', textErr: 'Objeto no identificado',
        moveToLocation: function(latlng, title, visor) {
          visor.setView(latlng, 10); // Zoom al encontrar la ubicación del puente
        } 
      });
      searchControl.on('search_locationfound', function(e) {        
        e.layer.setStyle({*//*fillColor: '#00FF23'--para polígono*/ /*color: '#FF0000'});*/ // Establece el estilo de resaltado para la capa encontrada
      /*})
        .on('search_collapsed', function(e) {
          fetch_puentes.eachLayer(function(layer) { //restauramos el color del elemento
            fetch_puentes.resetStyle(layer);
          });
        })
      visor.addControl(searchControl);*/
      //////

    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch: ' + error.message);
    });
    //- - > CIERRE llamada FETCH

//////////////////
////  TRÁNSITO WFS 

    //- - > estilos para transito "style_transito"
    function style_transito(feature) {
    var t = feature.properties.tmda; 
    var t2;
    if (t >= 0 && t <= 932) {
        t2 = '#faebdd';
    } else if (t >= 932 && t <= 2699) {
        t2 = '#f69e75';
    } else if (t >= 2699 && t <= 5913) {
        t2 = '#e8403e';
    } else if (t >= 5913 && t <= 10743) {
        t2 = '#a21a5b';
    } else if (t >= 10743 && t <= 17080) {
        t2 = '#4c1d4b';
    } else if (t >= 17080 && t <= 26317) {
        t2 = '#03051a';
    }
    else {
        t2 = 'null'; // Color predeterminado para valores fuera de los rangos especificados
    }
    return {color: t2, opacity: 1, weight: 2};
}

// MÉTODO FETCH
    //- - > datos para llamada de capa
var transito = 'http://10.7.20.214:8080/geoserver/sigiv/wfs?';
var defaultParameters = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'sigiv:trans_240514',
    srsname: 'EPSG:4326',
    outputFormat: 'application/json'
};
var parameters = new URLSearchParams(defaultParameters);

    //- - > inicio LLAMADA FETCH
fetch(transito + parameters)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {        // Aca se cre la capa GeoJSON a llamar con los datos obtenidos de la URL
        var fetch_transito = L.geoJson(data, {
            style: style_transito,
            onEachFeature: function (feature, layer) {
            }
        }).bindPopup(function (layer) {
            return ('<b>' + layer.feature.properties.fna + '</b>' + '<br>' +
            '<b> TMDA.: </b>' + layer.feature.properties.tmda + '<br>' +
            '<FONT COLOR="grey">' + '<b>' +' Long. : ' + '</b>' + '</FONT>' + layer.feature.properties.len_m + ' mts.' + '<br>' +
            '<FONT COLOR="grey">' + '<b>' +' Inicio de tramo: ' + '</b>' + '</FONT>' + layer.feature.properties.ini_tra + '<br>' +
            '<FONT COLOR="grey">' + '<b>' + ' Fin de tramo: ' + '</b>' + '</FONT>' +layer.feature.properties.fin_tra + '<br>' +
            '<FONT COLOR="grey">' + '<b>' +'Mes ' + '</b>' + '</FONT>' + layer.feature.properties.mes + '<br>'+
            '<FONT COLOR="grey">' + '<b>' + 'Año ' + '</b>' + '</FONT>' +layer.feature.properties.ano
        );
        })
        layerControl.addOverlay(fetch_transito, "Tránsito"); //---> se agrega la capa al árbol de capas
        //fetch_transito.addTo(visor);   // ---> Al descomentar permito que se active al inicar el mapa
    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch: ' + error.message);
    });

    //- - > CIERRE llamada FETCH

///////////////////
////  CALZADAS WFS 

// METODO FETCH
    //- - > estilos para calzadas "style"
function style_calzada(feature) {
  var c/*;  --- estaba ese punto y coma pero no se para que sirve, al parecer no afecta sacarlo*/ 
  switch (feature.properties.dpv_cal) {
    case 'Natural': c = '#ffffff'; break;
    case 'Mejorada': c = '#db6adb'; break;
    case 'Pavimentada': c = '#ff0127'; break;
    default: c = '#000000';
  }
  return {color: c, opacity: 1, weight: 2};
}
var highlight_calzada = {
  'fillColor': '',
      /*'color': 'yellow', */   //---> si se activa usa el color amarillo, pero si usamos solo el parámetro 'fillColor' permite resaltar con el propio color del vector, además no desaparece la seleccion con el zoom pero deja de hacer efecto el 'height'
  'weight': 10,
  'opacity': 1,
      'permanent': false    //---> no funciona
};

      //- - > datos para llamada de capa
var redvial = 'http://10.7.20.214:8080/geoserver/sigiv/wfs?';
var defaultParameters = {
service: 'WFS',
version: '2.0.0',
request: 'GetFeature',
typeName: 'sigiv:sf_dpv_dnv_redvial_221227_5347',
srsname: 'EPSG:4326', ///rever si en este SRC o en otro
outputFormat: 'application/json'
};
var parameters = new URLSearchParams(defaultParameters);
    //- - > inicio LLAMADA FETCH
fetch(redvial + parameters)
.then(function(response) {
  return response.json();
})
.then(function(data) {
    // Crear capa de outline
  var outline = new L.geoJson(data, {
    style: function (feature) {
      return {color: 'black', opacity: 1, weight: 3};
    }
  }).addTo(visor)//.bringToBack();
    //- - > calzada - ESTILO
  var calzada = new L.geoJson(data, {
  //pane: "rutasPane",// ---> este parámetro estaba en el código. Al sacarlo las rutas se cargan con el estilo y pop-ups etc. 
    style: style_calzada,
    onEachFeature: function (feature, layer) {
      layer.on("click", function (e) {
        calzada.setStyle(style_calzada); //setea segun colores de la función "style" declarada previamente
        layer.setStyle(highlight_calzada);  //permite la selección con la variable "highlight" de la función "sytle"
      });
      layer.on("mouseout", function () {
        calzada.resetStyle(this);
      });   // --> esta funcion permite al sacar el mouse del objeto que se vaya el estilo de resalte, pero el aparece una advertencia que no causa error en la consola sobre la verison de Leaflet utilizada
      },
  }).bindPopup(function (layer) { //---> PROPIEDAD PARA POP-UP
      return ('<b>' + layer.feature.properties.fna + '</b>' + '<br>' +
      '<FONT COLOR="grey">' + '<b>' +' Long: ' + '</b>' + '</FONT>' + layer.feature.properties.len + ' km.' + '<br>' +
      '<FONT COLOR="grey">' + '<b>' +' Inicio de tramo: ' + '</b>' + '</FONT>' + layer.feature.properties.dpv_tram_i + '<br>' +
      '<FONT COLOR="grey">' + '<b>' + ' Fin de tramo: ' + '</b>' + '</FONT>' +layer.feature.properties.dpv_tram_f + '<br>' +
      '<FONT COLOR="grey">' + '<b>' + ' Interrupción: ' + '</b>' + '</FONT>' +layer.feature.properties.dpv_itr)      
  }).addTo(visor)//.bringToBack();

  //- - > ETIQUETAS "nam" - ZOOM
  visor.on('zoomstart', function () {
    try{
      var zoomLevel = visor.getZoom();
      console.log(zoomLevel);
      var tooltip = $('.label');
      console.log("zoomLevel");
      console.log(zoomLevel);
      switch (zoomLevel) {
        default: tooltip.css('font-size', 0)
        if(zoomLevel>5) {
            tooltip.css('font-size', 10);}
        if(zoomLevel>13) {
            tooltip.css('font-size',20);}
      }
      }catch(ex){
        alert(ex); 
      }
  });

      ////// BUSCADOR RUTAS
      var searchControl2 = new L.Control.Search({ //---> permite zoom hacia objeto seleccionado con plugin (configurado tambien en capa)
        layer: calzada, propertyName: 'fna', initial: false, circleLocation: true,
        textPlaceholder:'Búsqueda por RP o RN', textErr: 'Objeto no identificado',
        marker:{icon: false, circle: false /*{radius: 10, weight: 3, color: '#e03', stroke: true, fill: false},*/
                /*animate: true, // animate a circle over location found*/},
        initial:	false,	//search elements only by initial text
        casesensitive: true,	//search elements in case sensitive text
        moveToLocation: function(latlng, title, visor) {
          visor.setView(latlng, 8); // Zoom al encontrar la ubicación del puente
          calzada.eachLayer(function (layer) {
            if (layer.feature.properties.fna === title) {
              layer.setStyle({color: '#f1c40f', weight: 10});
              layer.fna_highlighted = true; // Se marca como resaltado los FNA iguales
            } else {
                layer.setStyle({highlight_calzada});
                calzada.resetStyle(layer);
                layer.fna_highlighted = false; // Se marca como no resaltado los restantes
            }
          });
        } 
      });
      visor.addControl(searchControl2);

      // Eventos de clickeo para buscador rutas
      // click en el mapa: desactivar resaltado
      visor.on('click', function() {
        calzada.eachLayer(function(layer) {
            if (layer.fna_highlighted) {
                layer.setStyle(highlight_calzada);
                calzada.resetStyle(layer);
                layer.fna_highlighted = false;
            }
        });
      });
      // mouseover y mouseout: mantener el resaltado y no que se vaya al pasar el mouse por vector (que solo sea por hacer click del evento anterior)
      calzada.eachLayer(function(layer) {
        layer.on('mouseover', function() {
            if (layer.fna_highlighted) {
                layer.setStyle({ color: '#f1c40f', weight: 10 });
            }
        });
        /*layer.on('mouseout', function() {
            if (layer.fna_highlighted) {
                layer.setStyle({ color: '#f1c40f', weight: 10 });
            }
        });*/ //---> bloque que provoca que se vayan resaltando de a segmentos sumandose, y no de a uno
      });
        //////

  ////// VARIABLE DE AGRUPAMIENTO
var grupoRutas = L.layerGroup([calzada, outline]); //---> Crea un grupo de capas para las calzadas y el outline
layerControl.addOverlay(grupoRutas, "Rutas"); //---> se agrega el grupo creado al árbol de capas
grupoRutas.addTo(visor);  // ---> Al comentar permito que no se active al inicar el mapa
})
  //- - > CIERRE llamada FETCH
//var eventos_dpv = L.layerGroup([puentes, transito]);


//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  WMS & WFS   /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

////// ESTRUCTURA ARBOL DE CAPAS
/*var baseTree = {
  "IGN: Argenmap": mb_ign_argenmap,
  "IGN: Topográfico": mb_ign_topografico,
  "CARTO": mb_carto,
  "ESRI: Satellite": mb_esri_satelite,
  "SRTM-450m": mb_srtm_450m
};*/
var baseTree = {
    "Zonas - DPV": wmszonas,
    "Departamentos": wmsdepartamentos,
    "Distritos": wmsdistritos,
    "Localidades y Parajes": wmslocalidades_parajes
};
var overlaysTree = {
  "Áreas político-administrativas": {
    "Zonas - DPV": wmszonas,
    "Departamentos": wmsdepartamentos,
    "Distritos": wmsdistritos,
    "Localidades y Parajes": wmslocalidades_parajes
  }
    /*
  "Eventos DPV": {
    "Tránsito": L.layerGroup(eventos_dpv[2]),
    "Puentes": L.layerGroup(eventos_dpv[0])
  }*/
  //"Eventos DPV":{"Tránsito": transito}
};
var config_arbol = {
    groupCheckboxes: true,
    collapsed: false,
    //layers: [grupoRutas]
};

/*var baseTree = [{
      label: 'IGN',
      children: [
        { label: 'IGN: Argenmap', layer: mb_ign_argenmap },
        { label: 'IGN: Topográfico', layer: mb_ign_topografico }
      ]
    }, {
      label: 'Otros',
      children: [
        { label: 'CARTO', layer: mb_carto },
        { label: 'ESRI: Satellite', layer: mb_esri_satelite }
      ]
    }];

    var overlaysTree = [{
      label: 'CAPAS',
      children: [{
        label: 'Divisiones político-administrativas',
        children: [
          { label: 'Zonas - DPV', layer: wmszonas },
          { label: 'Departamentos', layer: wmsdepartamentos },
          { label: 'Distritos', layer: wmsdistritos },
          { label: 'Localidades y Parajes', layer: wmslocalidades_parajes }
        ]
      }, {
        label: 'Eventos DPV',
        children: [
          { label: 'Rutas' },
          { label: 'Puentes' },
          { label: 'Tránsito' }
        ]
      }]
    }];
*/

////// CONTROLADOR Y ARBOL DE CAPAS
var sidebar = L.control.sidebar({
  container: 'sidebar',
  position: 'left',
}).addTo(visor);

var layerControl = L.control.groupedLayers(null, overlaysTree, config_arbol).addTo(visor);
document.querySelector('#layers').appendChild(layerControl.getContainer());

//OpacityControl - 1
var layerControlOpacity1 = 
L.control
    .opacity(baseTree, {
        label: 'Opacidad de capas',
    })
    .addTo(visor);
document.querySelector('#layers').appendChild(layerControlOpacity1.getContainer())

/* - - - > PLUGIN DE OPACIDAD
//Funciona como capas pero inutilizado el SIDEBAR 
//si meto este bloque entre el "var layerControl..." y la sentencia "document.query...."
//LayerControl
L.control
    .layers(baseTree, overlaysTree, {
        collapsed: false,
    })
    .addTo(visor);

//OpacityControl
L.control
    .opacity(overlaysTree, {
        label: 'Layers Opacity',
    })
    .addTo(visor);
    */

//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  FUNCIONALIDADES   ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

////// ESCALA
L.control.scale({
  metric: true, imperial: false, position: 'bottomright'
  /*position: 'bottomright'*/ //---> no funciona, si se activa conflicto (quizas con sidebar)
}).addTo(visor);

////// BOTON FULLSCREEN
var fsControl = L.control.fullscreen({
  position: 'bottomright',
  title: 'Modo pantalla completa',
  titleCancel: 'Salir de modo pantalla completa',
  forceSeparateButton: false
});
visor.addControl(fsControl);
    // lo siguiente sacandolo funciona igual
/*visor.on('enterFullscreen', function(){
	if(window.console) window.console.log('enterFullscreen');
});
visor.on('exitFullscreen', function(){
	if(window.console) window.console.log('exitFullscreen');
});*/

////// BOTONES ZOOM - - > > me esta creando otro controlador de zoom
var zoomControl = L.control.zoom({
  position: 'bottomright',
});
visor.addControl(zoomControl);

////// BOTON MEDICIÓN
L.drawLocal.draw.handlers.polyline.tooltip.start = 'Haz clic para comenzar a dibujar la línea';
L.drawLocal.draw.handlers.polyline.tooltip.end = 'Haz clic en el último punto para finalizar';

var medicionControl = L.Control.measureControl({
position: 'bottomright',
title: 'Medición de distancias',
handler: {
  shapeOptions: {color: '#000', weight: 2} //colores linea
}
}).addTo(visor);

////// BOTON IMPRESIÓN
L.control.browserPrint({
  position: 'bottomright',
  title: 'Imprimir',printModes: [
    L.BrowserPrint.Mode.Landscape("",{title: "Horizontal"}),
    L.BrowserPrint.Mode.Portrait("",{title: "Vertical"}),
    L.BrowserPrint.Mode.Auto("B4",{title: "Todo"}),
    L.BrowserPrint.Mode.Custom("",{title:"Seleccionar área"})
  ],
  cancelWithEsc: true,
  manualMode: false
}).addTo(visor);