# Leafdoc-generated API reference

## L

<p><a href="https://www.npmjs.com/package/leaflet-datepicker"><img src="https://img.shields.io/npm/v/leaflet-datepicker.svg" alt="npm"></a>
<a href="https://github.com/anton-seaice/Leaflet.Datepicker/actions"><img src="https://github.com/anton-seaice/Leaflet.Datepicker/actions/workflows/node.js.yml/badge.svg" alt="github CI"></a></p>
<p>A calendar plugin for leaflet maps. The plugin allows you to browse through remote sensing datasets that vary over time. You add a datepicker to your <a href="https://leafletjs.com/">Leaflet</a> web-map to give end-user control over the date of the data displayed.</p>
<p>There are two main elements needed:</p>
<p>1:- the date picker, to select the date and</p>
<p>2:- extensions to the leaflet layers types so that information is updated when the date is changed.</p>
<p>Click the images for examples:</p>
<p><a href="https://anton-seaice.github.io/Leaflet.Datepicker/examples/antarctic.html"><img src="./examples/antarcticScreenshot.jpg" alt="Antarctic Example"></a>
<a href="https://anton-seaice.github.io/Leaflet.Datepicker/examples/simple.html"><img src="./examples/simpleScreenshot.jpg" alt="Simple Example"></a>]</p>
<p>This plugin uses the <a href="https://vue3datepicker.com/">Vue Datepicker</a>, but you do not need to be using Vue. It is standalone.</p>


### Usage example







<p>Simple install:</p>
<pre><code class="language-js">add to your html file
&lt;script src=&quot;https://unpkg.com/leaflet-datepicker/dist/leaflet-datepicker.umd.cjs&quot; integrity=&quot;...&quot; crossorigin=&quot;&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;https://unpkg.com/leaflet-datepicker/dist/style.css&quot; integrity=&quot;...&quot; crossorigin=&quot;&quot;&gt;&lt;/script&gt;
</code></pre>
<p>(Best practice is to include integrity keys, e.g. from https://www.srihash.org)</p>
<p>if you are using npm, install leaflet-datepicker</p>
<pre><code class="language-js">import 'leaflet-datepicker'
import '../node_modules/leaflet-calendar/dist/style.css'
</code></pre>
<p>if you are using vite, also install @vitejs/plugin-vue (as dev dependency). Add the vue plugin in vite.config.js:</p>
<pre><code class="language-js">import vue from '@vitejs/plugin-vue'
export default defineConfig({
 plugins: [vue()],
 ... //the rest of your config
</code></pre>







## L.Control.Datepicker

<p>Inherits L.Control</p>
<p>This creates a leaflet 'control' with a datepicker inside it. The datepicker can be daily, monthly or annual. This changes the value of map.date, when the calendar is changes, and also emits the date used a &quot;dayChanged&quot;, &quot;monthChanged&quot; and or &quot;yearChanged&quot; event.</p>
<p>The frequency of the datepicker is set by the 'freq' option for each layer added to the map. The highest frequency 'freq' option set for layers added to the map is used as the date picker. e.g:</p>
<ul>
<li>If no layers have the 'freq' option, then the datepicker does not show (but there is an empty space in allocated for it)</li>
<li>If one layer has the freq option set as 'yearly', then a calendar with years only is shown</li>
<li>If one layer has the 'monthly' option, and one has the 'yearly' option, then the monthly calendar is shown</li>
<li>If one layer has the 'daily' option set, and two layers have 'monthly', and three have 'yearly', the daily calendar is shown.</li>
</ul>
<p>The date is stored as a date object in map.date. The datepicker can by styled using the 'date-control' css element, and the #datepicker css id.</p>
<p>The datepicker is used with the TimeLocal extensions to Leaflet layers.</p>


### Usage example







<pre><code class="language-js">
map.date=new Date() ;

L.control.datepicker().addTo(map) ;

</code></pre>
<p>There are lots of options in the vue-datepicker which are not-supported by the plugin (but it would be easy enough to add them). For example there is no support of date-ranges, time of day, multi-calendars etc</p>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='l-control-datepicker-position'>
		<td><code><b>position</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;topright&#x27;</code></td>
		<td>'topright'|'topleft'|'bottomleft'|'bottomright'
<p>which corner to show the datepicker on the map.</p></td>
	</tr>
	<tr id='l-control-datepicker-frequency'>
		<td><code><b>frequency</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;monthly&#x27;</code></td>
		<td>'daily'|'monthly'|'yearly'|'none'
<p>which frequency to start the datepicker on. This is changed later by the freq option for each layer added.</p></td>
	</tr>
	<tr id='l-control-datepicker-mindate'>
		<td><code><b>minDate</b></code></td>
		<td><code>[String|Date object]</code>
		<td><code>&#x27;1980&#x27;</code></td>
		<td>the first date you can pick in the datepicker, default 1980</td>
	</tr>
	<tr id='l-control-datepicker-maxdate'>
		<td><code><b>maxDate</b></code></td>
		<td><code>[String|Date object]</code>
		<td><code>yesterday</code></td>
		<td>the last date you can pick in the datepicker,</td>
	</tr>
</tbody></table>





## Time Local

<p>These are the layers types which are supported and then change when the date on the map is change.</p>
<p>First create map.date and add the datepicker control, then you can add these layers to your javascript.</p>
<p>Layers from local files have urls formed with a url template, using keywords surrounded by {}.</p>
<p>The allowed keywords are :</p>
<ul>
<li>{year}: four digit year (e.g. would be replace with 2022 if this is the year selected in the calendar)</li>
<li>{month}: 1/2 digit month as a number (e.g. would shown 1 for Jan, and 10 for October)</li>
<li>{day}: 1/2 digit day as a number (e.g. would show 1 for the 1st and 30 for the 30th)</li>
<li>{dateStr}: returned from this.options.dateStr(obj) function. Where obj contains a date object and a day,month and year strings.
e.g.
<code>dateStr:(obj) =&gt; { return obj.date.toISOString()} </code>
would let us use a {dateStr} template var in the url,  which in turn would return the data in <code>2023-04-20T04:30:06.608Z</code> format</li>
</ul>
<p>Look at the examples for each layer type below.</p>



## GeoJSON.TimeLocal

<p>aka L.GeoJSON.TimeLocal</p>
<p>inherits L.GeoJSON.FromURL</p>
<p>Load a GeoJSONs file from local storage or a url template, with one file per timestep.</p>
<pre><code class="language-js">//Constructor function:
L.geoJSON.timeLocal(
	startDate,
	urlTemplate,
	options
)
</code></pre>


### Usage example







<pre><code class="language-js">L.geoJSON.timeLocal(
	date,
	&quot;data/duration/duration_{year}.json&quot;,
	{
		freq: 'yearly',
	}
).addTo(map)
</code></pre>
<p>which would show <code>data/duration/duration_2022.json</code> on the map if 2022 was the year selected in the calendar</p>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='geojson-timelocal-freq'>
		<td><code><b>freq</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;daily&#x27;</code></td>
		<td>Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'</td>
	</tr>
	<tr id='geojson-timelocal-datestr'>
		<td><code><b>dateStr</b></code></td>
		<td><code>Function(obj)</code>
		<td><code>None</code></td>
		<td>use this to create a custom dateStr var in the urlTemplate</td>
	</tr>
</tbody></table>





## ImageOverlay.TimeLocal

<p>inherits L.ImageOverlay</p>
<p>Load an  image from local storage based on the specified date.</p>
<pre><code class="language-js">//Constructor function:
L.imageOverlay.timeLocal(
	startDate,
	urlTemplate,
	bounds,
	options
)
</code></pre>


### Usage example







<pre><code class="language-js">
L.imageOverlay.timeLocal(
	map.date,
	&quot;tracker_data/chlor_conc_anoms/occci_chlor_conc_anoms_{year}_{month}.png&quot;, 
	[[-39.23, -42.24],[-41.45, 135.0]],
	{
		freq: 'monthly',
		alt: 'No data for Chlorophyll Conc for this month'
	}
) 
</code></pre>
<p>Bounds is unchanged from L.ImageOverlay</p>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='imageoverlay-timelocal-freq'>
		<td><code><b>freq</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;daily&#x27;</code></td>
		<td>Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'</td>
	</tr>
	<tr id='imageoverlay-timelocal-datestr'>
		<td><code><b>dateStr</b></code></td>
		<td><code>Function(obj)</code>
		<td><code>None</code></td>
		<td>function to create a custom dateStr var to use in the url template.</td>
	</tr>
</tbody></table>





## TileLayer.Time

<p>inherits L.TileLayer</p>
<p>Used to load a single image from web (TMS server) based on the specified time. Url must include <code>{time}</code>.</p>
<p>Other options are inherited from L.TileLayer</p>


### Usage example







<pre><code class="language-js">L.tileLayer.time(
	&quot;https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png&quot;, 
	{
		layer: &quot;AMSRU2_Sea_Ice_Concentration_12km&quot;,
		tileMatrixSet: &quot;1km&quot;,
		tileSize: 256,
		format: &quot;image/png&quot;,
		transparent: true,
		freq:'daily',
		attribution: &quot;&lt;a href='https://seaice.uni-bremen.de/sea-ice-concentration/amsre-amsr2/'&gt;AMSR2&lt;/a&gt;&quot;,
	}
)
</code></pre>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='tilelayer-time-freq'>
		<td><code><b>freq</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;daily&#x27;</code></td>
		<td>Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'</td>
	</tr>
	<tr id='tilelayer-time-datestr'>
		<td><code><b>dateStr</b></code></td>
		<td><code>Function(date)</code>
		<td><code>returns YY-MM-DD</code></td>
		<td>you might need to tweak it to suit the format required by the server</td>
	</tr>
</tbody></table>





## TileLayer.WMS.Time

<p>Inherits L.TileLayer</p>
<p>Used to load a WMS from web based on the specified time. Url must include <code>{dateStr}</code></p>


### Usage example







<pre><code class="language-js">L.tileLayer.wms.time(
       &quot;https://my.cmems-du.eu/thredds/wms/METOFFICE-GLO-SST-L4-REP-OBS-SST&quot;,
       {
           layers: &quot;analysed_sst&quot;, 
           styles: &quot;boxfill/occam&quot; ,
           format: &quot;image/png&quot;,
           transparent: &quot;true&quot;,
           freq: &quot;monthly&quot;,
           attribution: &quot;OSTIA&quot;,
           tileSize: 256,
           dateStr: (date) =&gt; {
               return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-15T12:00:00.000Z` ; //custom date format
           }, 
           bounds: [[15, -180],[-80, 180]],
       }
   ),
</code></pre>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='tilelayer-wms-time-freq'>
		<td><code><b>freq</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;daily&#x27;</code></td>
		<td>Frequency of steps between data in this data set. Options are 'daily','monthly','yearly'</td>
	</tr>
	<tr id='tilelayer-wms-time-datestr'>
		<td><code><b>dateStr</b></code></td>
		<td><code>Function(date)</code>
		<td><code>returns YYYY-MM-DDTHH:mm:ss.sssZ</code></td>
		<td>default date format is Zulu time, as this is more common for WMS servers</td>
	</tr>
</tbody></table>






