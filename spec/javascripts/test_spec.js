var map;

describe("Testing changing view", function() {
  "use strict";

  var fixture = loadFixtures('index.html');
  map = L.map('map');

  var blurredLocatoion = new BlurredLocation({
    lat: 41.01,
    lon: -85.66
  });

  it("main spec", function() {
    expect(blurredLocatoion.getLat()).toBe(41.01);
    expect(blurredLocatoion.getLon()).toBe(-85.66);
    map.setView([51.50, -0.09], 13);
    expect(blurredLocatoion.getLat()).toBe(51.50);
    expect(blurredLocatoion.getLon()).toBe(-0.09);
  });
});
