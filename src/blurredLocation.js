BlurredLocation = function BlurredLocation(options) {

  var L = require('leaflet');
  var blurredLocation = this;

  options = options || {};
  options.map = options.map || L.map('map');

  options.addGrid = options.addGrid || require('./core/addGrid.js');

  addGridOptions = options.addGridOptions || {};
  addGridOptions.map = options.map
  options.addGrid(addGridOptions);

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

  function getPlacenameFromCoordinates(lat, lng) {
    var loc = "Location not found";

    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng, function(data) {
      if (data.results[0]) {
        loc = data.results[0].formatted_address;
      }
    });
    return loc;
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

  function gridWidthInPixels(degrees) {
    var p1 = L.latLng(1,1);
    var p2 = L.latLng(1+degrees, 1+degrees);
    var l1 = options.map.latLngToContainerPoint(p1);
    var l2 = options.map.latLngToContainerPoint(p2);
    return {
      x: Math.abs(l2.x - l1.x),
      y: Math.abs(l2.y - l1.y),
    }
  }

  function findPrecisionForMinimumGridWidth(width) {
    var degrees = 1, precision = 1;
    while(gridWidthInPixels(degrees).x > width) {
      degrees/= 10;
      precision+= 1;
    }
    return precision;
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
    gridWidthInPixels: gridWidthInPixels,
    findPrecisionForMinimumGridWidth: findPrecisionForMinimumGridWidth,
  }
}

exports.BlurredLocation = BlurredLocation;
