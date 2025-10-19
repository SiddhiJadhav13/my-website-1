import React, { useState } from 'react';
import EnquiryForm from '../components/EnquiryForm';
import ImageGallery from '../components/ImageGallery';
import '../styles.css';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <button className="acc-btn" onClick={() => setOpen(!open)}>
        {title} <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="acc-panel">{children}</div>}
    </div>
  );
}

export default function About() {
  return (
    <main className="container about-page">
      <section className="hero-spot">
        <div className="hero-content">
          <h1>About E‑Smart Services</h1>
          <p>Doorstep rental agreement registration — fast, secure and end‑to‑end service.</p>
          <a className="cta" href="#enquiry">Send an Enquiry</a>
        </div>
        <div className="hero-image" aria-hidden="true" />
      </section>

      <section className="three-col">
        <div className="col">
          <h2>How it works</h2>
          <AccordionItem title="Door‑step Registration">
            <p>We draft, verify and register at your home — witnesses and stamping handled.</p>
          </AccordionItem>
          <AccordionItem title="Three‑step Process">
            <ol>
              <li>Contact — Book online or by phone.</li>
              <li>Draft — We prepare the agreement and share for review.</li>
              <li>Registration — We complete signing and register the agreement.</li>
            </ol>
          </AccordionItem>
        </div>

        <div className="col highlight">
          <h2>Why choose us</h2>
          <ul className="feature-list">
            <li>Same‑day appointments (where available)</li>
            <li>Doorstep convenience</li>
            <li>Registered agreement accepted as address proof</li>
          </ul>
          <div className="card-grid">
            <div className="card">Home Visit</div>
            <div className="card">Fast Booking</div>
            <div className="card">Trusted Process</div>
          </div>
        </div>

        <div className="col" id="enquiry">
          <h2>Send an Enquiry</h2>
          <p>Tell us your name, email and preferred location — we’ll reach out.</p>
          <EnquiryForm />
        </div>
      </section>

      <section className="gallery-section">
        <h2>Service Gallery</h2>
        <p>Click any image to enlarge.</p>
        <ImageGallery />
      </section>

      <div className="about-card">
        <h2>About BrightSite</h2>
        <p>We match buyers with great properties. Fast replies — just send an enquiry.</p>
        <ul>
          <li>Friendly support</li>
          <li>Fast responses</li>
          <li>Secure handling of enquiries</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1505691723518-36a3f673b5c5?w=800&q=60" alt="team" />
      </div>
    </main>
  );
}