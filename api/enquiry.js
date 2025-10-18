const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, location } = req.body || {};
    if (!name || !email || !location) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Use SendGrid if configured
    if (SENDGRID_API_KEY && EMAIL_TO && EMAIL_FROM) {
      const payload = {
        personalizations: [{ to: [{ email: EMAIL_TO }], subject: 'New enquiry from website' }],
        from: { email: EMAIL_FROM, name: 'Website' },
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nEmail: ${email}\nLocation: ${location}`,
          },
        ],
      };

      const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (r.status === 202) {
        return res.status(200).json({ message: 'Email sent' , messageId: r.headers.get('x-message-id') || null });
      } else {
        const txt = await r.text();
        return res.status(500).json({ error: `SendGrid error ${r.status}: ${txt}` });
      }
    }

    // No provider configured
    return res.status(500).json({
      error: 'No mail provider configured. Set SENDGRID_API_KEY, EMAIL_TO and EMAIL_FROM in Vercel env.',
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
};