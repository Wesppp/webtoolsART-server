require('dotenv').config({path: __dirname + '../.env'});
const nodemailer = require('nodemailer');

const { GMAIL, PASSWORD } = process.env

exports.sendConfirmationEmail = async function (user) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: GMAIL,
      pass: PASSWORD
    },
    secure: true
  });

  const confirmationLink = `http://localhost:4200/api/auth/mail-confirmation/${user.generateConfirmationToken()}`;
  const message = {
    from: GMAIL,
    to: user.email,
    subject: 'Confirm your account',
    text: `To confirm registration, follow the link: ${confirmationLink}`,
    html: `<p>To confirm registration, follow the link: <a href="${confirmationLink}">${confirmationLink}</a></p>`
  };

  await transporter.sendMail(message);
}