import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const [contact, setContact] = useState({});

  useEffect(() => {
    api.get('/contact')
      .then(res => setContact(res.data))
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" className="py-24 relative">
      {/* Gradient separator */}
      <div className="gradient-line mb-24"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* CTA Card */}
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          {/* Subtle glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative z-10"
            dangerouslySetInnerHTML={{ __html: contact.ctaTitle || 'Siap Melejitkan <span class="text-gradient-cyan italic">Brand Anda?</span>' }}
          />
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed relative z-10">
            {contact.ctaDescription || 'Konsultasikan strategi digital marketing atau pengelolaan marketplace Anda sekarang secara gratis.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a 
              href={contact.phone ? (contact.phone.startsWith('http') ? contact.phone : `https://wa.me/${contact.phone.replace(/\D/g, '')}`) : '#'} 
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.716-1.244A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.153 0-4.159-.655-5.822-1.778l-.407-.268-3.566.94.956-3.49-.294-.467A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Hubungi via WhatsApp
            </a>
            <a 
              href={contact.email ? `mailto:${contact.email}` : '#'} 
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-cyan-400/40 text-cyan-400 font-bold text-base hover:bg-cyan-400/5 transition-all hover:scale-105 active:scale-95"
            >
              <FiMail size={18}/>
              Kirim Email
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold">
              <span className="text-white">Porto</span><span className="text-cyan-400">ku.</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Creative Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {contact.email && (
              <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <FiMail size={18}/>
              </a>
            )}
            {contact.phone && (
              <a href={contact.phone.startsWith('http') ? contact.phone : `https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <FiPhone size={18}/>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
