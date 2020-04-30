var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || ''
});

async function sendMail({from, to, subject, text}) {
  const msg = {
    from: from,
    to: to,
    subject: subject,
    text: text
  }
  return mailgun.messages().send(msg)
}

exports.sendMail = sendMail;
