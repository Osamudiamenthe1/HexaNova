/*
  ============================================================
  HEXAGON EXCHANGE — EASY CONFIGURATION
  Change your business details HERE.
  ============================================================
*/

const CONFIG = {
  businessName: "HEXAGON Exchange",

  // Enter WhatsApp in international format WITHOUT + or spaces.
  // Example: "2348012345678"
  whatsappNumber: "2348134600671",

  // Change this to your real business email.
  email: "osamudiamen025@gmail.com",

  tagline: "Secure. Sweet. Synaptic."
};


/* ---------------- DO NOT EDIT BELOW UNLESS NEEDED ---------------- */

document.title = `${CONFIG.businessName} | ${CONFIG.tagline}`;

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = `https://wa.me/${CONFIG.whatsappNumber}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-email]").forEach(link => {
  link.href = `mailto:${CONFIG.email}`;
});

document.querySelectorAll("[data-whatsapp-display]").forEach(el => {
  // Always show nicely formatted number on the page
  el.textContent = "+234 813-460-0671";
});

document.querySelectorAll("[data-email-display]").forEach(el => {
  el.textContent = CONFIG.email;
});

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));