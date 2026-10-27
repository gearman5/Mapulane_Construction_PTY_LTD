# Mapulane Construction

Website for a construction company providing electrical installation, solar fitting, plumbing and maintenance.

## Run the website

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm start` and open `http://localhost:3000/contact.html`.

The contact form prepares a quote message and provides a link to open WhatsApp for the business number. The customer reviews the details and taps **Send** in WhatsApp. The website does not send a message automatically, and it does not require WhatsApp Cloud API credentials or an approved template.

The business WhatsApp number is configured in the contact form's `data-whatsapp-number` attribute in `contact.html`. Use the international country code and digits only. The Express server only serves the website files.
