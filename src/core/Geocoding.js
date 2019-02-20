var Ng = require("node-geocoder");
module.exports = function Geocoding(options) {
  var map = options.map || document.getElementById("map") || L.map("map");
  var API_KEY = "AIzaSyDWgc7p4WWFsO3y0MTe50vF4l4NUPcPuwE";
  var geocoder = Ng({
    provider: "google",
    apiKey: API_KEY
  });
  function getPlacenameFromCoordinates(lat, lon, precision, send) {
    geocoder
      .reverse({ lat: lat, lon: lon })
      .then(function(res) {
        var result = res.raw;
        console.log(result);
        if (result) {
          var country;
          var addressArray = result.results[0].formatted_address.split(","); // closest match
          // check if center grid (almost) encloses a country
          for (x = 0; x < result.results.length; x++) {
            // avoid map() array fn since that lies on the leaflet instance chain above
            if (result.results[x].types.indexOf("country") !== -1) {
              country = result.results[x].formatted_address;
            }
          }
          country = !country ? addressArray[addressArray.length - 1] : country; // get country of current grid location
          if (precision <= 0) {
            send(country); // return least possible precise location
          } else if (precision === 1) {
            // something a bit more precise (eg., states)
            if (addressArray.length >= 2) {
              // remove unwanted corner cases
              send(addressArray[addressArray.length - 2] + ", " + country); // store state and country only
            } else {
              send(country);
            }
          } else if (precision >= 2) {
            // everything else (eg., towns, parks, streets, etc.)
            if (addressArray.length >= 3) {
              // similar process
              send(
                addressArray[addressArray.length - 3] +
                  ", " +
                  addressArray[addressArray.length - 2] +
                  ", " +
                  country
              ); // largest three from array
            } else if (addressArray.length === 2) {
              // state and country
              send(addressArray[addressArray.length - 2] + ", " + country);
            } else {
              send(country);
            }
          } else {
            send(result.results[0].formatted_address);
          }
        }
      })
      .catch(function(err) {
        send(err);
      });
  }

  function panMapByBrowserGeocode(checkbox) {
    var x = document.getElementById("location");
    if (checkbox.checked == true) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }

      function displayPosition(position) {
        panMap(
          parseFloat(position.coords.latitude),
          parseFloat(position.coords.longitude)
        );
      }
    }
  }

  function panMapToGeocodedLocation(selector) {
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", function() {
      setTimeout(function() {
        var str = input.value;
        geocodeStringAndPan(str);
      }, 10);
    });

    $("#" + selector).keypress(function(e) {
      setTimeout(function() {
        if (e.which == 13) {
          var str = input.value;
          geocodeStringAndPan(str);
        }
      }, 10);
    });
  }

  function geocodeWithBrowser(success) {
    if (success) {
      var label = document.createElement("label");
      label.classList.add("spinner");
      var i = document.createElement("i");
      i.classList.add("fa");
      i.classList.add("fa-spinner");
      i.classList.add("fa-spin");
      label.appendChild(i);
      var element = document.getElementById(options.geocodeButtonId);
      element.appendChild(label);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            options.goTo(
              position.coords.latitude,
              position.coords.longitude,
              options.zoom
            );
            i.classList.remove("fa");
            i.classList.remove("fa-spinner");
            i.classList.remove("fa-spin");
          },
          function(error) {
            console.log(error);
          }
        );
      }
    }
  }

  function geocodeStringAndPan(string, onComplete) {
    if (typeof map.spin == "function") {
      map.spin(true);
    }
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      string.split(" ").join("+") +
      API_KEY;

    var Blurred = $.ajax({
      async: false,
      url: url
    });
    onComplete =
      onComplete ||
      function onComplete(geometry) {
        $("#lat").val(geometry.lat);
        $("#lng").val(geometry.lng);

        map.setView([geometry.lat, geometry.lng], options.zoom);
        if (typeof map.spin == "function") {
          map.spin(false);
        }
      };
    onComplete(Blurred.responseJSON.results[0].geometry.location);
  }

  return {
    geocodeStringAndPan: geocodeStringAndPan,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    geocodeWithBrowser: geocodeWithBrowser
  };
};
