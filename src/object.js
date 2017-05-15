function BlurredLocation(location) {
  this.getLat = function () {
    return location.lat;
  }
  this.getLon = function() {
    return location.lon;
  }
}
