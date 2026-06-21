import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SiInstagram, SiTiktok, SiShopee } from 'react-icons/si';
import { FiChevronRight, FiGrid, FiUser } from 'react-icons/fi';

const Network = () => {
  const [networkItems, setNetworkItems] = useState([]);

  useEffect(() => {
    api.get('/network')
      .then(res => setNetworkItems(res.data))
      .catch(() => {});
  }, []);

  if (networkItems.length === 0) return null;

  const corporateItems = networkItems.filter(item => item.group === 'Corporate');
  const personalItems = networkItems.filter(item => item.group === 'Personal');

  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <SiInstagram size={20} className="text-pink-500" />;
      case 'tiktok': return <SiTiktok size={20} className="text-cyan-400" />;
      case 'shopee': return <SiShopee size={20} className="text-orange-500" />;
      default: return <FiGrid size={20} className="text-gray-400" />;
    }
  };

  const renderList = (items) => (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <a 
          key={item.id} 
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white/10 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#0a0d18] flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
            {getIcon(item.platform)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-sm truncate group-hover:text-cyan-400 transition-colors">{item.title}</h4>
            <p className="text-gray-400 text-xs truncate mt-0.5">{item.subtitle}</p>
          </div>
          <FiChevronRight className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" size={18} />
        </a>
      ))}
    </div>
  );

  return (
    <section id="network" className="py-24 relative bg-[#060913]">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-4 border border-violet-500/20">
            Network
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ekosistem <span className="text-gradient-cyan">Digital</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Platform dan entitas yang telah saya kembangkan dan kelola secara profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* Corporate Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
                <FiGrid size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Corporate Ecosystem</h3>
            </div>
            {renderList(corporateItems)}
          </div>

          {/* Personal Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0">
                <FiUser size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Personal Branding</h3>
            </div>
            {renderList(personalItems)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Network;
