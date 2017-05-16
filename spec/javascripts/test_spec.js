/*global BlurredLocation */
describe("Basic suite", function() {
  "use strict";
  var blurredLocatoion = new BlurredLocation({
    lat: 41.01,
    lon: -85.66
  });
  it("lat spec", function() {
    expect(blurredLocatoion.getLat()).toBe(41.01);
    });
  it("lon spec", function() {
    expect(blurredLocatoion.getLon()).toBe(-85.66);
  });
});
