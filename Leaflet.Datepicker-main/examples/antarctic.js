const crs = new L.Proj.CRS('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
    resolutions: [16184,8192, 4096, 2048, 1024, 512, 256],
    origin: [-4194304, 4194304],
    bounds: L.bounds (
    [-5000000, -5000000],
    [5000000, 5000000]
    )
});

var map = L.map('map', {
    crs: crs,
    maxZoom: 5,
    center: [-90, 0],
    zoom: 0,
});

map.date=new Date('01/01/2021') ;
// add the calendar
L.control.datepicker({minDate:'2018-01-01', maxDate:'2021-12-31'}).addTo(map) ;

let layers=L.control.layers({},{}, {autoZIndex:false}).addTo(map)

//sea ice concentrations - daily
layers.addOverlay(
    L.tileLayer.time(
        "https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/{layer}/default/{dateStr}/{tileMatrixSet}/{z}/{y}/{x}.png", 
        //the possibly odd thing here is your time field has to be called 'time' by hardcoding
        {
            zIndex:50,
            layer: "AMSRU2_Sea_Ice_Concentration_12km",
            tileMatrixSet: "1km",
            tileSize: 256, maxNativeZoom:3, minNativeZoom:0,
            format: "image/png",
            transparent: true,
            freq:'daily',
            attribution: "NASA-GIBS",
        }
    ),
    "Sea Ice - Daily - WMTS"
);

layers.addOverlay(
    L.imageOverlay.timeLocal(
        map.date,
        "data/nsidc_sea_ice_conc_{year}_{month}.png",
        [[-39.23, -42.24],[-41.45, 135.0]],
        {
            freq:'monthly',
        }
    ).addTo(map),
    "Sea Ice Conc - Monthly - Image Overlay"
)

layers.addOverlay(
    L.tileLayer.wms.time(
        "https://my.cmems-du.eu/thredds/wms/METOFFICE-GLO-SST-L4-REP-OBS-SST",
        {
            layers: "analysed_sst", 
            styles: "boxfill/occam" ,
            format: "image/png",
            transparent: "true",
            freq: "monthly",
            attribution: "OSTIA",
            tileSize: 256,
            dateStr: (date) => {
                return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-15T12:00:00.000Z` ;
            }, 
            bounds: [[15, -180],[-80, 180]],
        }
    ),
    "Sea Surface Temperature - Monthly - WMS"
)


//coastlines - for reference
L.tileLayer.wms('http://geos.polarview.aq/geoserver/wms', {
    layers:'polarview:coastS10',
    format:'image/png',
    transparent:true,
    attribution:'Polarview'
}).addTo(map);

//graticule - for completeness
L.graticule({
    intervalLat: 10,
    intervalLng: 30,
    latBounds: [-90,-31],
    style:{
        color: "#bababa",
        weight: 1, 
    },
}).addTo(map)