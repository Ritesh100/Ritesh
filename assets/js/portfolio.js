/* =========================================================
   RITESH THAPA PORTFOLIO — portfolio.js
   ========================================================= */
(() => {
  "use strict";

  /* ── Year ─────────────────────────────────────────────── */
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Mobile nav ───────────────────────────────────────── */
  const header    = document.querySelector("#site-header");
  const nav       = document.querySelector("#primary-navigation");
  const navToggle = document.querySelector("#nav-toggle-btn");
  const navLinks  = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const opening = navToggle.getAttribute("aria-expanded") === "false";
      nav.classList.toggle("open", opening);
      navToggle.setAttribute("aria-expanded", String(opening));
      navToggle.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("nav-open", opening);
    });
    navLinks.forEach(link => link.addEventListener("click", closeNav));
    window.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
  }

  /* ── Scroll: header shadow + active nav link ──────────── */
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link =>
            link.classList.toggle("active",
              link.getAttribute("href") === `#${entry.target.id}`)
          );
        }
      });
    }, { rootMargin: "-30% 0px -60%", threshold: 0 });
    sections.forEach(s => sectionObs.observe(s));
  }

  /* ── Scroll reveal ────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

  /* ── Typewriter role animation ────────────────────────── */
  const roleEl = document.querySelector("#role-text");
  const roles  = [
    "Full-Stack Web Developer",
    "Technical Writer",
    "Laravel & React Engineer",
    "Open Source Enthusiast",
    "Software Engineer"
  ];
  let rIdx = 0, cIdx = 0, isDeleting = false;
  const TYPING_SPEED   = 70;
  const DELETING_SPEED = 35;
  const PAUSE_END      = 1800;
  const PAUSE_START    = 300;

  function typeRole() {
    if (!roleEl) return;
    const current = roles[rIdx];
    if (isDeleting) {
      roleEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        isDeleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(typeRole, PAUSE_START);
        return;
      }
      setTimeout(typeRole, DELETING_SPEED);
    } else {
      roleEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        isDeleting = true;
        setTimeout(typeRole, PAUSE_END);
        return;
      }
      setTimeout(typeRole, TYPING_SPEED);
    }
  }
  typeRole();

  /* ── Contact form validation ──────────────────────────── */
  const form   = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form) return;
  const fields = [...form.querySelectorAll("input, textarea")];

  const getMsg = (f) => document.querySelector(`#${f.id}-msg`);

  const validate = (field) => {
    const msgEl  = getMsg(field);
    const parent = field.closest(".field");
    let error = "";
    const val = field.value.trim();
    if (!val) {
      error = "This field is required.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      error = "Please enter a valid email address.";
    } else if (field.name === "message" && val.length < 10) {
      error = "Please add a bit more detail (10+ characters).";
    }
    parent.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (msgEl) msgEl.textContent = error;
    return !error;
  };

  fields.forEach(f => {
    f.addEventListener("blur",  () => validate(f));
    f.addEventListener("input", () => {
      if (f.closest(".field").classList.contains("invalid")) validate(f);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const allValid = fields.map(validate).every(Boolean);
    if (!allValid) {
      if (status) status.textContent = "Please fix the highlighted fields and try again.";
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get("subject") || "Portfolio enquiry");
    const body    = encodeURIComponent(
      `Hi Ritesh,\n\n${data.get("message")}\n\n—\n${data.get("name")} (${data.get("email")})`
    );
    if (status) status.textContent = "Opening your email app…";
    window.location.href = `mailto:riteshthapa100@gmail.com?subject=${subject}&body=${body}`;
  });
})();
