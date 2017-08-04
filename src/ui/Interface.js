module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.selector = options.selector || 'geo_location';
    options.locationText = options.locationText || 'location';

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


  options.onDrag = options.onDrag || function onDrag() {
    function changeVal(result) {

      if($("#"+options.selector).val())
        $("#"+options.locationText).val($("#"+options.selector).val());

      else if(result.results[0]) {
        if(options.getPrecision() <=0 ) {
          //Iterates through all locations available, and checks if the type of location is country
          for (i in result.results) {
            if(result.results[i].types.indexOf("country") != -1) {
              //If the type of location is a country assign it to thr input box value
              $("#"+options.locationText).val(result.results[i].formatted_address);
            }
          }
        }
        else {
          $("#"+options.locationText).val(result.results[0].formatted_address);
        }
      }
      else {
        $("#"+options.locationText).val("Location unavailable");
      }
    }

      options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), changeVal);
  }


  options.map.on('moveend', options.onDrag);

  function updateLatLngInputListeners() {
    $("#"+options.latId).val(options.getLat());
    $("#"+options.lngId).val(options.getLon());
  };

  function enableLatLngInputTruncate() {
    options.map.on('moveend', updateLatLngInputListeners);
  };

  function disableLatLngInputTruncate() {
    options.map.off('moveend', updateLatLngInputListeners);
  };

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    onDrag: options.onDrag,
    updateLatLngInputListeners: updateLatLngInputListeners,
    disableLatLngInputTruncate: disableLatLngInputTruncate,
    enableLatLngInputTruncate: enableLatLngInputTruncate,
  }

}
