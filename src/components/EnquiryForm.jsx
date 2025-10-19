import React, { useState } from 'react';
import './../../../styles.css';

export default function EnquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', location: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);

  // Update form values
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setServerInfo(null);

    if (!form.name || !form.email || !form.location) {
      setStatus({ type: 'error', message: 'Please complete all fields.' });
      return;
    }

    setLoading(true);
    try {
      // call same-origin serverless function
      const res = await fetch(`/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      let data;
      try { data = await res.json(); } catch { data = { error: await res.text().catch(() => '') || 'Invalid JSON' }; }

      if (res.ok) {
        setStatus({ type: 'success', message: 'Enquiry sent — check your inbox soon.' });
        setForm({ name: '', email: '', location: '' });
        setServerInfo(data);
      } else {
        setStatus({ type: 'error', message: data?.error || `Server ${res.status}` });
        setServerInfo(data);
      }
    } catch (err) {
      console.error('Enquiry send error:', err);
      setStatus({ type: 'error', message: `Network error — ${err?.message || 'could not send enquiry.'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="enquiry-card" onSubmit={handleSubmit}>
      <h3>Send an Enquiry</h3>
      <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email address" type="email" value={form.email} onChange={handleChange} />
      <input name="location" placeholder="Preferred location" value={form.location} onChange={handleChange} />
      <button type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send Enquiry'}</button>

      {status && <div className={`form-status ${status.type}`}>{status.message}</div>}

      {serverInfo && serverInfo.messageId && <div className="info">Message ID: {serverInfo.messageId}</div>}
    </form>
  );
}
