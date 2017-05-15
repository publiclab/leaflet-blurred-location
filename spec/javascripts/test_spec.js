var basic = require("../../src/object.js");
describe("Basic suite", function() {
  var object = new basic.BlurredLocation({
    lat: 41.01,
    lon: -85.66
  });
  it("lat spec", function() {
    expect(object.getLat()).toBe(41.01);
    });
  it("lon spec", function() {
    expect(object.getLon()).toBe(-85.66);
  })
});
