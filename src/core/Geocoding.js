module.exports = function Geocoding(options) {

  var map = options.map || document.getElementById("map") || L.map('map');

  function geocodeStringAndPan(string, onComplete) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + string.split(" ").join("+");
    var Blurred = $.ajax({
        async: false,
        url: url
    });
    onComplete = onComplete || function onComplete(geometry) {
      $("#lat").val(geometry.lat);
      $("#lng").val(geometry.lng);

      map.setView([geometry.lat, geometry.lng], options.zoom);
    }
    onComplete(Blurred.responseJSON.results[0].geometry.location);
  }

  function getPlacenameFromCoordinates(lat, lng, precision, onResponse) {
      $.ajax({
        url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng,
        success: function(result) {
          if(result.results[0]) {
            var country;
            var fullAddress = result.results[0].formatted_address.split(",");
            for (i in result.results) {
              if(result.results[i].types.indexOf("country") != -1) {
                //If the type of location is a country assign it to thr input box value
                country = result.results[i].formatted_address;
              }
            }
            if (!country) country = fullAddress[fullAddress.length - 1];

            if(precision <= 0) onResponse(country);

            else if(precision == 1) {
              if (fullAddress.length>=2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
              else onResponse(country);
            }

            else if(precision >= 2) {
              if (fullAddress.length >= 3) onResponse(fullAddress[fullAddress.length - 3] + ", " + fullAddress[fullAddress.length - 2] + ", " + country);
              else if (fullAddress.length == 2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
              else onResponse(country);
            }

            else onResponse(result.results[0].formatted_address);

        }
        else onResponse("Location unavailable");
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

  function panMapToGeocodedLocation(selector) {
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        Geocoding.geocodeStringAndPan(str);
      }, 10);
    });
  };

  function geocodeWithBrowser(boolean) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
      goTo(position.coords.latitude, position.coords.longitude,options.zoom);
      });
    }
  }

  return {
    geocodeStringAndPan: geocodeStringAndPan,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    geocodeWithBrowser: geocodeWithBrowser
  }
}
