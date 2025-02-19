const { reloadApp } = require("detox-expo-helpers");

describe("Counter App", () => {
  // beforeAll(async () => {
  //   await device.launchApp();
  // });

  beforeEach(async () => {
    await reloadApp();
  });

  it("should display counter app card", async () => {
    await expect(element(by.text("Counter App"))).toBeVisible();
  });

  it("should display initial count value", async () => {
    await expect(element(by.text("Value of count = 0"))).toBeVisible();
  });

  it("should increment count by 1 when first button is tapped", async () => {
    await element(by.id("increment_1")).tap();
    await expect(element(by.text("Value of count = 1"))).toBeVisible();
  });

  it("should increment count by 5 when second button is tapped", async () => {
    await element(by.id("increment_5")).tap();
    await expect(element(by.text("Value of count = 6"))).toBeVisible();
  });
});
