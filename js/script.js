// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

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


// =========================
// AUTOMATIC COPYRIGHT YEAR
// =========================

document.getElementById("current-year").textContent =
    new Date().getFullYear();


// =========================
// SERVICE SELECTION
// =========================

const serviceLinks = document.querySelectorAll(".service-link");
const serviceSelect = document.getElementById("service");

serviceLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const selectedService = link.dataset.service;

        serviceSelect.value = selectedService;
    });
});


// =========================
// QUOTATION FORM
// =========================

const quoteForm = document.getElementById("quote-form");
const formFeedback = document.getElementById("form-feedback");

quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formFeedback.textContent = "";
    formFeedback.className = "form-feedback";

    if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
    }

    const formData = new FormData(quoteForm);

    const customerName = formData.get("name").trim();
    const customerEmail = formData.get("email").trim();
    const customerPhone = formData.get("phone").trim();
    const selectedService = formData.get("service");
    const projectMessage = formData.get("message").trim();

    if (
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        !selectedService ||
        !projectMessage
    ) {
        formFeedback.textContent =
            "Please complete all the required fields.";

        formFeedback.classList.add("error");
        return;
    }

    /*
     * FRONT-END DEMONSTRATION ONLY
     *
     * The form currently does not send information to a server.
     *
     * Connect this section to a backend API, email service,
     * or form-processing service before publishing the website.
     */

    formFeedback.textContent =
        "The form is working, but it is not connected to a submission service yet.";

    formFeedback.classList.add("success");

    console.log("Quotation request:", {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        service: selectedService,
        message: projectMessage
    });
});