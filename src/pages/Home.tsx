import React from 'react';
import Hero from '../components/Hero';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <div>
            <Hero />
            <Services />
            <About />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;