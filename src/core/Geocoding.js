module.exports = function Geocoding(options) {

  var map = options.map || document.getElementById("map") || L.map('map');

  function geocodeStringAndPan(string, onComplete) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + string.split(" ").join("+");
    var Blurred = $.ajax({
        async: false,
        url: url
    });
    onComplete = onComplete || function onComplete(geometry) {
      $("#lat").val(geometry.lat);
      $("#lng").val(geometry.lng);

      map.setView([geometry.lat, geometry.lng], options.zoom);
    }
    onComplete(Blurred.responseJSON.results[0].geometry.location);
  }

  return {
    geocodeStringAndPan: geocodeStringAndPan
  }
}
