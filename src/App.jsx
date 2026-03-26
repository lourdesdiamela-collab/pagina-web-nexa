import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Services from './pages/Services';
import Cases from './pages/Cases';
import Academy from './pages/Academy';
import Contact from './pages/Contact';
import Article from './pages/Article';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="bg-noise" />
    <WhatsAppFloat />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Services />} />
      <Route path="/casos" element={<Cases />} />
      <Route path="/aprende" element={<Academy />} />
      <Route path="/aprende/:slug" element={<Article />} />
      <Route path="/contacto" element={<Contact />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
