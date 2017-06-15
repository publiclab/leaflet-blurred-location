function BlurredLocation(options) {
    options = options || {};
    options.map = options.map || L.map('map');
    options.addGrid = require('')

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

    this.addGrid = require('./addGrid.js');
}

function geoLocateFromInput(selector) {
  var input = document.getElementById(selector);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function() {
    setTimeout(function () {
      var str = input.value;
      var loc = str.split(' ').join('+');
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyDWgc7p4WWFsO3y0MTe50vF4l4NUPcPuwE", function(data){
        if(data.results[0]) {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            panMap(lat, lng);
        }
      });
    }, 10);
  });
};

  function geoLocateFromLatLng(lat,lng) {
    var lat = document.getElementById(lat);
    var lng = document.getElementById(lng);

    lat.addEventListener('change blur input', function() {
        if(lat.value && lng.value) {
          panMap(lat.value, lng.value);
        };
    });
    lng.addEventListener('change blur input', function() {
        if(lat.value && lng.value) {
          panMap(lat.value, lng.value);
        };
    });
  }


  function panMap(lat, lng) {
    map.panTo(new L.LatLng(lat, lng));
  }

  function getLocationFromMap(lat, lng) {
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng, function(data) {
      if (data.results[0]) {
        var address = data.results[0].formatted_address;
              $("#location").val(address);
      }
    });
  }

  function getLocation(checkbox) {
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

exports.BlurredLocation = BlurredLocation;
