var map;

describe("Testing changing view", function() {
  "use strict";

  var fixture = loadFixtures('index.html');
  map = L.map('map');

  var blurredLocatoion = new BlurredLocation({
    lat: 41.01,
    lon: -85.66
  });

  console.log(blurredLocatoion.getLat() == 41.01);

  map.setView([51.50, -0.09], 13);

  it("lat spec", function() {
    expect(blurredLocatoion.getLat()).toBe(51.50);
  });
  it("lon spec", function() {
    expect(blurredLocatoion.getLon()).toBe(-0.09);
  });
});
