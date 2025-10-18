import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="hero">
            <h1>Welcome to My Website</h1>
            <p>Your one-stop solution for all services.</p>
            <a href="#services" className="cta-button">Explore Services</a>
        </div>
    );
};

export default Hero;