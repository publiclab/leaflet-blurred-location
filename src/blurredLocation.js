BlurredLocation = function BlurredLocation(options) {

  var L = require('leaflet');
  var blurredLocation = this;
  var blurred = true;

  options = options || {};
  options.map = options.map || L.map('map');
  options.pixels = options.pixels || 400;

  options.gridSystem = options.gridSystem || require('./core/gridSystem.js');
  options.Interface = options.Interface || require('./ui/Interface.js');

  gridSystemOptions = options.gridSystemOptions || {};
  gridSystemOptions.map = options.map;
  gridSystemOptions.gridWidthInPixels = gridWidthInPixels;
  gridSystemOptions.getMinimumGridWidth = getMinimumGridWidth;
  gridSystem = options.gridSystem(gridSystemOptions);

  InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.panMap = panMap;
  InterfaceOptions.getPlacenameFromCoordinates = getPlacenameFromCoordinates;
  InterfaceOptions.getLat = getLat;
  InterfaceOptions.getLon = getLon;
  InterfaceOptions.map = options.map;

  Interface = options.Interface(InterfaceOptions);

  L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(options.map);

  options.location = options.location || {
    lat: 41.011234567,
    lon: -85.66123456789
  };

  options.zoom = options.zoom || 13;
  options.map.setView([options.location.lat, options.location.lon], options.zoom);

  function getLat() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lat, getPrecision()));
    else
      return parseFloat(options.map.getCenter().lat);
  }

  function getLon() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lng, getPrecision()));
    else
      return parseFloat(options.map.getCenter().lng);
  }
  function goTo(lat, lon, zoom) {
    options.map.setView([lat, lon], zoom);
  }

  function setZoom(zoom) {
    options.map.setZoom(zoom);
  }

  function geocodeStringAndPan(string, onComplete) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+string.split(" ").join("+");
    var Blurred = $.ajax({
        async: false,
        url: url
    });
    onComplete = onComplete || function onComplete(geometry) {
      $("#lat").val(geometry.lat);
      $("#lng").val(geometry.lng);

      options.map.setView([geometry.lat, geometry.lng],options.zoom);
    }
    onComplete(Blurred.responseJSON.results[0].geometry.location);
  }

  function getSize() {
    return options.map.getSize();
  }

  function panMapToGeocodedLocation(selector) {
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        geocodeStringAndPan(str);
      }, 10);
    });
  };

  function panMap(lat, lng) {
    options.map.panTo(new L.LatLng(lat, lng));
  }

  function getPlacenameFromCoordinates(lat, lng, onResponse) {
      $.ajax({
      url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng,
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

  function gridWidthInPixels(degrees) {
    var p1 = L.latLng(options.map.getCenter().lat,options.map.getCenter().lng);
    var p2 = L.latLng(p1.lat+degrees, p1.lng+degrees);
    var l1 = options.map.latLngToContainerPoint(p1);
    var l2 = options.map.latLngToContainerPoint(p2);
    return {
      x: Math.abs(l2.x - l1.x),
      y: Math.abs(l2.y - l1.y),
    }
  }

  function getMinimumGridWidth(pixels) {
    var degrees = 100.0, precision = -2;
    while(gridWidthInPixels(degrees).x > pixels) {
      degrees/= 10;
      precision+= 1;
    }
    return {
      precision: precision,
      degrees: degrees,
    }
  }

  function truncateToPrecision(number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  function getPrecision() {
    return getMinimumGridWidth(options.pixels).precision;
  }

  function getFullLat() {
    return parseFloat(options.map.getCenter().lat);
  }

  function getFullLon() {
    return options.map.getCenter().lng;
  }

  function setBlurred(boolean) {
      if(boolean && !blurred) {
        gridSystem.addGrid();
        blurred = true;
      }
      else if(!boolean) {
        blurred = false;
        gridSystem.removeGrid();
      }
  }

  function isBlurred() {
    return blurred;
  }

  return {
    getLat: getLat,
    getLon: getLon,
    goTo: goTo,
    geocodeStringAndPan: geocodeStringAndPan,
    getSize: getSize,
    gridSystem: gridSystem,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMap: panMap,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    getMinimumGridWidth: getMinimumGridWidth,
    gridWidthInPixels: gridWidthInPixels,
    getPrecision: getPrecision,
    setZoom: setZoom,
    Interface: Interface,
    getFullLon: getFullLon,
    getFullLat: getFullLat,
    isBlurred: isBlurred,
    setBlurred: setBlurred,
    truncateToPrecision: truncateToPrecision,
  }
}

exports.BlurredLocation = BlurredLocation;
