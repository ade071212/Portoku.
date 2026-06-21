import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiFacebook, FiShoppingCart, FiVideo, FiTrendingUp, FiHash, FiTarget } from 'react-icons/fi';

const iconMap = {
  '⚛️': FiFacebook,
  '🚀': FiShoppingCart,
  '🎨': FiVideo,
  '📘': FiTrendingUp,
  '🗄️': FiHash,
  '☁️': FiTarget,
};

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills')
      .then(res => setSkills(res.data))
      .catch(() => {});
  }, []);

  if (skills.length === 0) return null;

  return (
    <section id="layanan" className="py-24 relative bg-gradient-radial-top">
      {/* Gradient separator line */}
      <div className="gradient-line mb-24"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Keahlian <span className="text-gradient-cyan italic">Utama</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = Object.values(iconMap)[index % Object.keys(iconMap).length];
            return (
              <div 
                key={skill.id} 
                className="glass-card glass-card-hover p-8 text-center transition-all duration-300 cursor-default group"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {skill.iconUrl ? (
                    <img src={skill.iconUrl} alt={skill.skillName} className="w-full h-full object-contain" />
                  ) : IconComponent ? (
                    <IconComponent size={40} strokeWidth={1.5}/>
                  ) : (
                    <span className="text-4xl">{skill.icon}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{skill.skillName}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{skill.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
