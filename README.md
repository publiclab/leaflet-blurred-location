leaflet-blurred-location
====

leaflet-blurred-location provides friendly interfaces for:

* Marking your location on a map
* Tagging additional location with marked places

## Design process

You can try a very early, rough prototype here: 

https://mridulnagpal.github.io/leaflet-blurred-location/examples/


## Testing

Automated tests are an essential way to ensure that new changes don't break existing functionality, and can help you be confident that your code is ready to be merged in. We use Jasmine for testing: https://jasmine.github.io/2.4/introduction.html 

To run tests, open /test.html in a browser. If you have phantomjs installed, you can run `grunt jasmine` to run tests on the commandline.

You can find the installation instructions for phantomjs in its official [build documentation](http://phantomjs.org/build.html). For Ubuntu/debian based system you can follow [these instructions](https://gist.github.com/julionc/7476620) or use the script mentioned there.

To add new tests, edit the `*_spec.js` files in `/spec/javascripts/`. 
