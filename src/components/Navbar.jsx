import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Portofolio', href: '#portfolio' },
    { label: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080b14]/90 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-display font-bold tracking-wide">
          <span className="text-white">Porto</span>
          <span className="text-cyan-400">ku.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide">
              {link.label}
            </a>
          ))}
          <Link to="/admin/login" className="px-5 py-2 rounded-full border border-cyan-400/30 text-cyan-400 text-sm font-medium hover:bg-cyan-400/10 transition-all">
            Login Admin
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#080b14]/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4 animate-fade-in-up">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white transition-colors text-base py-2">
              {link.label}
            </a>
          ))}
          <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block text-cyan-400 text-base py-2 border-t border-white/5 pt-4 mt-2">
            Login Admin
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
