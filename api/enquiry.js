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
    const DEST_EMAIL = process.env.DEST_EMAIL;
    const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !DEST_EMAIL) {
      return res.status(500).json({
        error:
          'SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, DEST_EMAIL and EMAIL_FROM in Vercel environment variables.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // optional: transporter.verify() could be used here to fail fast

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: DEST_EMAIL,
      subject: 'New enquiry from website',
      text: `Name: ${name}\nEmail: ${email}\nLocation: ${location}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Location:</strong> ${location}</p>`,
    });

    return res.status(200).json({ message: 'Email sent', messageId: info.messageId });
  } catch (err) {
    console.error('API /api/enquiry error:', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
};