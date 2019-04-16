BlurredLocation = function BlurredLocation(options) {

  var blurredLocation = this;
  var blurred = true;
  var DEFAULT_PRECISION = 6;
  require('leaflet-graticule');

  options = options || {};
  options.location = options.location || {
    lat: 1.0,
    lon: 10.0
  };

  options.zoom = options.zoom || 6;

  //options.mapID = options.mapID || 'map';

  //options.map = options.map || new L.Map(options.mapID,{}).setView([options.location.lat, options.location.lon], options.zoom);

  options.pixels = options.pixels || 400;

  options.gridSystem = options.gridSystem || require('./core/gridSystem.js');

  options.Interface = options.Interface || require('./ui/Interface.js');

  options.Geocoding = options.Geocoding || require('./core/Geocoding.js')

  var gridSystemOptions = options.gridSystemOptions || {};
  // gridSystemOptions.map = options.map;
  gridSystemOptions.gridWidthInPixels = gridWidthInPixels;
  gridSystemOptions.getMinimumGridWidth = getMinimumGridWidth;

  var GeocodingOptions = options.GeocodingOptions || {};
  // GeocodingOptions.map = options.map;
  GeocodingOptions.goTo = goTo;
  GeocodingOptions.geocodeButtonId = options.geocodeButtonId || "ldi-geocode-button";

  // var gridSystem = options.gridSystem(gridSystemOptions);
  // var Geocoding = options.Geocoding(GeocodingOptions);
  var gridSystem ;
  var Geocoding ;
  var InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.panMap = panMap;
  // InterfaceOptions.getPlacenameFromCoordinates = getGeocoding().getPlacenameFromCoordinates;
  InterfaceOptions.getLat = getLat;
  InterfaceOptions.getLon = getLon;
  // InterfaceOptions.map = options.map;
  InterfaceOptions.getPrecision = getPrecision;
  InterfaceOptions.isBlurred = isBlurred;
  InterfaceOptions.DEFAULT_PRECISION = DEFAULT_PRECISION;


  //var Interface = options.Interface(InterfaceOptions);
  var Interface ;
  // options.map.setView([options.location.lat, options.location.lon], options.zoom);
  options.AddScaleDisplay = options.AddScaleDisplay || false ;
  options.scaleDisplay = options.scaleDisplay || "scale";

  options.AddBlurryScale = options.AddBlurryScale || false ;
  options.blurryScale = options.blurryScale || "scale_blurry"

  options.blurryScaleNames = options.blurryScaleNames || {
   "urban":["country", "state", "district", "neighborhood","block", "building"],
   "rural":["country", "county", "town", "village", "house", "house"],
 }

  function addTo(map){
    options.map = map ;
    var tileLayer = L.tileLayer("https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png").addTo(options.map) ;
    options.map.options.scrollWheelZoom = "center";
    options.map.options.touchZoom = "center";


    GeocodingOptions.map = options.map;
    gridSystemOptions.map = options.map;

    gridSystem = options.gridSystem(gridSystemOptions);
    Geocoding = options.Geocoding(GeocodingOptions);

    InterfaceOptions.map = options.map;
    InterfaceOptions.getPlacenameFromCoordinates = getGeocoding().getPlacenameFromCoordinates;
    Interface = options.Interface(InterfaceOptions) ;

    marker = L.marker([getFullLat(), getFullLon()]);
    updateRectangleOnPan() ;
  }

  function getInterface(){
    return Interface ;
  }

  function getGridSystem(){
    return gridSystem ;
  }

  function getGeocoding(){
    return Geocoding ;
  }

  function getmap()
  {
    return options.map ;
  }

  function getLat() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lat, getPrecision()));
    else
      return parseFloat(truncateToPrecision(options.map.getCenter().lat, DEFAULT_PRECISION));
  }

  function getLon() {
    if(isBlurred())
      return parseFloat(truncateToPrecision(options.map.getCenter().lng, getPrecision()));
    else
      return truncateToPrecision(options.map.getCenter().lng, DEFAULT_PRECISION);
  }
  function goTo(lat, lon, zoom) {
    options.map.setView([lat, lon], zoom);
  }

  function setZoom(zoom) {
    options.map.setZoom(zoom);
  }

  function getSize() {
    return options.map.getSize();
  }

  function panMap(lat, lng) {
    options.map.panTo(new L.LatLng(lat, lng));
  }

  function gridWidthInPixels(degrees) {
    var p1 = L.latLng(options.map.getCenter().lat, options.map.getCenter().lng);
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
    return parseFloat(options.map.getCenter().lng);
  }

  function setBlurred(boolean) {

      if(boolean && !blurred) {
        getGridSystem().addGrid();
        blurred = true;
        enableCenterShade();
      }
      else if(!boolean) {
        blurred = false;
        getGridSystem().removeGrid();
      }
      updateRectangleOnPan();
  }

  function isBlurred() {
    return blurred;
  }

  var rectangle;

  function getRectangle(){
    return rectangle ;
  }

  function getTileLayer(){
    return tileLayer ; 
  }

  function drawCenterRectangle(bounds) {
    var precision = getPrecision();
    var interval = Math.pow(0.1, precision);
    if (!bounds[1][0] || !bounds[1][1]) {
      var ind = 0;
      if (!bounds[1][1]) ind = 1;   
      if (getFullLat() < 0) { bounds[0][ind] = -1*interval; bounds[1][ind] = 0; }
      else { bounds[1][ind] = 1*interval; }
    }

    if (rectangle) rectangle.remove();
    rectangle = L.rectangle(bounds, {color: "#ff0000", weight: 1}).addTo(options.map);
  }

  function updateRectangleOnPan() {
    var precision = getPrecision();
    var interval = Math.pow(10,-precision);
    var bounds = [[getLat(), getLon()], [getLat() + (getLat()/Math.abs(getLat()))*interval, getLon() + (getLon()/Math.abs(getLon()))*interval]];
    if(isBlurred()) {
        drawCenterRectangle(bounds);
        disableCenterMarker();
        enableCenterShade() ; 
    }
    else{
       enableCenterMarker();
       disableCenterShade();
    }
    $("#"+InterfaceOptions.latId).val(getLat()) ;
    $("#"+InterfaceOptions.lngId).val(getLon()) ; 
  }


  function setZoomByPrecision(precision) {
    var precisionTable = {'-2': 2, '-1': 3, '0':6, '1':10, '2':13, '3':16};
    setZoom(precisionTable[precision]);
  }

  function enableCenterShade() {
    options.map.on('move', updateRectangleOnPan);
  }

  function disableCenterShade() {
    if(rectangle) rectangle.remove();
    options.map.off('move',updateRectangleOnPan);
  }

  // var marker = L.marker([getFullLat(), getFullLon()]);
  var marker ;
  function updateMarker() {
    if(marker) marker.remove();
    marker = L.marker([getFullLat(), getFullLon()]).addTo(options.map);
  }

  function enableCenterMarker() {
    updateMarker();
    options.map.on('move', updateMarker);
  }

  function disableCenterMarker() {
    marker.remove();
    options.map.off('move',updateMarker);
  }

    // updateRectangleOnPan();

  function displayLocation() {
    var lat = getLat();
    var lon = getLon();
    alert("Your current location is: " + lat +  ', ' + lon);
  }

  function getDistanceMetrics() {
    var haversine = require('haversine-distance');
    
    var add = Math.pow(10,-getPrecision())

    var sw = { latitude: getLat(), longitude: getLon() }
    var ne = { latitude: getLat() + add, longitude: getLon() + add }
 
    distance = haversine(sw, ne)/1000;
    return truncateToPrecision(distance, 2)
  }

  function addScaleToListener() {
    $("#"+options.scaleDisplay).text("Each grid square is roughly "+getDistanceMetrics()+"km wide");
  }

  function getBlurryScale(region) {
    var urban = options.blurryScaleNames["urban"]
    var rural = options.blurryScaleNames["rural"]
    var precision = getPrecision() ;
    if(precision<0 || precision>5){
      precision = 0 ;
    }
    if(region == "urban")
      return urban[precision]

    if(region == "rural")
      return rural[precision]
  }

  function displayBlurryScale() {
    $("#" + options.blurryScale).text("This corresponds roughly to a "+getBlurryScale("urban").toString()+" in an urban area, and "+getBlurryScale("rural").toString()+" in a rural area.");
  }

  function toggleScales(method, id, boolean) {
    if(boolean) {
      method();
      options.map.on('move', method);
    }
    else {
      $("#"+id).text("");
      options.map.off('move', method);
    }
  }
       
  return {
    getLat: getLat,
    getLon: getLon,
    goTo: goTo,
    getSize: getSize,
    getGridSystem: getGridSystem,
    // panMapToGeocodedLocation: getGeocoding().panMapToGeocodedLocation,
    // getPlacenameFromCoordinates: getGeocoding().getPlacenameFromCoordinates,
    panMap: panMap,
   // panMapByBrowserGeocode: getGeocoding().panMapByBrowserGeocode,
    getMinimumGridWidth: getMinimumGridWidth,
    gridWidthInPixels: gridWidthInPixels,
    getPrecision: getPrecision,
    setZoom: setZoom,
    getInterface: getInterface,
    getFullLon: getFullLon,
    getFullLat: getFullLat,
    isBlurred: isBlurred,
    setBlurred: setBlurred,
    truncateToPrecision: truncateToPrecision,
    map: getmap,
    updateRectangleOnPan: updateRectangleOnPan,
    setZoomByPrecision: setZoomByPrecision,
    disableCenterShade: disableCenterShade,
    enableCenterShade: enableCenterShade,
    // geocodeStringAndPan: getGeocoding().geocodeStringAndPan,
    // geocodeWithBrowser: getGeocoding().geocodeWithBrowser,
    displayLocation: displayLocation,
    getDistanceMetrics: getDistanceMetrics,
    getBlurryScale: getBlurryScale,
    addScaleToListener: addScaleToListener,
    displayBlurryScale: displayBlurryScale,
    toggleScales: toggleScales,
    getRectangle: getRectangle,
    getTileLayer: getTileLayer,
    getGeocoding: getGeocoding,
    addTo: addTo
  }
}

exports.BlurredLocation = BlurredLocation;