const sendGrid = require('@sendgrid/mail');
const httpErrors = require('http-errors');

async function sendMail({ from, to, subject, text, html }) {
  try {
    sendGrid.setApiKey(process.env.EMAIL_API_KEY);
    const msg = {
      from: {
        name: 'Drop.it',
        email: from,
      },
      to,
      subject,
      text,
      html,
    };
    await sendGrid.send(msg);
  } catch (error) {
    throw httpErrors.InternalServerError('Error Sending Email.');
  }
}

module.exports = sendMail;
