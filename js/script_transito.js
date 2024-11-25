//////////////////////////////////////////////////////////////////////////
////////////////////////////   VARIABLES   //////////////////////////////
////////////////////////////////////////////////////////////////////////

var visor                   // Visor

var mb_carto                // Mapa Base de CARTO
var mb_esri_satelite        // Mapa Base Satelital de ESRI
var mb_ign_argenmap         // Mapa Base IGN
var mb_ign_oscuro           // Mapa Base Oscuro IGN
var mb_ign_topografico      // Mapa Base Topográfico IGN
var mb_srtm_450m            // Mapa Base MUNDIALIS
var mb_google_traffic       // Mapa Base GOOGLE Traffic

var control_mapasbase       // Controlador de mapas base   

var wmszonas                // Capa Zonas
var wmsdepartamentos        // Capa Departamentos
var wmsdistritos            // Capa Distritos
var wmslocalidades_parajes  // Capa Localidades y Parajes

var puentes                 // Capa Puentes
var fetch_puentes               //--> capa llamada fetch puentes
var transito                 // Capa Transito
var fetch_transito              //--> capa llamada fetch transito
var redvial                 // Capa Rutas (agrupa las llamadas fetch outline y calzada)
var outline                    //--> capa llamada fetch outline
var calzada                    //--> capa llamada fetch calzada
var grupoRutas              //--> capa agrupa outline y calzada para arbol de capas

var baseTree                // Mapas base y 1° parámetro para arbol de capas
var overlaysTree            // Segundo parámetro para arbol de capas
var config_arbol            // Tercer parámetro para arbol de capas
var sidebar                 // Barra lateral
var layerControl            // Árbol de capas

///////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  MAPAS BASE - WMS   ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// Mapa Base CARTO
var mb_carto = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: 'DPV Santa Fe - Área de SIG | © CARTO'
});
// Mapa Base ESRI Satelite
var mb_esri_satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© ESRI Imagery/Satellite'
});
// Mapas Base IGN
var mb_ign_argenmap = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
  attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
});
var mb_ign_oscuro = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG%3A3857@png/{z}/{x}/{-y}.png',{
  attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
});
var mb_ign_topografico = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
  attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
});
// Mapas Base MUNDIALIS
var mb_srtm_450m = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
  layers: 'SRTM30-Colored-Hillshade'
});
var mb_google_traffic = L.tileLayer('https://mt1.google.com/vt?lyrs=h@159000000,traffic|seconds_into_week:-1&style=3&x={x}&y={y}&z={z}',{ 
  attribution: 'Google'
})

// MAPA CENTRADO EN SANTA FE
var visor = L.map('map',{
  zoomControl: false,
  zoomSnap: 0.1,
  layers: [mb_carto],
  renderer: L.canvas({ tolerance: 10 })    //---> propiedad que amplia el radio de selección con el mouse para todas las capas
}).setView([-31.25, -61], 6.7)
.setMinZoom(4.3)
.setMaxZoom(15.3);

// CONTROLADOR Mapas Base
new L.basemapsSwitcher([
  {layer: mb_carto.addTo(visor), //mapa base por default
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/carto.png',
    name:'CARTO'
  },
  {layer: mb_esri_satelite,
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/esri-satellite.png',
    name:'ESRI: Satellite'
  },
  {layer: mb_ign_argenmap,
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/ign-argenmap.png',
    name:'IGN: Argenmap'
  },
  {layer: mb_ign_oscuro,
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/ign-oscuro.png',
    name:'IGN: Oscuro'
  },
  {layer: mb_ign_topografico,
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/ign-topografico.png',
    name:'IGN: Topográfico'
  },
  {layer: mb_srtm_450m,
    icon:'/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/srtm450.png',
    name:'SRTM - 450m'
  },
  {layer: mb_google_traffic,
    icon: '/home/dpv-sigiv/git_sigiv/git_workspace/repo_dev_old/L.switchBasemap-master/img/google-traffic.png',
    name: 'GOOGLE: Traffic'
  }
], { position: 'topright' }).addTo(visor);

//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  CAPAS - WMS   ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// Zonas WMS   
var wmszonas = L.tileLayer.wms('http://10.7.20.214:8080/geoserver/sigiv/wms?', {
  layers: 'zonas',
  format: 'image/png',
	transparent: true,
  opacity: 0.5,
	version: '1.3.0',
  style: 'zonas_style3',
  tiled: false, // ---> tiled y tilesize: parámetros para manejar etiquetas, pero si los sacamos aparecen en default porque estan en el SLD
  tileSize: L.point(2000, 1800) // ---> ancho y altura
})//.addTo(visor);  // ---> Al comentar permito que no se active al inicar el mapa
// Departamentos WMS 
var wmsdepartamentos = L.tileLayer.wms('http://10.7.20.214:8080/geoserver/sigiv/wms?', {
  layers: 'departamentos',
  format: 'image/png',
	transparent: true,
  opacity: 0.3,
	version: '1.3.0',
  style: 'departamentos_style2'
})//.addTo(visor);   // ---> Al descomentar permito que se active al inicar el mapa
// Distritos WMS 
var wmsdistritos = L.tileLayer.wms('http://10.7.20.214:8080/geoserver/sigiv/wms?', {
  layers: 'distritos',
  format: 'image/png',
	transparent: true,
	version: '1.3.0',
  style: 'distritos_style'
	})//.addTo(visor);   // ---> Al descomentar permito que se active al inicar el mapa
// Localidades y Parajes WMS
var wmslocalidades_parajes = L.tileLayer.wms('http://10.7.20.214:8080/geoserver/sigiv/wms?', {
  layers: 'localidades_parajes',
  format: 'image/png',
	transparent: true,
	version: '1.3.0',
  style: 'locaypar_style'
})//.addTo(visor);   // ---> Al descomentar permito que se active al inicar el mapa

//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  CAPAS - WFS   ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

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
        })/*
        .timeLocal(
          ano,
          "data/duration/duration_{year}.json",
          {freq: 'yearly'}
        ).addTo(visor);*/
        layerControl.addOverlay(fetch_transito, "Tránsito"); //---> se agrega la capa al árbol de capas
        fetch_transito.addTo(visor);   // ---> Al descomentar permito que se active al inicar el mapa
    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch: ' + error.message);
    });

    /*let time_layers=L.control.layers({},{}, {autoZIndex:false}).addTo(visor)*/
    
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

.catch(function(error) {
  console.log('Hubo un problema con la petición Fetch: ' + error.message);
});
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

//////////////////////////////////////////////////////////////////////////////// 
////////////////////////////  FUNCIONALIDADES   ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/*////// BOTON CALENDARIO
visor.date=new Date('01/01/2024');
// add the calendar
L.control.datepicker({minDate:'2018-01-01', maxDate:'2024-12-31'}).addTo(visor);*/

////// ESCALA
L.control.scale({
    metric: true, imperial: false, position: 'bottomright'
    /*position: 'bottomright'*/ //---> no funciona, si se activa conflicto (quizas con sidebar)
}).addTo(visor);

////// BOTON FULLSCREEN
var fsControl = L.control.fullscreen({
  position: 'bottomright',
  title: 'Modo pantalla completa',
  titleCancel: 'Salir de modo pantalla completa ',
  forceSeparateButton: true
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
