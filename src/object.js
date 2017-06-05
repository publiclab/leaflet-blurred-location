function BlurredLocation(options) {
    options = options || {};
    options.map = options.map || L.map('map');
    options.location = options.location || {
      lat: 41.01,
      lon: -85.66
    };
    options.zoom = options.zoom || 13;
    options.map.setView([options.location.lat, options.location.lon], options.zoom);
    this.getLat = function () {
      return options.map.getCenter().lat;
    }
    this.getLon = function() {
      return options.map.getCenter().lng;
    }
    this.goTo = function(lat, lon, zoom) {
      options.map.setView([lat, lon], zoom);
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
      // console.log(geometry.lat);
      options.map.setView([geometry.lat, geometry.lng],options.zoom);
      return geometry;
    }
    this.getSize = function() {
      return options.map.getSize();
    }
}

exports.BlurredLocation = BlurredLocation;
