import TimeFns from './timeLocal.js' ;
import {feature} from 'topojson-client' ;

/* 

class GeoJSON.FromURL

aka L.GeoJSON.FromURL

inherits L.GeoJSON

Used to load a single image from local storage. 
example
```js
	L.geoJson.fromURL(url,options) ;
```

*/

L.GeoJSON.FromURL = L.GeoJSON.extend({

	_errorJson: { 
		"type": "Feature",
		"geometry": { "type": "Point",  "coordinates": [0, -90] },
		"properties": { "error": "No Data" }
	} ,
	
	initialize(path, options) {

		//fetch the layer and construct the layer, but asynchronous
		this._initPromise = this.fetchJsonPromise(path)
			.catch(()=> {
				return this._errorJson ;
			})
			.then(json => {
				L.GeoJSON.prototype.initialize.call(this,json,options) ;

				json = null ; //explicit release memory
			}) ;
	} ,
	
	fetchJsonPromise(path) {

		this._fetchController = new AbortController() ;

		//fetch the file of interest
		let promise = fetch(path,  {signal: this._fetchController.signal }).
			then(response => response.json() ) 
			
		return promise ;
	},

	addData (data) {
		// to support topojson files, we want to do some pre-processing if it is a topo-json
		var geojson, key;
		if (data.type === "Topology") {
			for (key in data.objects) {
				// if (data.objects.hasOwnProperty(key)) {
				geojson = feature(data, data.objects[key]);
				L.GeoJSON.prototype.addData.call(this, geojson);
				// }
			}
		} else {
			L.GeoJSON.prototype.addData.call(this, data);
		}
		return this;
	} ,

	onAdd(map) {
		// check that the layer has initialized before adding layer.
		this._onAddPromise = this._initPromise
			.then(() => { L.GeoJSON.prototype.onAdd.call(this,map) }) ;

		return this._onAddPromise ;
	},

	onRemove(map) {
		//if we are still fetching, cancel that
		this._fetchController.abort() ;
		// check that the layer has been added before removing.
		this._onAddPromise
			.then(() => { L.GeoJSON.prototype.onRemove.call(this,map) } ) ;
	},

}) 


L.geoJSON.fromURL = function (path, options) {
	return new L.GeoJSON.FromURL(path, options) ;
}
	
/* 
🍂namespace Time Local

🍂class GeoJSON.TimeLocal

aka L.GeoJSON.TimeLocal

inherits L.GeoJSON.FromURL

Load a GeoJSONs file from local storage or a url template, with one file per timestep. 

```js
//Constructor function:
L.geoJSON.timeLocal(
	startDate,
	urlTemplate,
	options
)
```
🍂example
```js
L.geoJSON.timeLocal(
	date,
	"data/duration/duration_{year}.json",
	{
		freq: 'yearly',
	}
).addTo(map)
```
which would show `data/duration/duration_2022.json` on the map if 2022 was the year selected in the calendar
*/
L.GeoJSON.TimeLocal = L.GeoJSON.FromURL.extend({
	
	includes: TimeFns, 
	//🍂option freq: String = 'daily'
	//Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'
	//🍂option dateStr: Function(obj) = None
	// use this to create a custom dateStr var in the urlTemplate
			
	initialize(date, url, options)  {
		
		this.setupTimeLocal( url, options ) ;
		
		L.GeoJSON.FromURL.prototype.initialize.call(
			this,this.localUrl(date),options
		) ;
		
	} ,
	
	onAdd(map) {
		
		this._updatePromise = L.GeoJSON.FromURL.prototype.onAdd.call(this,map) ;

		this._updatePromise.then(() => {
			this.startEventListener(map) ;
		})
		
		this.updateTime(map) ;
		
	} ,
	
	updateTime(dateObj) {

		this._fetchController.abort() ;

		this._updatePromise=Promise.all([
			this._updatePromise.then(this.clearLayers()),
			this.fetchJsonPromise(this.localUrl(dateObj.date))
			.catch((error) => {
				if (error instanceof SyntaxError) {
					console.log(`No ${this._urlTemplate} for this date`) ;
					return this._errorJson ;
				} else { throw error ; } 
			})
			.then(iJson => {
				// grab the levels in this json to help with colouring
				this._levels=[] ;
				for (let i in iJson.features) {
					this._levels[i]=iJson.features[i].properties.z_value ;
				}				
				this.addData(iJson) ;

				iJson = null ; //explicit release memory
				})
			.catch((error) => {
				if (error.name !== 'AbortError')  { throw error ; } 
			})
		])

	} ,

	onRemove(map) {

		this.stopEventListener(map) ;

		this._fetchController.abort() ;

		if (this._levels) this._levels = null ;

		// check that the layer has been added before removing.
		this._updatePromise
			.then(() => {
				L.GeoJSON.FromURL.prototype.onRemove.call(this,map) ;
				this._updatePromise = null ;
			}
			).catch((err)=> {
				if (err.name !== 'AbortError') { // handle abort()
					throw err ;
				}
			}) ;
		
	}
	
})

L.geoJSON.timeLocal = function (date, url, options ) {
	return new L.GeoJSON.TimeLocal(date, url, options ) ;
}