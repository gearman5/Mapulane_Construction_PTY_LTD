// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        navLinks.classList.toggle("active");
    });

    // Close the mobile menu when a navigation link is selected.
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// =========================
// AUTOMATIC COPYRIGHT YEAR
// =========================

const currentYear = document.getElementById("current-year");
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// =========================
// THEME SWITCHER
// =========================

const themeToggle = document.querySelector(".theme-toggle");

const applyTheme = (theme) => {
    const resolvedTheme = theme === "dark" ? "dark" : "light";
    document.body.setAttribute("data-theme", resolvedTheme);

    if (themeToggle) {
        const isDark = resolvedTheme === "dark";
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }
};

const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("mapulane-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

if (themeToggle) {
    applyTheme(getPreferredTheme());

    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        localStorage.setItem("mapulane-theme", nextTheme);
        applyTheme(nextTheme);
    });
}


// =========================
// SERVICE SELECTION
// =========================

const serviceLinks = document.querySelectorAll(".service-link");
const serviceSelect = document.getElementById("service");

if (serviceSelect) {
    const requestedService = new URLSearchParams(window.location.search)
        .get("service");
    const matchingOption = Array.from(serviceSelect.options).find(
        (option) => option.value === requestedService
    );

    if (matchingOption) {
        serviceSelect.value = matchingOption.value;
    }

    serviceLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const selectedService = link.dataset.service;

            serviceSelect.value = selectedService;
        });
    });
}


// =========================
// SERVICE CARD IMAGE CAROUSELS
// =========================

const serviceGalleries = document.querySelectorAll("[data-service-gallery]");

serviceGalleries.forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll(".service-gallery-slide"));
    const prevButton = gallery.querySelector("[data-service-prev]");
    const nextButton = gallery.querySelector("[data-service-next]");
    const dots = Array.from(gallery.querySelectorAll("[data-service-dot]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (slides.length <= 1) {
        prevButton?.remove();
        nextButton?.remove();
        dots.forEach((dot) => dot.remove());
        return;
    }

    let activeIndex = 0;
    let autoplayTimer;

    const showSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            const isCurrent = dotIndex === activeIndex;
            dot.classList.toggle("is-active", isCurrent);
            dot.setAttribute("aria-current", String(isCurrent));
        });
    };

    const stopAutoplay = () => {
        window.clearInterval(autoplayTimer);
    };

    const startAutoplay = () => {
        stopAutoplay();

        if (reducedMotion.matches || document.hidden) {
            return;
        }

        autoplayTimer = window.setInterval(() => {
            showSlide(activeIndex + 1);
        }, 5000);
    };

    prevButton?.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        startAutoplay();
    });

    nextButton?.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        startAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoplay();
        });
    });

    gallery.addEventListener("mouseenter", stopAutoplay);
    gallery.addEventListener("mouseleave", startAutoplay);
    gallery.addEventListener("focusin", stopAutoplay);
    gallery.addEventListener("focusout", () => {
        startAutoplay();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    reducedMotion.addEventListener("change", () => {
        if (reducedMotion.matches) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    showSlide(0);
    startAutoplay();
});


// =========================
// HOMEPAGE CAROUSEL
// =========================

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const indicators = Array.from(
        carousel.querySelectorAll("[data-carousel-slide]")
    );
    const previousButton = carousel.querySelector("[data-carousel-previous]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
        slides.length > 1 &&
        indicators.length === slides.length &&
        previousButton &&
        nextButton
    ) {
        let activeSlide = 0;
        let autoplayTimer;

        const showSlide = (index) => {
            activeSlide = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeSlide;
                slide.classList.toggle("is-active", isActive);
                slide.setAttribute("aria-hidden", String(!isActive));
                indicators[slideIndex].setAttribute(
                    "aria-current",
                    String(isActive)
                );
            });
        };

        const stopAutoplay = () => {
            window.clearInterval(autoplayTimer);
        };

        const startAutoplay = () => {
            stopAutoplay();

            if (
                reducedMotion.matches ||
                carousel.matches(":hover") ||
                carousel.contains(document.activeElement) ||
                document.hidden
            ) {
                return;
            }

            autoplayTimer = window.setInterval(() => {
                showSlide(activeSlide + 1);
            }, 5000);
        };

        previousButton.addEventListener("click", () => {
            showSlide(activeSlide - 1);
            startAutoplay();
        });

        nextButton.addEventListener("click", () => {
            showSlide(activeSlide + 1);
            startAutoplay();
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                showSlide(index);
                startAutoplay();
            });
        });

        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", (event) => {
            if (!carousel.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        reducedMotion.addEventListener("change", () => {
            if (reducedMotion.matches) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        showSlide(0);
        startAutoplay();
    }
}


// =========================
// QUOTATION FORM
// =========================

const quoteForm = document.getElementById("quote-form");
const formFeedback = document.getElementById("form-feedback");

if (quoteForm && formFeedback) {
    quoteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formFeedback.textContent = "";
        formFeedback.className = "form-feedback";

        if (!quoteForm.checkValidity()) {
            quoteForm.reportValidity();
            return;
        }

        const whatsappNumber = (quoteForm.dataset.whatsappNumber || "")
            .replace(/[^\d]/g, "");
        if (!/^\d{8,15}$/.test(whatsappNumber)) {
            formFeedback.textContent =
                "WhatsApp quote delivery is not configured. Please contact us by phone.";
            formFeedback.classList.add("error");
            return;
        }

        const quote = Object.fromEntries(new FormData(quoteForm).entries());
        const message = [
            "Hello Mapulane Construction, I would like to request a quote.",
            "",
            `Name: ${quote.name}`,
            `Phone: ${quote.phone}`,
            `Email: ${quote.email}`,
            `Service: ${quote.service}`,
            `Project details: ${quote.message}`
        ].join("\n");
        const whatsappUrl =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        const whatsappLink = document.createElement("a");

        whatsappLink.href = whatsappUrl;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
        whatsappLink.textContent = "Open WhatsApp to review and send your quote";

        formFeedback.append(
            document.createTextNode(
                "Opening WhatsApp now. Review the message and tap Send; otherwise, use the link below. "
            ),
            whatsappLink
        );
        formFeedback.classList.add("success");

        // This is a direct user-initiated action, so most browsers allow it.
        // WhatsApp may still require the user to review and tap Send.
        whatsappLink.click();
    });
}