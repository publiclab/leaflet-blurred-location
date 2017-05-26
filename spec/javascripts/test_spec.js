describe("Basic testing", function() {
  "use strict";

  var fixture = loadFixtures('index.html');
  var options = {};
  options.location = {
    lat: 41.01,
    lon: -85.66
  };

  var blurredLocation = new BlurredLocation(options);

  it("getLat spec", function () {
    expect(blurredLocation.getLat()).toBe(41.01);
  });

  it("getLon spec", function () {
    expect(blurredLocation.getLon()).toBe(-85.66);
  });

  it("goTo spec", function() {
    expect(blurredLocation.getLat()).toBe(41.01);
    expect(blurredLocation.getLon()).toBe(-85.66);
    blurredLocation.goTo(51.50, -0.09, 13);
    expect(blurredLocation.getLat()).toBe(51.50);
    expect(blurredLocation.getLon()).toBe(-0.09);
  });


  // it("geocode spec", function() {
  //   var geometry = blurredLocation.geocode("Buenos Aires");
  //   console.log(blurredLocation.getLat());
  //   console.log(map.getCenter().lat);
  //   expect(blurredLocation.getLat()).toBe(-34.6036844);
  //   expect(blurredLocation.getLon()).toBe(-58.3815591);
  // });

});
