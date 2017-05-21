function BlurredLocation(location) {
    if(map) {
      map.setView([location.lat, location.lon], 10);
      this.getLat = function () {
        return map.getCenter().lat;
      }
      this.getLon = function() {
        return map.getCenter().lng;
      }
    }
    else {
      this.getLat = function () {
        return location['lat'];
      }
      this.getLon = function() {
        return location['lon'];
      }
    }
}

exports.BlurredLocation = BlurredLocation;
