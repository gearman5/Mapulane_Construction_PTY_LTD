require("dotenv").config();

const express = require("express");
const { rateLimit } = require("express-rate-limit");

const app = express();
const port = Number(process.env.PORT) || 3000;
const siteRoot = __dirname;
const allowedServices = new Set([
    "Electrical Installation",
    "Plumbing Installation",
    "Solar Panel Fitting",
    "General Construction",
    "Other"
]);

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb", type: "application/json" }));

const quoteLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        error: "Too many quote requests. Please try again in a few minutes."
    }
});

const isText = (value) => typeof value === "string";

function validateQuote(body) {
    const fields = ["name", "email", "phone", "service", "message"];

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return "Please submit a valid quote request.";
    }

    if (fields.some((field) => !isText(body[field]))) {
        return "Please complete all the required fields.";
    }

    const quote = Object.fromEntries(
        fields.map((field) => [field, body[field].trim()])
    );

    if (
        !quote.name ||
        quote.name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email) ||
        quote.email.length > 254 ||
        !/^[+()\d\s.-]{7,30}$/.test(quote.phone) ||
        !allowedServices.has(quote.service) ||
        quote.service.length > 80 ||
        !quote.message ||
        quote.message.length > 500
    ) {
        return "Check your name, email, phone number, service and project details, then try again.";
    }

    return quote;
}

app.post("/api/quote", quoteLimiter, async (req, res) => {
    const quote = validateQuote(req.body);

    if (typeof quote === "string") {
        return res.status(400).json({ error: quote });
    }

    const {
        WHATSAPP_ACCESS_TOKEN,
        WHATSAPP_PHONE_NUMBER_ID,
        WHATSAPP_RECIPIENT,
        WHATSAPP_TEMPLATE_NAME,
        WHATSAPP_TEMPLATE_LANGUAGE = "en_US",
        WHATSAPP_GRAPH_API_VERSION = "v23.0"
    } = process.env;

    if (
        !WHATSAPP_ACCESS_TOKEN ||
        !WHATSAPP_PHONE_NUMBER_ID ||
        !WHATSAPP_RECIPIENT ||
        !WHATSAPP_TEMPLATE_NAME
    ) {
        console.error("WhatsApp quote delivery is not configured.");
        return res.status(503).json({
            error: "Quote delivery is not configured yet. Please contact us by phone."
        });
    }

    const recipient = WHATSAPP_RECIPIENT.replace(/\D/g, "");
    if (!/^\d{8,15}$/.test(recipient)) {
        console.error("WHATSAPP_RECIPIENT must be a valid international phone number.");
        return res.status(503).json({
            error: "Quote delivery is temporarily unavailable. Please contact us by phone."
        });
    }

    const messageParameters = [
        quote.name,
        quote.phone,
        quote.email,
        quote.service,
        quote.message
    ].map((text) => ({ type: "text", text }));

    try {
        const whatsappResponse = await fetch(
            `https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${encodeURIComponent(WHATSAPP_PHONE_NUMBER_ID)}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: recipient,
                    type: "template",
                    template: {
                        name: WHATSAPP_TEMPLATE_NAME,
                        language: { code: WHATSAPP_TEMPLATE_LANGUAGE },
                        components: [{
                            type: "body",
                            parameters: messageParameters
                        }]
                    }
                }),
                signal: AbortSignal.timeout(10000)
            }
        );

        if (!whatsappResponse.ok) {
            const errorDetails = await whatsappResponse.text();
            console.error(
                `WhatsApp Cloud API returned HTTP ${whatsappResponse.status}:`,
                errorDetails
            );
            return res.status(502).json({
                error: "WhatsApp could not accept your quote request. Please try again or contact us by phone."
            });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Unable to reach the WhatsApp Cloud API:", error.message);
        return res.status(502).json({
            error: "We could not send your quote request. Please try again or contact us by phone."
        });
    }
});

app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found." });
});

app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({ error: "Request body must be valid JSON." });
    }

    if (error && error.status === 413) {
        return res.status(413).json({ error: "Request body is too large." });
    }

    console.error("Request parsing failed:", error && error.message ? error.message : error);
    return res.status(400).json({ error: "The request could not be processed." });
});

app.use(express.static(siteRoot, {
    dotfiles: "deny",
    index: "index.html"
}));

app.listen(port, () => {
    console.log(`Mapulane website and quote API listening on port ${port}.`);
});
