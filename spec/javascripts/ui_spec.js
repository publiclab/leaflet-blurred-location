describe("UI testing", function() {
  "use strict";

  it("Checks if input listeners change maps position to the entered latitude and longitude", function() {
    var fixture = loadFixtures('index.html');

    var latEl = $("#lat");
    var lngEl = $("#lng");

    latEl.val(20);
    lngEl.val(15);

    expect(parseFloat(latEl.val())).toBe(20);
    expect(parseFloat(lngEl.val())).toBe(15);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(20);
    expect(blurredLocation.getLon()).toBe(15);

    lngEl.val(20);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(20);
    expect(blurredLocation.getLon()).toBe(20);
  });

  it("Checks if value of input box changes on change of map location", function () {
    var fixture = loadFixtures('index.html');

    blurredLocation.goTo(43,43,10);
    expect($("#location").val()).toBe("Zugdidi Jvari Mestia Lasdili, Georgia");

  })

});
