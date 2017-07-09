module.exports = function gridSystem(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  options.cellSize = options.cellSize || { rows:100, cols:100 };

  require('leaflet-graticule');

  options.graticuleOptions = options.graticuleOptions || {
                 showLabel: true,
                 zoomInterval: [
                     {start: 2, end: 3, interval: 30},
                     {start: 4, end: 4, interval: 10},
                     {start: 5, end: 7, interval: 5},
                     {start: 8, end: 10, interval: 1}
                 ],
                 opacity: 1,
                 color: '#ff0000',
             }


  var layer = L.latlngGraticule(options.graticuleOptions).addTo(map);

  function addGrid() {
     layer = L.latlngGraticule(options.graticuleOptions).addTo(map);
  }

  function removeGrid() {
  layer.remove();
  }

  return {
    removeGrid: removeGrid,
    addGrid: addGrid,
  }
}
