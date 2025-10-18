import React, { useState } from 'react';

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
      // Use environment variable for API base URL; fallback to localhost
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Enquiry sent — we will contact you soon.' });
        setForm({ name: '', email: '', location: '' });
        setServerInfo(data);
      } else {
        setStatus({ type: 'error', message: data?.error || 'Failed to send enquiry.' });
        setServerInfo(data);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error — could not send enquiry.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>
        Preferred Location to Buy
        <input name="location" value={form.location} onChange={handleChange} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Enquiry'}
      </button>

      {status && (
        <div className={`form-status ${status.type}`}>
          {status.message}
        </div>
      )}

      {serverInfo && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          {serverInfo.preview && (
            <div>
              Preview URL (test email):{' '}
              <a href={serverInfo.preview} target="_blank" rel="noreferrer">
                {serverInfo.preview}
              </a>
            </div>
          )}
          {serverInfo.messageId && <div>Message ID: {serverInfo.messageId}</div>}
          {serverInfo.error && <div style={{ color: 'crimson' }}>Server error: {serverInfo.error}</div>}
        </div>
      )}
    </form>
  );
}
