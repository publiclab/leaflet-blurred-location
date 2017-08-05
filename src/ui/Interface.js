module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.placenameInputId = options.placenameInputId || 'placenameInput'; // the placename as input by the user
    options.placenameDisplayId = options.placenameDisplayId || 'placenameDisplay'; // the placename as will be stored/displaye

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

      if($("#"+options.placenameInputId).val())
        $("#"+options.placenameDisplayId).val($("#"+options.placenameInputId).val());

      else if(result.results[0]) {
        if(options.getPrecision() <=0 ) {
          //Iterates through all locations available, and checks if the type of location is country
          for (i in result.results) {
            if(result.results[i].types.indexOf("country") != -1) {
              //If the type of location is a country assign it to thr input box value
              $("#"+options.placenameDisplayId).val(result.results[i].formatted_address);
            }
          }
        }
        else {
          $("#"+options.placenameDisplayId).val(result.results[0].formatted_address);
        }
      }
      else {
        $("#"+options.placenameDisplayId).val("Location unavailable");
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
