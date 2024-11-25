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


// MAPA CENTRADO EN SANTA FE
var visor = L.map('map',{
  zoomSnap: 0.1,
  zoomControl: false,
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
}).addTo(visor);  // ---> Al comentar permito que no se active al inicar el mapa
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

                ////////////////////////////////////////////////
                ////////////  CAPAS - WFS   ///////////////////
                //////////////////////////////////////////////

//ver script "script_capas_wfs"
