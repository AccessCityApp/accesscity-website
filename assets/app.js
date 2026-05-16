const toggle = document.getElementById("lang-toggle");
const html = document.documentElement;
const title = document.getElementById("page-title");
const metaDescription = document.getElementById("meta-description");
const scrollTopButton = document.getElementById("scroll-top");
const brandLink = document.querySelector(".brand");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

let currentLang = "el";

function detectPreferredLanguage() {
    const candidates = Array.isArray(navigator.languages)
        ? navigator.languages
        : [navigator.language || "el"];
    const normalized = candidates
        .filter(Boolean)
        .map((value) => value.toLowerCase());
    const prefersEnglish = normalized.some((value) => value.startsWith("en"));
    const prefersGreek = normalized.some((value) => value.startsWith("el"));

    if (prefersEnglish && !prefersGreek) {
        return "en";
    }

    return "el";
}

function setLanguage(lang) {
    currentLang = lang;
    html.lang = lang;

    document.querySelectorAll("[data-el]").forEach((el) => {
        el.textContent = el.getAttribute("data-" + lang);
    });

    const pageStrings = window.PAGE_LANG_STRINGS && window.PAGE_LANG_STRINGS[lang];

    if (lang === "el") {
        title.textContent =
            (pageStrings && pageStrings.title) ||
            "AccessCity — Χαρτογράφηση & βελτίωση αστικής προσβασιμότητας";
        metaDescription.content =
            (pageStrings && pageStrings.description) ||
            "Το AccessCity μετατρέπει παρατηρήσεις σε δομημένα δεδομένα για πιο προσβάσιμες πόλεις.";
        toggle.textContent = "EN";
        toggle.setAttribute("aria-label", "Change language to English");
    } else {
        title.textContent =
            (pageStrings && pageStrings.title) ||
            "AccessCity — Urban Accessibility Data Platform";
        metaDescription.content =
            (pageStrings && pageStrings.description) ||
            "AccessCity turns accessibility observations into structured data that supports inclusive cities.";
        toggle.textContent = "EL";
        toggle.setAttribute("aria-label", "Αλλαγή γλώσσας στα Ελληνικά");
    }
}

toggle.addEventListener("click", () => {
    setLanguage(currentLang === "el" ? "en" : "el");
});

setLanguage(detectPreferredLanguage());

if (scrollTopButton) {
    const toggleScrollTop = () => {
        const shouldShow = window.scrollY > 480;
        scrollTopButton.classList.toggle("is-visible", shouldShow);
    };

    toggleScrollTop();

    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    });
}

if (brandLink) {
    brandLink.addEventListener("click", (event) => {
        if (window.scrollY > 0) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        }
    });
}

document.getElementById("copyright").textContent =
    "© " + new Date().getFullYear() + " AccessCity";

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS
// ==========================================

function initScrollAnimations() {
    if (prefersReducedMotion) return;

    // Stagger cards inside .card-grid
    document.querySelectorAll(".card-grid").forEach((grid) => {
        Array.from(grid.children).forEach((card, i) => {
            card.classList.add("anim-ready");
            card.style.transitionDelay = i * 0.12 + "s";
        });
    });

    // Steps — staggered slide-in
    document.querySelectorAll(".step").forEach((step, i) => {
        step.classList.add("anim-ready");
        step.style.transitionDelay = i * 0.13 + "s";
    });

    // Section eyebrows and headings below the hero
    document
        .querySelectorAll(
            "#about > .eyebrow, #about > h2, #about > p:first-of-type," +
            "#how > .eyebrow, #how > h2, #how > p:first-of-type," +
            "#higgs > article," +
            "#partners > .callout," +
            "#contact > .eyebrow, #contact > h2, #contact > .split, #contact > .callout"
        )
        .forEach((el) => {
            el.classList.add("anim-ready");
        });

    // Stagger contact split children
    const contactSplit = document.querySelector("#contact > .split");
    if (contactSplit) {
        Array.from(contactSplit.children).forEach((child, i) => {
            child.classList.remove("anim-ready");
            child.classList.add("anim-ready");
            child.style.transitionDelay = i * 0.12 + "s";
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("anim-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    document.querySelectorAll(".anim-ready").forEach((el) => observer.observe(el));
}

// ==========================================
// METRIC COUNTER ANIMATION
// ==========================================

function animateMetricCounters() {
    if (prefersReducedMotion) return;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                counterObserver.unobserve(entry.target);

                const el = entry.target;
                const raw = el.getAttribute("data-target");
                if (!raw) return;

                const isPercent = raw.endsWith("%");
                const num = parseInt(raw, 10);
                if (isNaN(num)) return;

                const duration = 1100;
                const startTime = performance.now();

                function tick(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Cubic ease-out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(eased * num);
                    el.textContent = isPercent ? value + "%" : String(value);
                    if (progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
            });
        },
        { threshold: 0.6 }
    );

    document.querySelectorAll(".metric-number").forEach((el) => {
        const raw = el.textContent.trim();
        // Only animate purely numeric or percentage values
        if (/^\d+%?$/.test(raw)) {
            el.setAttribute("data-target", raw);
            counterObserver.observe(el);
        }
    });
}

initScrollAnimations();
animateMetricCounters();
