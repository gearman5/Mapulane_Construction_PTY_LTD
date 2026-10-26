# Mapulane Construction

Website for a construction company providing electrical installation, solar fitting, plumbing and maintenance.

## Run the website and quote backend

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add the WhatsApp Cloud API access token, sender phone number ID and notification recipient number to `.env`. Keep `.env` private and never commit it.
5. Create and get approval for a WhatsApp message template named `quote_request_notification` (or set the approved template's name in `.env`). Its body must have five text placeholders in this order: customer name, customer phone, customer email, requested service, and project details. The recipient must have opted in to receive WhatsApp messages.
6. Run `npm start` and open `http://localhost:3000/contact.html`.

The contact form posts to `/api/quote`. The server validates and rate-limits requests, then sends the details to the configured WhatsApp recipient using the official WhatsApp Cloud API. The access token stays on the server. Quote requests are not stored by this application.

Before launch, deploy the Node server over HTTPS. WhatsApp delivery will not work until a Meta WhatsApp Business Platform app, a registered sender number, an access token, a recipient that can receive template messages, and the approved template are configured.
