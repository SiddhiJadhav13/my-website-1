require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const DEST_EMAIL = process.env.DEST_EMAIL || 'sidjadhav132005@gmail.com';

// Helper to create transporter, fallback to ethereal test account if no SMTP creds
async function createTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  } else {
    console.warn('SMTP credentials not provided — creating Ethereal test account for local testing.');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}

let transporter;
createTransporter()
  .then(t => {
    transporter = t;
    transporter.verify().then(() => {
      console.log('Mailer ready.');
    }).catch(err => {
      console.error('Mailer verification failed:', err && err.message ? err.message : err);
    });
  })
  .catch(err => {
    console.error('Failed to create transporter:', err && err.message ? err.message : err);
  });

// health
app.get('/api/ping', (req,res)=>res.json({ok:true}));

// debug endpoint to inspect env & mailer status (dev only)
app.get('/api/debug-mail', (req, res) => {
  res.json({
    smtpHost: process.env.SMTP_HOST || null,
    smtpUserSet: !!process.env.SMTP_USER,
    mailerReady: !!transporter,
  });
});

app.post('/api/enquiry', async (req, res) => {
  try {
    const { name, email, location } = req.body;
    if (!name || !email || !location) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!transporter) {
      return res.status(500).json({ error: 'Mailer not configured' });
    }

    const mailOptions = {
      from: `"Website Enquiry" <${process.env.SMTP_USER || 'no-reply@example.com'}>`,
      to: DEST_EMAIL,
      subject: `Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPreferred location: ${location}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Location:</strong> ${location}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, log the preview URL
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return res.json({ ok: true, messageId: info.messageId, preview: nodemailer.getTestMessageUrl(info) || null });
  } catch (err) {
    console.error('Enquiry error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));