import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    api.get('/hero')
      .then(res => setHeroData(res.data))
      .catch(() => {});
  }, []);

  const data = heroData || {
    name: 'Ade Irawan',
    badge: '🔥 Digital Marketing Specialist',
    headline: 'Meningkatkan <span>Brand Awareness</span> & Konversi Anda.',
    description: 'Saya adalah Digital Marketing yang memiliki kemampuan dalam membangun ekosistem bisnis online secara menyeluruh. Berpengalaman di dunia digital selama 3 tahun, saya fokus pada hasil nyata mulai dari merancang strategi konten di TikTok dan Instagram hingga optimasi penjualan di E-commerce.',
    ctaPrimary: 'Lihat Karya Saya',
    ctaSecondary: 'Konsultasi Gratis',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop&crop=face'
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 bg-gradient-radial-top">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-cyan-400 font-semibold text-lg mb-3 font-display">{data.name}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm mb-8">
              {data.badge}
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight [&>span]:text-gradient-cyan"
              dangerouslySetInnerHTML={{ __html: data.headline }}
            />
            
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
              {data.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href="#portfolio" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-base hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] w-full sm:w-auto">
                {data.ctaPrimary}
              </a>
              <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-cyan-400/40 text-cyan-400 font-bold text-base hover:bg-cyan-400/5 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                {data.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up order-1 lg:order-2 w-full max-w-sm mx-auto lg:max-w-none lg:mx-0 mb-10 lg:mb-0" style={{animationDelay: '0.2s'}}>
            <div className="relative w-[85%] max-w-[280px] sm:max-w-[320px] lg:w-[380px] lg:max-w-none mx-auto">
              {/* Decorative border frame */}
              <div className="absolute -inset-3 rounded-2xl border border-white/10 pointer-events-none"></div>
              <div className="absolute -inset-6 rounded-3xl border border-white/5 pointer-events-none hidden sm:block"></div>
              
              {/* Photo container */}
              <div className="relative w-full aspect-[4/5] lg:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
                <img 
                  src={data.profileImage}
                  alt={data.name}
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#080b14] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
