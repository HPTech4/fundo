// ============ ELEMENT REFERENCES ============
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const exploreBtn = document.getElementById("exploreBtn");
const consultBtn = document.getElementById("consultBtn");
const ctaButton = document.querySelector(".cta-button");
const header = document.querySelector(".header");

const consultationModal = document.getElementById("consultationModal");
const closeConsultationModalBtn = document.getElementById(
  "closeConsultationModal",
);
const consultationForm = document.getElementById("consultationForm");

const feedbackModal = document.getElementById("feedbackModal");
const feedbackPanel = document.getElementById("feedbackPanel");
const closeFeedbackModalBtn = document.getElementById("closeFeedbackModal");
const feedbackOkBtn = document.getElementById("feedbackOkBtn");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackIcon = document.getElementById("feedbackIcon");

const contactForm = document.getElementById("contactForm");
const WHATSAPP_BOOKING_NUMBER = "2348031234567";

// ============ MOTION CAPABILITIES ============
const supportsMatchMedia = typeof window.matchMedia === "function";
const prefersReducedMotion = supportsMatchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;
const gsapInstance = window.gsap;
const scrollTriggerInstance = window.ScrollTrigger;
const canUseGsap = Boolean(gsapInstance) && !prefersReducedMotion;
const canUseScrollTrigger = canUseGsap && Boolean(scrollTriggerInstance);

if (canUseScrollTrigger) {
  gsapInstance.registerPlugin(scrollTriggerInstance);
}

if (canUseGsap) {
  document.body.classList.add("gsap-enhanced");
}

// ============ HELPERS ============
function scrollToSection(sectionId) {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" });
  }
}

function syncBodyModalState() {
  const consultationOpen =
    consultationModal && consultationModal.classList.contains("active");
  const feedbackOpen =
    feedbackModal && feedbackModal.classList.contains("active");
  document.body.classList.toggle(
    "modal-open",
    Boolean(consultationOpen || feedbackOpen),
  );
}

function animateModalOpen(modal, panelSelector, backdropSelector) {
  if (!canUseGsap || !modal) {
    return;
  }

  const panel = modal.querySelector(panelSelector);
  const backdrop = modal.querySelector(backdropSelector);

  if (!(panel instanceof HTMLElement) || !(backdrop instanceof HTMLElement)) {
    return;
  }

  gsapInstance.killTweensOf([panel, backdrop]);
  gsapInstance.set(backdrop, { opacity: 0 });
  gsapInstance.set(panel, { autoAlpha: 0, y: 26, scale: 0.96 });

  gsapInstance.to(backdrop, {
    opacity: 1,
    duration: 0.25,
    ease: "power1.out",
  });

  gsapInstance.to(panel, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: "power3.out",
  });
}

function animateModalClose(modal, panelSelector, backdropSelector, onComplete) {
  if (!canUseGsap || !modal) {
    onComplete();
    return;
  }

  const panel = modal.querySelector(panelSelector);
  const backdrop = modal.querySelector(backdropSelector);

  if (!(panel instanceof HTMLElement) || !(backdrop instanceof HTMLElement)) {
    onComplete();
    return;
  }

  gsapInstance.killTweensOf([panel, backdrop]);

  gsapInstance
    .timeline({ onComplete })
    .to(
      panel,
      {
        autoAlpha: 0,
        y: 20,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.in",
      },
      0,
    )
    .to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
      },
      0,
    );
}

// ============ MODALS ============
function openConsultationModal() {
  if (!consultationModal) {
    return;
  }

  consultationModal.classList.add("active");
  consultationModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  animateModalOpen(
    consultationModal,
    ".consultation-panel",
    ".consultation-backdrop",
  );

  const firstInput = consultationModal.querySelector("input, select, textarea");
  if (firstInput instanceof HTMLElement) {
    setTimeout(() => {
      firstInput.focus();
    }, 180);
  }
}

function closeConsultationModal() {
  if (!consultationModal || !consultationModal.classList.contains("active")) {
    return;
  }

  animateModalClose(
    consultationModal,
    ".consultation-panel",
    ".consultation-backdrop",
    () => {
      consultationModal.classList.remove("active");
      consultationModal.setAttribute("aria-hidden", "true");
      syncBodyModalState();
    },
  );
}

function openFeedbackModal({ title, message, type = "success" }) {
  if (
    !feedbackModal ||
    !feedbackPanel ||
    !feedbackTitle ||
    !feedbackMessage ||
    !feedbackIcon
  ) {
    return;
  }

  feedbackTitle.textContent = title;
  feedbackMessage.textContent = message;
  feedbackPanel.classList.toggle("is-error", type === "error");
  feedbackIcon.textContent = type === "error" ? "!" : "✓";

  feedbackModal.classList.add("active");
  feedbackModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  animateModalOpen(feedbackModal, ".feedback-panel", ".feedback-backdrop");
}

function closeFeedbackModal() {
  if (!feedbackModal || !feedbackModal.classList.contains("active")) {
    return;
  }

  animateModalClose(
    feedbackModal,
    ".feedback-panel",
    ".feedback-backdrop",
    () => {
      feedbackModal.classList.remove("active");
      feedbackModal.setAttribute("aria-hidden", "true");
      syncBodyModalState();
    },
  );
}

// ============ NAVIGATION ============
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    if (canUseGsap && navLinks.classList.contains("active")) {
      const navMenuLinks = navLinks.querySelectorAll(".nav-link");
      gsapInstance.fromTo(
        navMenuLinks,
        { autoAlpha: 0, y: -10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    }
  });
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("active");
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");

    if (targetId && targetId !== "#") {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        if (navLinks) {
          navLinks.classList.remove("active");
        }
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// ============ HERO & CTA BUTTON ACTIONS ============
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    scrollToSection("products");
  });
}

if (consultBtn) {
  consultBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openConsultationModal();
  });
}

if (ctaButton) {
  ctaButton.addEventListener("click", () => {
    scrollToSection("contact");
  });
}

// ============ MODAL EVENTS ============
if (closeConsultationModalBtn) {
  closeConsultationModalBtn.addEventListener("click", closeConsultationModal);
}

if (consultationModal) {
  consultationModal.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target instanceof HTMLElement &&
      target.hasAttribute("data-close-modal")
    ) {
      closeConsultationModal();
    }
  });
}

if (closeFeedbackModalBtn) {
  closeFeedbackModalBtn.addEventListener("click", closeFeedbackModal);
}

if (feedbackOkBtn) {
  feedbackOkBtn.addEventListener("click", closeFeedbackModal);
}

if (feedbackModal) {
  feedbackModal.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target instanceof HTMLElement &&
      target.hasAttribute("data-close-feedback")
    ) {
      closeFeedbackModal();
    }
  });
}

// ============ CONSULTATION FORM ============
if (consultationForm) {
  const consultDateInput = document.getElementById("consultDate");
  if (consultDateInput instanceof HTMLInputElement) {
    consultDateInput.min = new Date().toISOString().split("T")[0];
  }

  consultationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("consultName");
    const emailInput = document.getElementById("consultEmail");
    const phoneInput = document.getElementById("consultPhone");
    const dateInput = document.getElementById("consultDate");
    const timeInput = document.getElementById("consultTime");
    const projectTypeInput = document.getElementById("consultProjectType");
    const messageInput = document.getElementById("consultMessage");

    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(emailInput instanceof HTMLInputElement) ||
      !(phoneInput instanceof HTMLInputElement) ||
      !(dateInput instanceof HTMLInputElement) ||
      !(timeInput instanceof HTMLSelectElement) ||
      !(projectTypeInput instanceof HTMLSelectElement) ||
      !(messageInput instanceof HTMLTextAreaElement)
    ) {
      openFeedbackModal({
        title: "Booking Form Unavailable",
        message:
          "The booking form is not fully available right now. Please refresh and try again.",
        type: "error",
      });
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;
    const projectType = projectTypeInput.value;
    const message = messageInput.value.trim();

    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !projectType ||
      !message
    ) {
      openFeedbackModal({
        title: "Complete Booking Details",
        message:
          "Please complete all required booking details before submitting your request.",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      openFeedbackModal({
        title: "Invalid Email Address",
        message:
          "Please provide a valid email address so we can confirm your consultation.",
        type: "error",
      });
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const bookingMessage = [
      "Hello Fundo Team, I want to book a design consultation.",
      "",
      `Full Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Preferred Date: ${formattedDate}`,
      `Preferred Time: ${time}`,
      `Project Type: ${projectType}`,
      `Project Brief: ${message}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_BOOKING_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;
    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    if (!whatsappWindow) {
      window.location.href = whatsappUrl;
    }

    consultationForm.reset();
    closeConsultationModal();

    openFeedbackModal({
      title: "Booking Request Prepared",
      message: `Thanks, ${name}. WhatsApp opened with your booking details. Please tap send in WhatsApp to complete your consultation request.`,
      type: "success",
    });
  });
}

// ============ CONTACT FORM ============
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input, textarea");
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const message = inputs[4].value.trim();

    if (!name || !email || !message) {
      openFeedbackModal({
        title: "Required Information Missing",
        message:
          "Please fill in Name, Email, and Project Message before sending your inquiry.",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      openFeedbackModal({
        title: "Invalid Email Address",
        message:
          "Please enter a valid email format so we can send your consultation response.",
        type: "error",
      });
      return;
    }

    openFeedbackModal({
      title: "Inquiry Sent Successfully",
      message: `Thank you, ${name}. We received your inquiry and our Abuja team will contact you at ${email} within 24 hours.`,
      type: "success",
    });
    contactForm.reset();
  });
}

// ============ PRODUCT BUTTONS ============
document.querySelectorAll(".product-card .btn-small").forEach((btn) => {
  btn.addEventListener("click", function () {
    const productName = this.parentElement.querySelector("h3").textContent;
    openFeedbackModal({
      title: "Product Interest Received",
      message: `Thank you for your interest in ${productName}. Our design team will contact you shortly with details.`,
      type: "success",
    });
  });
});

// ============ SCROLL ANIMATION FALLBACK ============
const animatedItems = document.querySelectorAll(
  ".product-card, .service-card, .testimonial-card, .portfolio-item",
);

function initIntersectionFallbackAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedItems.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(element);
    });

    setTimeout(() => {
      animatedItems.forEach((element) => {
        if (element.style.opacity === "0") {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    }, 1500);
  } else {
    animatedItems.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }
}

function initGsapExperience() {
  if (!canUseScrollTrigger) {
    return false;
  }

  const heroTimeline = gsapInstance.timeline({
    defaults: { ease: "power3.out" },
  });

  heroTimeline
    .from(".header", { y: -20, autoAlpha: 0, duration: 0.55 })
    .from(".hero-kicker", { autoAlpha: 0, y: 16, duration: 0.45 }, "-=0.2")
    .from(".hero-title", { autoAlpha: 0, y: 30, duration: 0.55 }, "-=0.25")
    .from(".hero-subtitle", { autoAlpha: 0, y: 20, duration: 0.45 }, "-=0.35")
    .from(
      ".hero-highlights li",
      { autoAlpha: 0, x: -14, stagger: 0.07, duration: 0.35 },
      "-=0.25",
    )
    .from(
      ".hero-buttons .btn",
      { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.35 },
      "-=0.22",
    )
    .from(
      ".trust-item",
      { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.35 },
      "-=0.2",
    );

  if (window.innerWidth > 768) {
    heroTimeline.from(
      ".nav-links li",
      {
        autoAlpha: 0,
        y: -10,
        duration: 0.32,
        stagger: 0.05,
      },
      0.08,
    );
    heroTimeline.from(
      ".cta-button",
      { autoAlpha: 0, y: -8, duration: 0.32 },
      0.1,
    );
  }

  if (window.innerWidth > 900) {
    gsapInstance.to(".hero-content", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  gsapInstance.from(".stat-item", {
    autoAlpha: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".stats",
      start: "top 82%",
      once: true,
    },
  });

  scrollTriggerInstance.create({
    trigger: ".stats",
    start: "top 78%",
    once: true,
    onEnter: () => {
      document.querySelectorAll(".stat-item h3").forEach((item, index) => {
        const finalText = item.textContent.trim();
        const finalNumber = Number.parseInt(
          finalText.replace(/[^\d]/g, ""),
          10,
        );
        const hasPlus = finalText.includes("+");

        if (Number.isNaN(finalNumber)) {
          return;
        }

        const counter = { value: 0 };
        gsapInstance.to(counter, {
          value: finalNumber,
          duration: 1.45,
          delay: index * 0.08,
          ease: "power2.out",
          onUpdate: () => {
            item.textContent = `${Math.round(counter.value).toLocaleString()}${hasPlus ? "+" : ""}`;
          },
          onComplete: () => {
            item.textContent = finalText;
          },
        });
      });
    },
  });

  gsapInstance.from(".about-image", {
    autoAlpha: 0,
    x: -46,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about",
      start: "top 76%",
      once: true,
    },
  });

  gsapInstance.from(".about-text", {
    autoAlpha: 0,
    x: 46,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about",
      start: "top 76%",
      once: true,
    },
  });

  gsapInstance.from(".feature", {
    autoAlpha: 0,
    y: 18,
    duration: 0.45,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-features",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".products-head", {
    autoAlpha: 0,
    y: 30,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".products",
      start: "top 82%",
      once: true,
    },
  });

  gsapInstance.from(".product-card", {
    autoAlpha: 0,
    y: 36,
    duration: 0.75,
    stagger: 0.11,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".products-grid",
      start: "top 82%",
      once: true,
    },
  });

  gsapInstance.from(".view-all", {
    autoAlpha: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".view-all",
      start: "top 92%",
      once: true,
    },
  });

  gsapInstance.from(".portfolio-head", {
    autoAlpha: 0,
    y: 30,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".portfolio",
      start: "top 82%",
      once: true,
    },
  });

  gsapInstance.from(".portfolio-item", {
    autoAlpha: 0,
    y: 36,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".portfolio-grid",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".testimonials .section-header", {
    autoAlpha: 0,
    y: 24,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".testimonials",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".testimonial-card", {
    autoAlpha: 0,
    y: 30,
    duration: 0.65,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".testimonials-grid",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".services .section-header", {
    autoAlpha: 0,
    y: 24,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".services",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".service-card", {
    autoAlpha: 0,
    y: 34,
    duration: 0.65,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".contact .section-header", {
    autoAlpha: 0,
    y: 24,
    duration: 0.55,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".contact-info .info-block", {
    autoAlpha: 0,
    y: 24,
    duration: 0.55,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-wrapper",
      start: "top 84%",
      once: true,
    },
  });

  gsapInstance.from(".contact-form .form-group", {
    autoAlpha: 0,
    y: 20,
    duration: 0.45,
    stagger: 0.07,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 88%",
      once: true,
    },
  });

  gsapInstance.from(".contact-form .btn", {
    autoAlpha: 0,
    y: 16,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 86%",
      once: true,
    },
  });

  gsapInstance.from(".footer-section", {
    autoAlpha: 0,
    y: 24,
    duration: 0.55,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 94%",
      once: true,
    },
  });

  gsapInstance.from(".footer-bottom", {
    autoAlpha: 0,
    y: 16,
    duration: 0.45,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer-bottom",
      start: "top 98%",
      once: true,
    },
  });

  scrollTriggerInstance.refresh();
  return true;
}

function initGsapMicroInteractions() {
  if (!canUseGsap) {
    return;
  }

  const supportsHover =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches;

  // Subtle floating motion to keep hero metrics alive without distracting users.
  gsapInstance.to(".hero-trust .trust-item", {
    y: -6,
    duration: 2.2,
    ease: "sine.inOut",
    stagger: {
      each: 0.12,
      from: "center",
      yoyo: true,
      repeat: -1,
    },
    repeat: -1,
    yoyo: true,
  });

  if (!supportsHover) {
    return;
  }

  document.querySelectorAll(".btn, .cta-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsapInstance.to(button, {
        y: -3,
        boxShadow: "0 10px 26px rgba(0, 0, 0, 0.2)",
        duration: 0.22,
        ease: "power2.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsapInstance.to(button, {
        y: 0,
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
}

const gsapExperienceReady = initGsapExperience();

if (!gsapExperienceReady) {
  initIntersectionFallbackAnimations();
} else {
  initGsapMicroInteractions();
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (feedbackModal && feedbackModal.classList.contains("active")) {
      closeFeedbackModal();
      return;
    }
    if (consultationModal && consultationModal.classList.contains("active")) {
      closeConsultationModal();
      return;
    }
    if (navLinks) {
      navLinks.classList.remove("active");
    }
  }

  if (e.altKey && e.key.toLowerCase() === "c") {
    scrollToSection("contact");
  }
});

// ============ HEADER SCROLL EFFECT ============
let headerHasStrongShadow = false;

window.addEventListener("scroll", () => {
  if (!header) {
    return;
  }

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const shouldUseStrongShadow = scrollTop > 50;

  if (shouldUseStrongShadow !== headerHasStrongShadow) {
    header.style.boxShadow = shouldUseStrongShadow
      ? "0 5px 20px rgba(0, 0, 0, 0.1)"
      : "0 2px 10px rgba(0, 0, 0, 0.05)";
    headerHasStrongShadow = shouldUseStrongShadow;
  }
});

// ============ PORTFOLIO HOVER EFFECT ============
document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    if (canUseGsap) {
      gsapInstance.to(item, {
        scale: 1.02,
        duration: 0.32,
        ease: "power2.out",
      });
    } else {
      item.style.transform = "scale(1.02)";
    }
  });

  item.addEventListener("mouseleave", () => {
    if (canUseGsap) {
      gsapInstance.to(item, {
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
      });
    } else {
      item.style.transform = "scale(1)";
    }
  });
});

// ============ SERVICE CARD FALLBACK DELAYS ============
if (!canUseGsap) {
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// ============ MOBILE TOUCH OPTIMIZATION ============
if (window.innerWidth <= 768) {
  document
    .querySelectorAll(".btn, .product-card, .service-card")
    .forEach((element) => {
      element.style.touchAction = "manipulation";
    });
}

// ============ FORM INPUT FOCUS EFFECTS ============
document
  .querySelectorAll(
    ".form-group input, .form-group textarea, .consultation-field input, .consultation-field select, .consultation-field textarea",
  )
  .forEach((input) => {
    const parent = input.parentElement;
    if (!(parent instanceof HTMLElement)) {
      return;
    }

    input.addEventListener("focus", () => {
      if (canUseGsap) {
        gsapInstance.to(parent, {
          scale: 1.01,
          duration: 0.2,
          ease: "power1.out",
        });
      } else {
        parent.style.transform = "scale(1.01)";
      }
    });

    input.addEventListener("blur", () => {
      if (canUseGsap) {
        gsapInstance.to(parent, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out",
        });
      } else {
        parent.style.transform = "scale(1)";
      }
    });
  });

// ============ COUNTER ANIMATION FALLBACK ============
function animateCountersFallback() {
  const statsSection = document.querySelector(".stats");
  const statItems = document.querySelectorAll(".stat-item h3");

  if (!statsSection) {
    return;
  }

  const scrollPosition = window.scrollY + window.innerHeight;
  const statsPosition = statsSection.offsetTop + statsSection.offsetHeight / 2;

  if (
    scrollPosition > statsPosition &&
    !statsSection.classList.contains("animated")
  ) {
    statsSection.classList.add("animated");

    statItems.forEach((item) => {
      const finalValue = item.textContent.trim();
      const numericValue = Number.parseInt(
        finalValue.replace(/[^\d]/g, ""),
        10,
      );
      const hasPlus = finalValue.includes("+");

      if (Number.isNaN(numericValue)) {
        return;
      }

      let currentValue = 0;
      const increment = numericValue / 50;

      const counter = setInterval(() => {
        currentValue += increment;

        if (currentValue >= numericValue) {
          item.textContent = finalValue;
          clearInterval(counter);
        } else {
          item.textContent = `${Math.floor(currentValue).toLocaleString()}${hasPlus ? "+" : ""}`;
        }
      }, 20);
    });
  }
}

if (!canUseScrollTrigger) {
  window.addEventListener("scroll", animateCountersFallback, { passive: true });
  animateCountersFallback();
}

// ============ CONSOLE MESSAGE ============
console.log(
  "%cWELCOME TO FUNDO",
  "font-size: 24px; font-weight: bold; color: #8b7355;",
);
console.log(
  "%cPremium Furniture & Interior Design",
  "font-size: 14px; color: #666;",
);
