import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => {
    return (
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p>If you have any questions, feel free to reach out to us using the form below.</p>
            <ContactForm />
        </div>
    );
};

export default Contact;