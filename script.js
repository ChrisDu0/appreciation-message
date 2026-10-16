"use strict";

const photos = [
  { src: "images/photo01.jfif", alt: "A picture of you", caption: "A little piece of my favorite person ♡", subcaption: "Every picture of you makes me smile." },
  { src: "images/photo02.jfif", alt: "A picture of you", caption: "Beautiful in every moment", subcaption: "The beauty of you never ceases to amaze me." },
  { src: "images/photo03.jfif", alt: "A picture of you", caption: "A simple but gorgeous face of yours", subcaption: "Every time i look at you, my heart skips a beat." },
  { src: "images/photo04.jfif", alt: "A picture of you", caption: "Simply you ♡", subcaption: "The most beautiful thing about you is how you see the world." },
  { src: "images/photo05.jfif", alt: "A picture of you", caption: "A simple smile of yours", subcaption: "Your smile is the most beautiful thing I've ever seen." },
  { src: "images/photo06.jfif", alt: "A picture of you", caption: "My favorite kind of beautiful", subcaption: "A beautiful soul wrapped in a perfect body." },
  { src: "images/photo07.jfif", alt: "A picture of you", caption: "A memory to keep close", subcaption: "Some people make ordinary days special." },
  { src: "images/photo08.jfif", alt: "A picture of you", caption: "Your gorgeous face", subcaption: "A face that when i see melts me" },
  { src: "images/photo09.jfif", alt: "A picture of you", caption: "One of a kind ♡", subcaption: "Your simple smile is the most beautiful thing I've ever seen." },
  { src: "images/photo10.jfif", alt: "A picture of you", caption: "For someone special", subcaption: "You are truly one of a kind." }
];

const recipientName = "palaaway";
const senderName = "kulit ♡";

const flowerScreen = document.getElementById("flowerScreen");
const galleryScreen = document.getElementById("galleryScreen");
const letterScreen = document.getElementById("letterScreen");

function showScreen(screenToShow) {
  [flowerScreen, galleryScreen, letterScreen].forEach((screen) => {
    const isCurrent = screen === screenToShow;
    screen.hidden = !isCurrent;
    screen.classList.toggle("active", isCurrent);
  });
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
document.getElementById("toGallery").addEventListener("click", () => showScreen(galleryScreen));
document.getElementById("toLetter").addEventListener("click", () => showScreen(letterScreen));
document.getElementById("backToGallery").addEventListener("click", () => showScreen(galleryScreen));

const galleryImage = document.getElementById("galleryImage");
const photoView = document.getElementById("photoView");
const photoCaption = document.getElementById("photoCaption");
const photoSubcaption = document.getElementById("photoSubcaption");
const photoIndex = document.getElementById("photoIndex");
const galleryDots = document.getElementById("galleryDots");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const previousPhotoButton = document.getElementById("previousPhoto");
const nextPhotoButton = document.getElementById("nextPhoto");
const photoIndexElement = document.getElementById("photoIndex");
let currentPhoto = 0;
let touchStartX = null;

function renderDots() {
  galleryDots.replaceChildren();
  photos.forEach((photo, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}: ${photo.caption}`);
    dot.setAttribute("aria-current", String(index === currentPhoto));
    dot.addEventListener("click", () => showPhoto(index));
    galleryDots.appendChild(dot);
  });
}

function showPhoto(index) {
  if (!photos.length) {
    galleryImage.hidden = true;
    galleryImage.removeAttribute("src");
    photoPlaceholder.hidden = false;
    photoCaption.textContent = "Your memories will go here.";
    photoSubcaption.textContent = "Add your photos to the images folder to create your own gallery.";
    photoIndexElement.textContent = "00 / 00";
    previousPhotoButton.disabled = true;
    nextPhotoButton.disabled = true;
    renderDots();
    return;
  }
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  galleryImage.classList.add("changing");
  galleryImage.hidden = false;
  photoPlaceholder.hidden = true;
  galleryImage.onload = () => galleryImage.classList.remove("changing");
  galleryImage.onerror = () => galleryImage.classList.remove("changing");
  galleryImage.src = photo.src;
  galleryImage.alt = photo.alt;
  photoCaption.textContent = photo.caption;
  photoSubcaption.textContent = photo.subcaption;
  photoIndexElement.textContent = `${String(currentPhoto + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  previousPhotoButton.disabled = photos.length < 2;
  nextPhotoButton.disabled = photos.length < 2;
  renderDots();
  if (!lightbox.hidden) updateLightbox();
}

previousPhotoButton.addEventListener("click", () => showPhoto(currentPhoto - 1));
nextPhotoButton.addEventListener("click", () => showPhoto(currentPhoto + 1));
photoView.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
photoView.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const difference = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(difference) > 45) showPhoto(currentPhoto + (difference < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let lastFocusedElement = null;

function updateLightbox() {
  if (!photos.length) return;
  const photo = photos[currentPhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
}
function openLightbox() {
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  document.getElementById("closeLightbox").focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement) lastFocusedElement.focus();
}
photoView.addEventListener("click", openLightbox);
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });

const envelopeButton = document.getElementById("envelopeButton");
const letterCard = document.getElementById("letterCard");
const closeLetterButton = document.getElementById("closeLetter");
const envelopeHelp = document.getElementById("envelopeHelp");

document.getElementById("recipientName").textContent = recipientName;
document.getElementById("senderName").textContent = senderName;

function openLetter() {
  envelopeButton.classList.add("open");
  envelopeButton.setAttribute("aria-expanded", "true");
  envelopeButton.setAttribute("aria-label", "Close the love letter");
  envelopeHelp.textContent = "A little note, just for you. ♡";
  window.setTimeout(() => {
    letterCard.classList.add("visible");
    letterCard.setAttribute("aria-hidden", "false");
    letterCard.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, 450);
}
function closeLetter() {
  letterCard.classList.remove("visible");
  letterCard.setAttribute("aria-hidden", "true");
  envelopeButton.classList.remove("open");
  envelopeButton.setAttribute("aria-expanded", "false");
  envelopeButton.setAttribute("aria-label", "Open the love letter");
  envelopeHelp.textContent = "Tap the envelope to open your letter.";
}
envelopeButton.addEventListener("click", () => {
  if (envelopeButton.classList.contains("open")) closeLetter();
  else openLetter();
});
closeLetterButton.addEventListener("click", closeLetter);

const particleLayer = document.getElementById("particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion) {
  const particleSymbols = ["✦", "✧", "♡", "·"];
  function addParticle() {
    if (!particleLayer || document.hidden) return;
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.fontSize = `${8 + Math.random() * 11}px`;
    particle.style.animationDuration = `${8 + Math.random() * 8}s`;
    particleLayer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 17000);
  }
  for (let i = 0; i < 9; i++) window.setTimeout(addParticle, i * 450);
  window.setInterval(addParticle, 1200);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!lightbox.hidden) closeLightbox();
    if (envelopeButton.classList.contains("open")) closeLetter();
  }
  if (!lightbox.hidden && event.key === "ArrowRight") showPhoto(currentPhoto + 1);
  if (!lightbox.hidden && event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
});

showPhoto(0);
