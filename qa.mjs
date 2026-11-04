export default async function run(page) {
 await page.waitForTimeout(7000)
 await page.setViewportSize({ width: 390, height: 844 })
 await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
 await page.waitForTimeout(1000)
 const before = await page.evaluate(() => ({
  viewport: window.innerWidth,
  documentWidth: document.documentElement.scrollWidth,
  menuVisible: getComputedStyle(document.querySelector("#main-nav")).display,
 }))
 await page.locator(".menu-toggle").click()
 const after = await page.evaluate(() => ({
  imagesLoaded: [...document.images].every(
   (image) => image.complete && image.naturalWidth > 0,
  ),
  menuOpen: document.querySelector("#main-nav").classList.contains("open"),
  expanded: document
   .querySelector(".menu-toggle")
   .getAttribute("aria-expanded"),
  navDisplay: getComputedStyle(document.querySelector("#main-nav")).display,
 }))
 return { before, after }
}
