import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="brand">BrightSite</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} BrightSite</footer>
    </BrowserRouter>
  );
}