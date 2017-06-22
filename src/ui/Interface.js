module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';

    function panMapWhenInputsChange() {
    var lat = document.getElementById(options.latId);
    var lng = document.getElementById(options.lngId);

    function panIfValue() {
      if(lat.value && lng.value) {
        options.panMap(lat.value, lng.value);
      };
    }

    lat.addEventListener('change', function() {
      panIfValue();
    });
    lng.addEventListener('change', function() {
      panIfValue();
    });
  }

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
  }
}
