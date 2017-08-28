leaflet-blurred-location
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location)

A Leaflet-based HTML interface for selecting a "blurred" or low-resolution location, to preserve privacy. 

Try the demo here: https://publiclab.github.io/leaflet-blurred-location/examples/

## How it works

When "blurring" is enabled (as by default), `leaflet-blurred-location` will truncate the latitude and longitude of the input location to the given `precision` -- which is set based on the zoom level of the displayed map. 

### Precision and zoom

The precision is displayed as a grid overlay, where each grid cell is based on the latitude/longitude degree grid, but subdivided to `precision` number of decimal places. 

So for a `precision` of 2, the grid has `0.01` degree spacing. For `precision` of 5, it has `0.00001` degree spacing. 

Precision `1` would look like this:

```
__________________________________________
|72.0,44.3           |72.0,44.4           |
|                    |                    |
|                    |                    |
|                    |                    |
-------------------------------------------
|72.1,44.3           |72.1,44.4           |
|                    |                    |
|                    |                    |
|                    |                    |
-------------------------------------------
```

Zooming into the upper left square would then break that up into 10 subdivisions from `72.00` to `72.09` and `44.30` to `44.39`, and increase the precision by 1. 

We've tried to get the actual map zoom level to correlate reasonably to the value of `precision`, on [these lines of code](https://github.com/publiclab/leaflet-blurred-location/blob/master/src/core/gridSystem.js#L12-L17) to best display grids on varying screen sizes and zoom levels. 

We're open to variations on this if you have suggestions; please [open an issue](https://github.com/publiclab/leaflet-blurred-location/issues/new)!. 

****

## Setting up leaflet-blurred-location

To set up the library first clone this repo to your local environment; then run 'npm install' to install all the neccessary packages required. Open `examples/index.html` to look at the preview of the library.

There is a simpler version as well which is a simple location entry namely `examples/simple.html`, you can view an online demo at https://mridulnagpal.github.io/leaflet-blurred-location/examples/simple.html

## Creating a map object

To create a new object just call the constructor 'BlurredLocation' as shown in the following example:
(There must a div with id="map" in your html to hold the object)

```js
// this "constructs" an instance of the library:
var location = new BlurredLocation({
  lat: 41.01,
  lon: -85.66
});

location.getLat(); // should return 41.01
location.getLon(); // should return -85.66
```

****

## Options

### Basic

| Option         | Use                                   | Default                  |
|----------------|---------------------------------------|--------------------------|
| location       | the initial co-ordinates of the map   | `{ lat: 1.0, lon: 1.0 }` |
| zoom           | the initial zoom of the map           | 6                        |
| mapID          | the ID of the map container           | `'map'`                  |
| pixels         | the pixel size to calculate precision | `400`                    |

### Interface options

| Option         | Use                         | Default |
|----------------|-----------------------------|---------|
| latId          | the input to set latitude   | `'lat'` |
| lngId          | the input to set longitude  | `'lng'` |

## API

| Methods                      | Use                | Usage (Example)   |
|------------------------------|--------------------|-------------------|
| `location.getLat()`          | get the current latitude of map center | returns a decimal |
| `location.getLon()`          | get the current latitude of map center | returns a decimal |
| `location.goTo(lat, lon, zoom)` | three parameters: latitude, longitude and zoom, set the map center | `location.goTo(44.51, -89.99, 13)` sets center of map to `44.51, -89.99` with `zoom` set as `13` |
| `location.setBlurred(boolean)`   | Enables "location blurring" to obscure the location: the location will be obscured to the smallest latitude/longitude grid square which the map center falls in |
| `location.getFullLat()`   | Returns non-truncated latitude of map center, regardless of precision | `location.getFullLat()` returns decimal |
| `location.getFullLon()` | Returns non-truncated longitude of map center, regardless of precision | `location.getFullLon()` returns decimal |
| `location.getPrecision()` | Returns precision of degrees -- represented by width or height of one grid cell. Returns an integer which represents the number of decimal places occupied by one cell. For instance, a precision of 1 will mean 0.1 degrees per cell, 2 will mean 0.01 degrees, and so on | `location.getPrecision()` This would return the precision of the map at the current zoom level. |
| `location.getPlacenameFromCoordinates()` | Returns human-readable location name of a specific latitude and longitude. This would take in 3 arguments namely latitude, longitude and a callback function which is called on success and would return address of the location pinpointed by those co-ordinates| `location.getPlacenameFromCoordinates(43, 43, function(result) { console.log(result) }` This would return the output to the console |
| `location.map` | Used to access the Leaflet object | |
| `location.setZoomByPrecision()` | Zooms map to the given precision. | `location.setZoomByPrecision(2)` This would zoom the map so that the precision of map becomes 2, and each grid square is `0.01` degrees wide and tall. |

## Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
| **'Blurred' location input** | Your exact location won't be posted, only the grid square it falls within will be shown. Zoom out to make it harder to tell exactly where your location is. Drag the map to change your location and the amount of blurring. |
| **'Blurred' human-readable location** | Current location of the map will be reverse geocoded and the name of the location will be displayed. The extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc. |
| **Truncated co-ordinates** | You may enter co-ordinates in the input boxes, string search or pan the map to a certain location and the co-ordinate input boxes will be truncated with the current location of the map with appropiate precision as well. |
| **Browser-based geolocation** | Uses the browser geolocation API to request location and pan the map there. |

## Testing

Automated tests are an essential way to ensure that new changes don't break existing functionality, and can help you be confident that your code is ready to be merged in. We use Jasmine for testing: https://jasmine.github.io/2.4/introduction.html

To run tests, open /test.html in a browser. If you have phantomjs installed, you can run `grunt jasmine` to run tests on the commandline.

You can find the installation instructions for phantomjs in its official [build documentation](http://phantomjs.org/build.html). For Ubuntu/debian based system you can follow [these instructions](https://gist.github.com/julionc/7476620) or use the script mentioned there.

To add new tests, edit the `*_spec.js` files in `/spec/javascripts/`.

