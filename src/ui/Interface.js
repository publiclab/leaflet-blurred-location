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


  onDrag = options.onDrag || function onDrag() {
    function changeVal(result) {
      $("#location").val(result.results[0].formatted_address);
    }
    options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), changeVal);
  }


  options.map.on('moveend', function() {
      onDrag();
   });

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    onDrag: onDrag,
  }

}
