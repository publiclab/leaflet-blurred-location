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

      $(lat).change(panIfValue);
      $(lng).change(panIfValue);
  }

  panMapWhenInputsChange();

  function obscureLocation() {
    setBlurred(document.getElementById("obscureLocation").checked);
  }


  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    obscureLocation: obscureLocation,
  }

}
