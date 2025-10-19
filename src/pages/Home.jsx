import React from 'react';
import EnquiryForm from '../components/EnquiryForm';

export default function Home() {
  return (
    <div className="home-grid">
      <section className="hero">
        <h1>Beautiful homes, simple enquiries</h1>
        <p>Find listings and contact us quickly. Enter details in the form to get started.</p>
        <div className="hero-images">
          <img src="https://images.unsplash.com/photo-1560448070-c9b5a9b6f2b4?w=800&q=60" alt="home" />
          <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=60" alt="interior" />
        </div>
      </section>

      <aside className="form-area">
        <EnquiryForm />
      </aside>
    </div>
  );
}