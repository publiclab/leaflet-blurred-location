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


  options.onDrag = options.onDrag || function onDrag() {
    function changeVal(result) {

      if($("#"+options.selector).val())
        $("#location").val($("#"+options.selector).val());

      else if(result.results[0])
        $("#location").val(result.results[0].formatted_address);
    }

      options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), changeVal);
  }


  options.map.on('moveend', options.onDrag);

  function updateLatLngInputListeners() {
    $("#"+options.latId).val(options.getLat());
    $("#"+options.lngId).val(options.getLon());
  }

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    onDrag: options.onDrag,
    updateLatLngInputListeners: updateLatLngInputListeners,
  }

}
