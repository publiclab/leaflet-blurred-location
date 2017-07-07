module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.selector = options.selector || 'geo_location'

    function panMapWhenInputsChange() {
      var lat = document.getElementById(options.latId);
      var lng = document.getElementById(options.lngId);

      function panIfValue() {
        if(lat.value && lng.value) {
          options.panMap(lat.value, lng.value);
        };
      }

      $(lat).change(panIfValue);
      $(lng).change(panIfValue);
  }

  panMapWhenInputsChange();

  function panMapToGeocodedLocation() {
    var input = document.getElementById(options.selector);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        options.geocode(str);
      }, 10);
    });
  };

  panMapToGeocodedLocation();

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
  }

}
