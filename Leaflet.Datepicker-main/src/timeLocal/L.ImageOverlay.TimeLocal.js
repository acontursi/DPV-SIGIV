import TimeLocal from './timeLocal.js' ;

/* 
🍂namespace Time Local
🍂class ImageOverlay.TimeLocal
inherits L.ImageOverlay

Load an  image from local storage based on the specified date. 

```js
//Constructor function:
L.imageOverlay.timeLocal(
	startDate,
	urlTemplate,
	bounds,
	options
)
```
🍂example
```js

L.imageOverlay.timeLocal(
	map.date,
	"tracker_data/chlor_conc_anoms/occci_chlor_conc_anoms_{year}_{month}.png", 
	[[-39.23, -42.24],[-41.45, 135.0]],
	{
		freq: 'monthly',
		alt: 'No data for Chlorophyll Conc for this month'
	}
) 
```

Bounds is unchanged from L.ImageOverlay

*/

L.ImageOverlay.TimeLocal=L.ImageOverlay.extend({
		
	includes: TimeLocal ,
	//🍂option freq: String = 'daily'
	//Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'
	//🍂option dateStr: Function(obj) = None
	//function to create a custom dateStr var to use in the url template. 
		
	initialize(time, url, bounds, options ) { 
	// (date, String, String, LatLngBounds, Object)
			
		this.setupTimeLocal(
			url, options
		) ;
				
		// run the initialize function from the super class
		L.ImageOverlay.prototype.initialize.call(
			this, this.localUrl(time), bounds, options
		) ;
	},
	
	onAdd(map) {
		
		this.startEventListener(map) ;
		
		this.setUrl(this.localUrl(map.date)) ;
		
		L.ImageOverlay.prototype.onAdd.call(this,map) ;
		
	} ,
	
	onRemove(map) {
		
		this.stopEventListener(map) ;
		
		L.ImageOverlay.prototype.onRemove.call(this,map) ;
	},
	
	updateTime(eventValue) {
		//change URL and redraw for the new time
		this.setUrl(this.localUrl(eventValue.date)) ;
	},
	
})

L.imageOverlay.timeLocal = function (time, url, bounds, options) {
	return new L.ImageOverlay.TimeLocal(time, url, bounds, options) ;
}
