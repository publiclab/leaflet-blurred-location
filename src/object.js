function BlurredLocation(location) {
    if(map) {
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
        $.ajaxSetup({async: false});
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+string.split(" ").join("+");
        var temp = $.ajax({
            async: false,
            url: url
        });
        var geometry = temp.responseJSON.results[0].geometry.location;
        var default_zoom = 13;
        console.log(geometry.lat);
        map.setView([geometry.lat, geometry.lng],default_zoom);
        return geometry;
      }
    }
}

exports.BlurredLocation = BlurredLocation;
