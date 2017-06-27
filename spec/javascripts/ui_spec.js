describe("UI testing", function() {
  "use strict";

  // var blurredLocation = new BlurredLocation();

  it("Checks if input listeners change maps position to the entered latitude and longitude", function() {
    var fixture = loadFixtures('index.html');

    var latEl = $("#lat");
    var lngEl = $("#lng");

    latEl.val(20);
    lngEl.val(15);

    expect(latEl.val()).toBe(20);
    expect(lngEl.val()).toBe(15);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(20);
    expect(blurredLocation.getLon()).toBe(15);

    lngEl.val(20);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(20);
    expect(blurredLocation.getLon()).toBe(20);
  });

});
