const menuToggle = document.querySelector(".menu-toggle")
const nav = document.querySelector("#main-nav")
menuToggle?.addEventListener("click", () => {
 const open = nav.classList.toggle("open")
 menuToggle.setAttribute("aria-expanded", String(open))
})
document.querySelectorAll("nav a").forEach((link) =>
 link.addEventListener("click", () => {
  nav.classList.remove("open")
  menuToggle?.setAttribute("aria-expanded", "false")
 }),
)
const observer = new IntersectionObserver(
 (entries) =>
  entries.forEach((entry) => {
   if (entry.isIntersecting) {
    entry.target.classList.add("visible")
    observer.unobserve(entry.target)
   }
  }),
 { threshold: 0.12 },
)
document
 .querySelectorAll(".reveal")
 .forEach((element) => observer.observe(element))

const reviewTrack = document.querySelector(".reviews-track")
const reviewCards = document.querySelectorAll(".review-card")
const reviewCounter = document.querySelector(".review-counter")
let reviewIndex = 0

function moveReviews(nextIndex) {
 if (!reviewTrack || !reviewCards.length) return
 reviewIndex = (nextIndex + reviewCards.length) % reviewCards.length
 const cardGap = 20
 const cardStep = reviewCards[0].getBoundingClientRect().width + cardGap
 reviewTrack.style.transform = `translateX(-${reviewIndex * cardStep}px)`
 if (reviewCounter) {
  reviewCounter.textContent = `${String(reviewIndex + 1).padStart(2, "0")} / ${String(reviewCards.length).padStart(2, "0")}`
 }
}

document
 .querySelector(".review-next")
 ?.addEventListener("click", () => moveReviews(reviewIndex + 1))
document
 .querySelector(".review-prev")
 ?.addEventListener("click", () => moveReviews(reviewIndex - 1))
setInterval(() => moveReviews(reviewIndex + 1), 6500)

// spotlight that follows the pointer on cards
document.querySelectorAll(".service-card, .review-card").forEach((card) =>
 card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect()
  card.style.setProperty("--mx", `${e.clientX - r.left}px`)
  card.style.setProperty("--my", `${e.clientY - r.top}px`)
 }),
)

// header glass on scroll + parallax on images
const header = document.querySelector(".site-header")
const parallax = [...document.querySelectorAll(".image-frame img, .method-image img")]
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches
addEventListener(
 "scroll",
 () => {
  header.classList.toggle("scrolled", scrollY > 20)
  if (calm) return
  parallax.forEach((img) => {
   const r = img.parentElement.getBoundingClientRect()
   const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
   img.style.transform = `translateY(${p * -30}px) scale(${img.closest(".image-frame") ? 1 : 1.12})`
  })
 },
 { passive: true },
)

// hero headline: word-by-word reveal (keeps <em> and <br>)
let wordIndex = 0
function splitWords(parent) {
 ;[...parent.childNodes].forEach((node) => {
  if (node.nodeType === 3) {
   const frag = document.createDocumentFragment()
   node.textContent.split(/\s+/).filter(Boolean).forEach((w) => {
    const s = document.createElement("span")
    s.className = "word"
    s.innerHTML = `<span style="--i:${wordIndex++}">${w}</span>`
    frag.append(s, " ")
   })
   node.replaceWith(frag)
  } else if (node.nodeName === "EM") splitWords(node)
 })
}
const h1 = document.querySelector("h1")
if (h1 && !calm) splitWords(h1)

// magnetic buttons
if (!calm)
 document.querySelectorAll(".button, .nav-cta").forEach((b) => {
  b.addEventListener("pointermove", (e) => {
   const r = b.getBoundingClientRect()
   b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`
  })
  b.addEventListener("pointerleave", () => (b.style.transform = ""))
 })
