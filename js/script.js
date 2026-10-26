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
// SERVICE SELECTION
// =========================

const serviceLinks = document.querySelectorAll(".service-link");
const serviceSelect = document.getElementById("service");

if (serviceSelect) {
    serviceLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const selectedService = link.dataset.service;

            serviceSelect.value = selectedService;
        });
    });
}


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

        const submitButton = document.getElementById("quote-submit");
        const submitLabel = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        fetch(quoteForm.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(
                Object.fromEntries(new FormData(quoteForm).entries())
            )
        })
            .then(async (response) => {
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || "Your request could not be sent."
                    );
                }

                formFeedback.textContent =
                    "Thank you. Your quote request has been sent to our WhatsApp Business team.";
                formFeedback.classList.add("success");
                quoteForm.reset();
            })
            .catch((error) => {
                formFeedback.textContent = error.message ||
                    "We could not send your request. Please try again or contact us by phone.";
                formFeedback.classList.add("error");
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitLabel;
                }
            });
    });
}