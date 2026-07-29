const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const accordionItems = document.querySelectorAll(".accordion-item");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("nav-open", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.floor(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  const symbol = item.querySelector(".accordion-symbol");

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    accordionItems.forEach((otherItem) => {
      otherItem.classList.remove("open");
      otherItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      otherItem.querySelector(".accordion-symbol").textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      symbol.textContent = "−";
    }
  });
});

const sections = [...document.querySelectorAll("main section[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isMatch);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle)=>{toggle.addEventListener("click",(event)=>{event.stopPropagation();const dropdown=toggle.closest(".nav-dropdown");const open=dropdown.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});});
document.addEventListener("click",()=>{document.querySelectorAll(".nav-dropdown.open").forEach((dropdown)=>{dropdown.classList.remove("open");const toggle=dropdown.querySelector(".nav-dropdown-toggle");if(toggle)toggle.setAttribute("aria-expanded","false");});});
