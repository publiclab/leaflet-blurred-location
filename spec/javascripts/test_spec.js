describe("Basic testing", function() {
  "use strict";

  var fixture = loadFixtures('index.html');
  var options = {};
  options.location = {
    lat: 41.01,
    lon: -85.66
  };

  var blurredLocation = new BlurredLocation(options);

  it("Checks if getLat returns the correct latitude", function () {
    expect(blurredLocation.getLat()).toBe(41.01);
  });

  it("Checks if getLon returns the correct longitude", function () {
    expect(blurredLocation.getLon()).toBe(-85.66);
  });

  it("Checks if goTo changes the map location to given parameters", function() {
    expect(blurredLocation.getLat()).toBe(41.01);
    expect(blurredLocation.getLon()).toBe(-85.66);
    blurredLocation.goTo(51.50, -0.09, 13);
    expect(blurredLocation.getLat()).toBe(51.50);
    expect(blurredLocation.getLon()).toBe(-0.09);
  });

  it("Checks if blurredLocation has a property named gridSystem", function() {
    expect(blurredLocation.hasOwnProperty("gridSystem")).toBe(true);
  });

  it("Checks if cellSize changes with change in zoom", function() {
    expect(blurredLocation.gridSystem.getCellSize().rows).toBe(100);
    expect(blurredLocation.gridSystem.getCellSize().cols).toBe(100);

    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),10);

    expect(blurredLocation.gridSystem.getCellSize().rows).toBe(73);
    expect(blurredLocation.gridSystem.getCellSize().cols).toBe(117);

  });

  it("Checks if getPrecision works and changes on zoom", function() {
    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),13);
    expect(blurredLocation.getPrecision()).toBe(3);
    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),10);
    expect(blurredLocation.getPrecision()).toBe(2);
  });
  // it("geocode spec", function() {
  //   var geometry = blurredLocation.geocode("Buenos Aires");
  //   console.log(blurredLocation.getLat());
  //   console.log(map.getCenter().lat);
  //   expect(blurredLocation.getLat()).toBe(-34.6036844);
  //   expect(blurredLocation.getLon()).toBe(-58.3815591);
  // });

});
