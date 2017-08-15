leaflet-blurred-location
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location)

**This is a working draft; the project will be working towards an initial v0.0.1 release in coming weeks**

leaflet-blurred-location provides friendly interfaces for:

* Marking your location on a map
* Tagging additional location with marked places

## Setting up leaflet-blurred-location

To set up the library first clone this repo to your local after that run 'npm install' to install all the neccessary packages required. Then open `examples/index.html` to look at the preview of the library.
There is a simpler version as well which is a simple location entry namely `examples/simple.html`, you can view all there files online using gh-pages of the repo, just follow this link https://mridulnagpal.github.io/leaflet-blurred-location/examples/simple.html

## Creating a map object

To create a new object just call the constructor 'BlurredLocation' as shown in the following example:
(There must a div with id="map" in your html to hold the object)

```js
// this "constructs" an instance of the library:
var object = new BlurredLocation({
  lat: 41.01,
  lon: -85.66
});

object.getLat(); // should return 41.01
object.getLon(); // should return -85.66
```

## Design process

You can try a very early, rough prototype here:

https://publiclab.github.io/leaflet-blurred-location/examples/


## Testing

Automated tests are an essential way to ensure that new changes don't break existing functionality, and can help you be confident that your code is ready to be merged in. We use Jasmine for testing: https://jasmine.github.io/2.4/introduction.html

To run tests, open /test.html in a browser. If you have phantomjs installed, you can run `grunt jasmine` to run tests on the commandline.

You can find the installation instructions for phantomjs in its official [build documentation](http://phantomjs.org/build.html). For Ubuntu/debian based system you can follow [these instructions](https://gist.github.com/julionc/7476620) or use the script mentioned there.

To add new tests, edit the `*_spec.js` files in `/spec/javascripts/`.

## Options

### Basic

| Option         | Use                | Usage (Default)                  |
|----------------|--------------------|----------------------------------|
| location       |To set the initial co-ordinates of the map|`options.location = {lat:1.0, lon:1.0}`|
|zoom            |To set the initial zoom of the map|`options.zoom = 6`|
|mapID           |To set the ID of the map container|`options.mapID = 'map'`|
|pixels          |To set the pixel size to calculate precision|`options.pixels = 400`|

### Interface

| Option         | Use                | Usage (Default)                  |
|----------------|--------------------|----------------------------------|
| latId          |To set the input listener for latitude|`options.InterfaceOptions.latId = 'lat'`|
| lngId          |To set the input listener for longitude|`options.InterfaceOptions.lngId = 'lng'`|




## API

| Methods         | Use                | Usage (Example)|
|-----------------|--------------------|----------------|
|`getLat()`       | Used to get the current latitude of the center of the map.|  blurredLocation.getLat() //This would return the value in numerics|
|`getLon()`       | Used to get the current latitude of the center of the map|blurredLocation.getLon() //This would return the value in numerics|
|`goTo(lat, lon, zoom)`         | Takes in three parameters, namely latitude, longitude and zoom. Will set the center of map to co-ordinates input.| `blurredLocation.goTo(44.51, -89.99, 13)` Will set center of map to (44.51,-89.99) with zoom set as 13|
|`setBlurred(boolean)`   | Used to enable "location blurring" to obscure the location being input. The location will be obscured to the smallest latitude/longitude grid square which the center on the map falls within |
|`getFullLat()`   | Used to get the full latitude of the center of the map, regardless what the precision is| `blurredLocation.getFullLat()`  This would return the full latitude value as a floating numeric|
|`getFullLon()`   | Used to get the full longitude of the center of the map, regardless what the precision is| `blurredLocation.getFullLon()`  This would return the full longitude value as a floating numeric|
|`getPrecision()` | Used to get the precision of degrees currently occupied by one cell of the grid. This would return an integer which represents the number of decimal places occupied by a cell. For instance, a precision of 1 will mean 0.1 degrees per cell, 2 will mean 0.01 degrees, and so on | `blurredLocation.getPrecision()` This would return the precision of the map at the current zoom level |
| `getPlacenameFromCoordinates()`| Used to get the human-readable location name in text of specific latitude and longitude. This would take in 3 arguments namely latitude, longitude and a callback function which is called on success and would return address of the location pinpointed by those co-ordinates| `blurredLocation.getPlacenameFromCoordinates(43,43,function(result) {console.log(result);} // This would return the output to the console`|
|map |Used to access the leaflet map element to perform leaflet commands on it| blurredLocation.map //This would return the leaflet map element|
|`setZoomByPrecision()` | Used to zoom map to the given precision. This would pan the map to adjust the specified precision.| `blurredLocation.setZoomByPrecision(2)` This would zoom the map so that the precision of map becomes 2 |

## Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
|Geo Location     |Current location of the map will be reverse geocoded and the name of the location will be displayed. The extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc.|
|Truncated Co-ordinates | You may enter co-ordinates in the input boxes, string search or pan the map to a certain location and the co-ordinate input boxes will be truncated with the current location of the map with appropiate precision as well.|
|Privacy System | Your exact location won't be posted, only the grid square it falls within will be shown. Zoom out to make it harder to tell exactly where your location is. Drag the map to change your location and the amount of blurring.|
|Get my location |This will automatically track your location using the IP of your browser and pan the map to the same|
