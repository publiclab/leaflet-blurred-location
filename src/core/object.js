BlurredLocation = function BlurredLocation(options) {
    options = options || {};
    options.map = options.map || L.map('map');
    options.addGrid = options.addGrid || require('./addGrid.js');

    L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(options.map);
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

    this.addGrid = options.addGrid;

function panMapToGeocodedLocation(selector) {
  var input = document.getElementById(selector);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function() {
    setTimeout(function () {
      var str = input.value;
      blurredLocation.geocode(str);
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

    lat.addEventListener('change blur input', function() {
      panIfValue();
    });
    lng.addEventListener('change blur input', function() {
      panIfValue();
    });
  }


  function panMap(lat, lng) {
    map.panTo(new L.LatLng(lat, lng));
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

return {
  panMapToGeocodedLocation: panMapToGeocodedLocation,
  getPlacenameFromCoordinates: getPlacenameFromCoordinates,
  panMapWhenInputsChange: panMapWhenInputsChange,
  panMap: panMap,
  panMapByBrowserGeocode: panMapByBrowserGeocode,  
}


}

exports.BlurredLocation = BlurredLocation;
