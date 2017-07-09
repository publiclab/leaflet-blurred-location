module.exports = function gridSystem(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  options.cellSize = options.cellSize || { rows:100, cols:100 };

  require('leaflet-graticule');

  options.graticuleOptions = options.graticuleOptions || {
                 showLabel: true,
                 zoomInterval: [
                    {start: 2, end: 2, interval: 40},
                    {start: 3, end: 3, interval: 20},
                    {start: 4, end: 4, interval: 10},
                    {start: 5, end: 6, interval: 5},
                    {start: 6, end: 8, interval: 1},
                    {start: 9, end: 12, interval: 0.1},
                    {start: 13, end: 15, interval: 0.01},
                    {start: 16, end: 20, interval: 0.001},

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
