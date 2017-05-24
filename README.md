leaflet-blurred-location
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location)

**This is a working draft; the project will be working towards an initial v0.0.1 release in coming weeks**

leaflet-blurred-location provides friendly interfaces for:

* Marking your location on a map
* Tagging additional location with marked places

## Setting up leaflet-blurred-location

To set up the library first clone this repo to your local after that run 'npm install' to install all the neccessary packages required. Then open examples/index.html to look at the preview of the library.

## Creating a map object

To create a new object just call the constructor 'BlurredLocation' as shown in the following example:
(There must a div with id="map" in your html to hold the object)

// this "constructs" an instance of the library:
var object = new BlurredLocation({
  lat: 41.01,
  lon: -85.66
});

object.getLat(); // should return 41.01
object.getLon(); // should return -85.66

## Design process

You can try a very early, rough prototype here:

https://mridulnagpal.github.io/leaflet-blurred-location/examples/


## Testing

Automated tests are an essential way to ensure that new changes don't break existing functionality, and can help you be confident that your code is ready to be merged in. We use Jasmine for testing: https://jasmine.github.io/2.4/introduction.html

To run tests, open /test.html in a browser. If you have phantomjs installed, you can run `grunt jasmine` to run tests on the commandline.

You can find the installation instructions for phantomjs in its official [build documentation](http://phantomjs.org/build.html). For Ubuntu/debian based system you can follow [these instructions](https://gist.github.com/julionc/7476620) or use the script mentioned there.

To add new tests, edit the `*_spec.js` files in `/spec/javascripts/`.

## Options

| Methods | Use | Usage (Example)|
|---------|-----|----------------|
|getLat   | Used to get the current latitude of the center of the map. | blurredLocation.getLat() //This would return the value in numerics |
|getLon   | Used to get the current latitude of the center of the map. | blurredLocation.getLon() //This would return the value in numerics |
|goTo     | Takes in three parameters, namely latitude, longitude and zoom. Will set the center of map to co-ordinates input.| blurredLocation.goTo(44.51, -89.99, 13) //Will set center of map to (44.51,-89.99) with zoom set as 13 |
