/* jshint node: true */
/*global BlurredLocation */
describe("Basic suite", function() {
  "use strict";
  var object = new BlurredLocation({
    lat: 41.01,
    lon: -85.66
  });
  it("lat spec", function() {
    expect(object.getLat()).toBe(41.01);
    });
  it("lon spec", function() {
    expect(object.getLon()).toBe(-85.66);
  });
});
