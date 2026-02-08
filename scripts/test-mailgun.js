require('dotenv').config();
const FormData = require('form-data');
const Mailgun = require('mailgun.js');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(FormData);
const client = mailgun.client({ username: 'api', key: API_KEY });

console.log("Attempting to send email...");

client.messages.create(DOMAIN, {
    from: `Test <mailgun@${DOMAIN}>`,
    to: ["lewesag154@dnsclick.com"],
    subject: "Test Email from Script",
    text: "Testing Mailgun credentials."
})
    .then(msg => console.log("Success:", msg))
    .catch(err => {
        console.error("Error:", err);
        if (err.details) console.error("Details:", err.details);
    });
