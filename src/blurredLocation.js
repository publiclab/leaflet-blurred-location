BlurredLocation = function BlurredLocation(options) {

  var L = require('leaflet');
  var blurredLocation = this;

  options = options || {};
  options.map = options.map || L.map('map');

  options.addGrid = options.addGrid || require('./core/addGrid.js');
  options.addGrid(options.map);

  L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(options.map);

  options.location = options.location || {
    lat: 41.01,
    lon: -85.66
  };

  options.zoom = options.zoom || 13;
  options.map.setView([options.location.lat, options.location.lon], options.zoom);

  function getLat() {
    return options.map.getCenter().lat;
  }

  function getLon() {
    return options.map.getCenter().lng;
  }

  function goTo(lat, lon, zoom) {
    options.map.setView([lat, lon], zoom);
  }

  function geocode(string) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+string.split(" ").join("+");
    var Blurred = $.ajax({
        async: false,
        url: url
    });
    var geometry = Blurred.responseJSON.results[0].geometry.location;
    options.map.setView([geometry.lat, geometry.lng],options.zoom);
    return geometry;
  }

  function getSize() {
    return options.map.getSize();
  }

  addGrid = options.addGrid;

  function panMapToGeocodedLocation(selector) {
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        geocode(str);
      }, 10);
    });
  };

  function panMapWhenInputsChange(latId, lngId) {
    var lat = document.getElementById(latId);
    var lng = document.getElementById(lngId);

    function panIfValue() {
      if(lat.value && lng.value) {
        panMap(lat.value, lng.value);
      };
    }

    lat.addEventListener('change', function() {
      panIfValue();
    });
    lng.addEventListener('change', function() {
      panIfValue();
    });
  }


  function panMap(lat, lng) {
    options.map.panTo(new L.LatLng(lat, lng));
  }

  function getPlacenameFromCoordinates(lat, lng, onResponse = function(result) {console.log(result);}) {

      $.ajax({
      url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng,
      async: false,
      success: function(result) {
        onResponse(result);
      }
    });
  }

  function panMapByBrowserGeocode(checkbox) {
    var x = document.getElementById("location");
      if(checkbox.checked == true) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function displayPosition(position) {
          panMap(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
        }
    }
  }

  return {
    getLat: getLat,
    getLon: getLon,
    goTo: goTo,
    geocode: geocode,
    getSize: getSize,
    addGrid: addGrid,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMapWhenInputsChange: panMapWhenInputsChange,
    panMap: panMap,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
  }
}

exports.BlurredLocation = BlurredLocation;
