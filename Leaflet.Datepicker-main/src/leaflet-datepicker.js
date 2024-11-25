/*
🍂namespace L
[![npm](https://img.shields.io/npm/v/leaflet-datepicker.svg)](https://www.npmjs.com/package/leaflet-datepicker)
[![github CI](https://github.com/anton-seaice/Leaflet.Datepicker/actions/workflows/node.js.yml/badge.svg)](https://github.com/anton-seaice/Leaflet.Datepicker/actions)

A calendar plugin for leaflet maps. The plugin allows you to browse through remote sensing datasets that vary over time. You add a datepicker to your [Leaflet](https://leafletjs.com/) web-map to give end-user control over the date of the data displayed.

There are two main elements needed: 

1:- the date picker, to select the date and 

2:- extensions to the leaflet layers types so that information is updated when the date is changed.

Click the images for examples:

[![Antarctic Example](./examples/antarcticScreenshot.jpg)](https://anton-seaice.github.io/Leaflet.Datepicker/examples/antarctic.html)
[![Simple Example](./examples/simpleScreenshot.jpg)](https://anton-seaice.github.io/Leaflet.Datepicker/examples/simple.html)]

This plugin uses the [Vue Datepicker](https://vue3datepicker.com/), but you do not need to be using Vue. It is standalone.

🍂example
Simple install:
```js
add to your html file
<script src="https://unpkg.com/leaflet-datepicker/dist/leaflet-datepicker.umd.cjs" integrity="..." crossorigin=""></script>
<script src="https://unpkg.com/leaflet-datepicker/dist/style.css" integrity="..." crossorigin=""></script>
```
(Best practice is to include integrity keys, e.g. from https://www.srihash.org)

if you are using npm, install leaflet-datepicker
```js
import 'leaflet-datepicker'
import '../node_modules/leaflet-calendar/dist/style.css'
```

if you are using vite, also install @vitejs/plugin-vue (as dev dependency). Add the vue plugin in vite.config.js:
```js
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  ... //the rest of your config
```

*/

import './leaflet-datepicker.css'
//The datepicker element
import './L.Control.Datepicker.js'

/*

TimeLocal is a folder of extensions to leaflet layers to add time functionality and handle local files. They are all imported by L.Layer.TimeLocal.js

For .timeLocal layers, urls are formed by basePath+dateString+fileExtension

dateString can be formed by the result from a function(Date) passed to the dateStr option, or by the default:

```
switch(this.options.freq) {
    case 'yearly' :
        return this._basePath+year+this._fileExtension ;
    case 'monthly' :
        return this._basePath+year+'_'+month+this._fileExtension ;
    case 'monthly mean' :
        return this._basePath+month+this._fileExtension ;
    default : //daily
        return this._basePath+year+'_'+month+'_'+day+this._fileExtension ;
}
```

*/

import './timeLocal/L.ImageOverlay.TimeLocal.js' ;

import './timeLocal/L.TileLayer.Time.js' ;

import './timeLocal/L.GeoJSON.TimeLocal.js' ;
