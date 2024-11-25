import {createApp, ref} from 'vue' ;
import Datepicker from './Datepicker.vue' ;

/* 
🍂namespace L
🍂class L.Control.Datepicker
Inherits L.Control

This creates a leaflet 'control' with a datepicker inside it. The datepicker can be daily, monthly or annual. This changes the value of map.date, when the calendar is changes, and also emits the date used a "dayChanged", "monthChanged" and or "yearChanged" event.

The frequency of the datepicker is set by the 'freq' option for each layer added to the map. The highest frequency 'freq' option set for layers added to the map is used as the date picker. e.g:
- If no layers have the 'freq' option, then the datepicker does not show (but there is an empty space in allocated for it)
- If one layer has the freq option set as 'yearly', then a calendar with years only is shown
- If one layer has the 'monthly' option, and one has the 'yearly' option, then the monthly calendar is shown
- If one layer has the 'daily' option set, and two layers have 'monthly', and three have 'yearly', the daily calendar is shown.

The date is stored as a date object in map.date. The datepicker can by styled using the 'date-control' css element, and the #datepicker css id.

The datepicker is used with the TimeLocal extensions to Leaflet layers.

🍂example
```js

map.date=new Date() ;

L.control.datepicker().addTo(map) ;

```

There are lots of options in the vue-datepicker which are not-supported by the plugin (but it would be easy enough to add them). For example there is no support of date-ranges, time of day, multi-calendars etc

*/

L.Control.Datepicker=L.Control.extend({
		
	options: {
		//🍂option position: String = 'topright'
		//'topright'|'topleft'|'bottomleft'|'bottomright'
		//
		// which corner to show the datepicker on the map.
		position: 'topright',
		//🍂option frequency: String = 'monthly'
		// 'daily'|'monthly'|'yearly'|'none'
		//
		//which frequency to start the datepicker on. This is changed later by the freq option for each layer added.
		frequency: 'monthly',
		//🍂option minDate: [String|Date object] = '1980'
		//the first date you can pick in the datepicker, default 1980
		minDate: '1980' ,
		//🍂option maxDate: [String|Date object] = yesterday
		//the last date you can pick in the datepicker,		
		maxDate: null
	} ,

	onAdd(map) {

		function dateChange(newDate) {
			//determine if the month or year has also changed, and fire events for each case
			console.log(`date change ${newDate}`)  ;
			if (newDate!=map.date) {map.fire('dayChanged', {date:newDate}) ; }
			if (newDate.getMonth()!=map.date.getMonth() || newDate.getFullYear()!=map.date.getFullYear()) { map.fire('monthChanged', {date:newDate}) ;}
			if (newDate.getFullYear()!=map.date.getFullYear()) { map.fire('yearChanged', {date:newDate}) ; }
			map.date=newDate ;
		} 
		
		this._container = L.DomUtil.create('div', 'date-control leaflet-control') ;
		map._dateFreq = ref(this.options.frequency) ;

		if (!Date.prototype.isPrototypeOf.call(Date.prototype,map.date)) {
			console.error("You need to define map.date as a Date object before creating the datepicker") ;
		} else {

			//mount the vue app in it
			this._app=createApp(Datepicker, {
				date: ref(map.date) ,
				freq: map._dateFreq , 
				onDateChange:dateChange ,
				minDate: this.options.minDate ,
				maxDate: this.options.maxDate
			}).mount(this._container);

			// set up an event listener for when an layer is added
			map.on('layeradd', this._layerChange, map) ;
			map.on('layerremove', this._layerChange, map) ;
			map.on('setDate', (newDate) => { 
				this._app._props.date.value=newDate.date ;
			})
			
		}
			return this._container ;
	},
	
	onRemove(map) {

		this._app=null ;

		L.DomUtil.remove(this._container) ;
		
		map.off('layeradd', this._layerChange) ;
		map.off('layerremove', this._layerChange,) ;
		
	},
	
	_layerChange(event) {
		// if the layer has a freq, then check if the date picker is correct still
		// this function needs to be run with map scope for these to be accessible outside this object.

		if (event.layer.options.freq) {

			let freqsList=[];
			this.eachLayer( (l) => 
					{ freqsList.push(l.options.freq) ; }
			) ;
			
			if (freqsList.includes('daily')) {
				this._dateFreq.value = 'daily' ;
			} else if (freqsList.includes('monthly') | freqsList.includes('monthly mean')) {
				this._dateFreq.value = 'monthly' ;
			} else if (freqsList.includes('yearly')) {
				this._dateFreq.value = 'yearly' ;
			} else {
				this._dateFreq.value = 'none' ;
			}  
		} 
	} ,
})


L.control.datepicker=function(options) {
	return new L.Control.Datepicker(options) 
}
