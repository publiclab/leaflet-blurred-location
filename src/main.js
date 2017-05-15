var map = L.map('map').setView([17.4472,78.3488], 10);
L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(map);
addGrid(map);
geoLocateFromInput('geo_location');
geoLocateFromLatLng('lat', 'lng');
