import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';

function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>E‑Smart Services — Demo Home</h1>
      <p>Welcome — go to the About page to send an enquiry.</p>
      <Link to="/about">About & Enquiry</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="container">
          <h2 className="logo"><Link to="/">E‑Smart Demo</Link></h2>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} E‑Smart Demo</div>
      </footer>
    </BrowserRouter>
  );
}