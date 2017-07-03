module.exports = function gridSystem(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  options.cellSize = options.cellSize || { rows:100, cols:100 };

  require('./Leaflet.Graticule.js')
  var layer = L.latlngGraticule({
                 showLabel: true,
                 zoomInterval: [
                     {start: 2, end: 3, interval: 30},
                     {start: 4, end: 4, interval: 10},
                     {start: 5, end: 7, interval: 5},
                     {start: 8, end: 10, interval: 1}
                 ],
                 opacity: 1,
                 color: '#ff0000',
             }).addTo(map);

  function addGrid() {
     layer = L.latlngGraticule({
                    showLabel: true,
                    zoomInterval: [
                        {start: 2, end: 3, interval: 30},
                        {start: 4, end: 4, interval: 10},
                        {start: 5, end: 7, interval: 5},
                        {start: 8, end: 10, interval: 1}
                    ],
                    opacity: 1,
                    color: '#ff0000',
                }).addTo(map);
  }

  function setCellSizeInDegrees(degrees) {

    layer.remove();
    var pixels = options.gridWidthInPixels(1);
    var div = 1/degrees;
    options.cellSize = { rows:pixels.x/div, cols:pixels.y/div};
    layer = L.virtualGrid({
          cellSize: options.cellSize
        }).addTo(map);
  }

  function getCellSize() {
    return options.cellSize;
  }

  function removeGrid() {
  layer.remove();
  }

  return {
    setCellSizeInDegrees: setCellSizeInDegrees,
    getCellSize: getCellSize,
    removeGrid: removeGrid,
    addGrid: addGrid,
  }
}
