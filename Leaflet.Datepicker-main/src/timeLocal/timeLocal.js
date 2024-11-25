/*
🍂namespace Time Local
These are the layers types which are supported and then change when the date on the map is change.

First create map.date and add the datepicker control, then you can add these layers to your javascript.

Layers from local files have urls formed with a url template, using keywords surrounded by {}. 

The allowed keywords are :
- {year}: four digit year (e.g. would be replace with 2022 if this is the year selected in the calendar)
- {month}: 1/2 digit month as a number (e.g. would shown 1 for Jan, and 10 for October)
- {day}: 1/2 digit day as a number (e.g. would show 1 for the 1st and 30 for the 30th)
- {dateStr}: returned from this.options.dateStr(obj) function. Where obj contains a date object and a day,month and year strings.
e.g. 
```dateStr:(obj) => { return obj.date.toISOString()} ```
would let us use a {dateStr} template var in the url,  which in turn would return the data in `2023-04-20T04:30:06.608Z` format

Look at the examples for each layer type below.

*/

/*

These are functions to 'mixin' with leaflet classes to add time functions with local files

It relies on a date picker being added to the map (e.g. L.Control.Date) 

options are shared with the leaflet class, the ones used here are:
freq: 'daily'/'monthly'/'yearly' to specify how far apart images are in time
dateStr: function(date) : an alternative way of constructing the path

The leaflet extension class needs a 'updateTime: function(event)'  which is triggered when the date of the map is changed 

*/

export const TimeFns={
	startEventListener(map) {
		// start lisiting for date change events from the datePicker.
		switch(this.options.freq) {
			case 'yearly' : 
				map.on('yearChanged', this.updateTime, this) ; 
				break ;
			case 'monthly' :
			case 'monthly mean': 
				map.on('monthChanged', this.updateTime, this) ; 
				break ;
			default : 
				map.on('dayChanged', this.updateTime, this) ; 
		} 
	} ,
	
	stopEventListener(map) {
		switch(this.options.freq) {
			case 'yearly' : 
				map.off('yearChanged', this.updateTime, this) ; 
				break ;
			case 'monthly' :
			case 'monthly mean': 
				map.off('monthChanged', this.updateTime, this) ; 
				break ;
			default : 
				map.off('dayChanged', this.updateTime, this) ; 
		} 
	}
}

var TimeLocal={	

	setupTimeLocal(urlTemplate,options) {	
		this._urlTemplate=String(urlTemplate) ;
		L.setOptions(this, options) ;
	} ,
		
	localUrl(time) {
		/*
		return a url using the template this._urlTemplate and the time provided
		
		allowed vars in the template:
			- date: returned from this.options.dateStr(time)
			- year: four digit year
			- month: 1/2 digit month as a number
			- day: 1/2 digit day as a number
		*/
		
		const d = new Date(time);
		const data = {
			date:d ,
			year: String(d.getFullYear()),
			month: String(d.getMonth() +1) , //zero indexed
			day: String(d.getDate()) ,
		}

		const localUrl = L.Util.template(
			this._urlTemplate, 
			L.Util.extend(data,this.options) //just incase there are other template vars in this.options
		)

		console.debug("New Url: " + localUrl)

		return  localUrl;
	} ,
}

Object.setPrototypeOf(TimeLocal, TimeFns)

export default TimeLocal ;