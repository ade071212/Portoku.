import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageLightbox from './ImageLightbox';

const ProjectsGallery = () => {
  const [projects, setProjects] = useState([]);
  const [contactData, setContactData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxData, setLightboxData] = useState({ isOpen: false, imageUrl: '', altText: '' });

  useEffect(() => {
    Promise.all([
      api.get('/portfolio'),
      api.get('/contact')
    ])
      .then(([resPortfolio, resContact]) => {
        setProjects(resPortfolio.data);
        setContactData(resContact.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <section id="portfolio" className="py-24">
        <div className="container mx-auto px-6 lg:px-16 text-center text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Loading...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 relative bg-gradient-radial-bottom">
      {/* Gradient separator line */}
      <div className="gradient-line mb-24"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white"
            dangerouslySetInnerHTML={{ __html: contactData.portfolioTitle || 'Portofolio & <span class="text-gradient-cyan italic">Karya</span>' }}
          />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            {contactData.portfolioDescription || 'Kumpulan visual campaign, laporan analitik, dan hasil optimasi yang telah saya kerjakan.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-cyan-400 text-gray-900 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div 
              key={project.id} 
              className="glass-card overflow-hidden group transition-all duration-500 hover:border-cyan-400/30 hover:-translate-y-2"
            >
              {/* Image */}
              <div 
                className="aspect-[3/4] w-full overflow-hidden relative cursor-pointer"
                onClick={() => setLightboxData({ isOpen: true, imageUrl: project.imageUrl, altText: project.title })}
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent opacity-90"></div>

                {/* Video badge */}
                {project.type === 'video' && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg width="10" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 relative">
                <span className="text-cyan-400 text-xs uppercase tracking-wider font-medium">{project.category}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                
                {project.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/5">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageLightbox 
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.imageUrl}
        altText={lightboxData.altText}
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
      />
    </section>
  );
};

export default ProjectsGallery;
