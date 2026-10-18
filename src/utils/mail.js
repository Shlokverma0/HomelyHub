// ---- sending emails ----
// Mailgen  = builds a good looking email for us
// nodemailer = actually sends it
// (the first import below is left over and not used)
import Mailgen from "mailgen";
import nodemailer from "nodemailer";


// options = { email, subject, mailGenContent }
// Used by forgotPassword to send the reset link.
const sendMail = async (options) => {
  // The name and link shown at the top of every email
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Homely Hub",
      link: process.env.ORIGIN_ACCESS_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173",
    },
  });

  // Same email in two forms: html for normal mail apps,
  // plain text for old ones. We send both.
  const emailBody = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  // The transporter is the post office - which server to
  // use and the login for it. All of it sits in .env.
  const port = Number(process.env.MAILTRAP_SMTP_PORT) || 2525;
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  // The letter itself: from, to, subject and the body
  const mail = {
    from: "<hello@homelyhub.in>",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody,
  };

  await transporter.sendMail(mail);
};


// This does NOT send anything. It only writes the words of
// the reset email and puts the link inside the button.
const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Homely Hub App! We are sending you the link to reset the password",
      action: {
        instructions: "To reset your password please click here",
        button: {
          color: "#22FF",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to the email, we would love to help you",
    },
  };
};


// Both are used by authController.js
export { sendMail, forgotPasswordMailGenContent };
