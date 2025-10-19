const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, location } = req.body || {};
    if (!name || !email || !location) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Read SMTP config from environment (set these in Vercel)
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
    const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const DEST_EMAIL = process.env.DEST_EMAIL || 'sidjadhav132005@gmail.com';
    const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !DEST_EMAIL) {
      console.error('SMTP config missing', { SMTP_HOST: !!SMTP_HOST, SMTP_USER: !!SMTP_USER, DEST_EMAIL: !!DEST_EMAIL });
      return res.status(500).json({ error: 'SMTP not configured on server. Set SMTP_* and DEST_EMAIL in Vercel.' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // verify transporter quickly to give clearer errors
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('Transporter verify failed:', verifyErr);
      return res.status(500).json({ error: 'SMTP connection failed. Check SMTP credentials.' });
    }

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: DEST_EMAIL,
      subject: `Website Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nLocation: ${location}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Location:</strong> ${location}</p>`,
    });

    return res.status(200).json({ message: 'Email sent', messageId: info.messageId || null });
  } catch (err) {
    // log full error to Vercel logs, but return a safe message to client
    console.error('/api/enquiry error:', err && (err.stack || err.message || err));
    return res.status(500).json({ error: 'Internal server error sending email.' });
  }
};