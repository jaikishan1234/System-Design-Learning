const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 300,
    args: ["--window-size=1920,1080"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1620,
    height: 1080,
  });

  await page.goto("https://namastedev.com", {
    waitUntil: "networkidle2",
  });

  console.log("Website Loaded");

  // EXTRA WAIT FOR REACT UI
  await new Promise((resolve) =>
    setTimeout(resolve, 5000)
  );

  const coursesPageLink = 'a[href="/learn"]';

  await page.waitForSelector(coursesPageLink, {
    visible: true,
  });

  console.log("Courses Button Found");

  // Scroll into view
  await page.evaluate((selector) => {
    document
      .querySelector(selector)
      .scrollIntoView();
  }, coursesPageLink);

  // Click using browser JS
  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, coursesPageLink);

  console.log("Courses Button Clicked");

  // Wait after click
  await new Promise((resolve) =>
    setTimeout(resolve, 5000)
  );

  console.log(await page.url());

  await browser.close();
})();