function BlurredLocation(location) {
    if(!map) {
       var map = L.map('map');
       L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(map);
    }
    map.setView([location.lat, location.lon], 10);
    this.getLat = function () {
      return map.getCenter().lat;
    }
    this.getLon = function() {
      return map.getCenter().lng;
    }
    this.goTo = function(lat, lon, zoom) {
      map.setView([lat, lon], zoom);
    }
    this.geocode = function(string) {
      var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+string.split(" ").join("+");
      var Blurred = $.ajax({
          async: false,
          url: url
      });
      // console.log(Object.getOwnPropertyNames(Blurred));
      // console.log(Blurred.readyState);

      var geometry = Blurred.responseJSON.results[0].geometry.location;
      var default_zoom = 13;
      // console.log(geometry.lat);
      map.setView([geometry.lat, geometry.lng],default_zoom);
      return geometry;
    }
    this.getSize = function() {
      return map.getSize();
    }
}
exports.BlurredLocation = BlurredLocation;
