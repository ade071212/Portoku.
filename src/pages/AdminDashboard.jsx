import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiLogOut, FiPlus, FiTrash2, FiEdit3, FiSave, FiX, FiGrid, FiAward, FiCode, FiMail, FiUser, FiUpload } from 'react-icons/fi';

const TABS = [
  { id: 'hero', label: 'Hero Section', icon: FiUser },
  { id: 'portfolio', label: 'Portfolio', icon: FiGrid },
  { id: 'skills', label: 'Skills', icon: FiCode },
  { id: 'network', label: 'Network', icon: FiAward },
  { id: 'contact', label: 'Contact', icon: FiMail },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [data, setData] = useState({ hero: {}, portfolio: [], skills: [], network: [], contact: {} });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [hero, portfolio, skills, network, contact] = await Promise.all([
        api.get('/hero'),
        api.get('/portfolio'),
        api.get('/skills'),
        api.get('/network'),
        api.get('/contact'),
      ]);
      setData({
        hero: hero.data,
        portfolio: portfolio.data,
        skills: skills.data,
        network: network.data,
        contact: contact.data,
      });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleDelete = async (entity, id) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    try {
      await api.delete(`/${entity}/${id}`);
      setData(prev => ({
        ...prev,
        [entity]: prev[entity].filter(item => item.id !== id),
      }));
    } catch (err) {
      alert('Gagal menghapus item.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(getEmptyForm(activeTab));
    setShowForm(true);
  };

  const getEmptyForm = (tab) => {
    switch (tab) {
      case 'portfolio': return { title: '', category: '', type: 'image', imageUrl: '', videoLink: '', description: '', createdDate: '', tags: [] };
      case 'skills': return { skillName: '', icon: '', iconUrl: '', description: '' };
      case 'network': return { group: 'Corporate', platform: 'Instagram', title: '', subtitle: '', url: '' };
      default: return {};
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'contact') {
        await api.put('/contact', formData);
        setData(prev => ({ ...prev, contact: formData }));
      } else if (activeTab === 'hero') {
        await api.put('/hero', formData);
        setData(prev => ({ ...prev, hero: formData }));
      } else if (editingItem) {
        const res = await api.put(`/${activeTab}/${editingItem}`, formData);
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(item => item.id === editingItem ? res.data : item),
        }));
      } else {
        const res = await api.post(`/${activeTab}`, formData);
        setData(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], res.data],
        }));
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      alert('Gagal menyimpan. Pastikan Anda sudah login.');
    } finally {
      setSaving(false);
    }
  };

  const handleContactEdit = () => {
    setFormData({ ...data.contact });
    setEditingItem('contact');
    setShowForm(true);
  };

  const handleHeroEdit = () => {
    setFormData({ ...data.hero });
    setEditingItem('hero');
    setShowForm(true);
  };

  const renderFormFields = () => {
    if (activeTab === 'hero') {
      return (
        <>
          <FormField label="Nama" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
          <FormField label="Badge / Label" value={formData.badge} onChange={v => setFormData({...formData, badge: v})} />
          <FormField label="Headline (HTML allowed)" value={formData.headline} onChange={v => setFormData({...formData, headline: v})} />
          <FormTextArea label="Deskripsi Singkat" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="CTA Utama" value={formData.ctaPrimary} onChange={v => setFormData({...formData, ctaPrimary: v})} />
            <FormField label="CTA Sekunder" value={formData.ctaSecondary} onChange={v => setFormData({...formData, ctaSecondary: v})} />
          </div>
          <FormImageUpload label="Foto Profil" value={formData.profileImage} onChange={v => setFormData({...formData, profileImage: v})} />
        </>
      );
    }
    if (activeTab === 'portfolio') {
      return (
        <>
          <FormField label="Judul Proyek" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
          <FormField label="Kategori" value={formData.category} onChange={v => setFormData({...formData, category: v})} placeholder="e.g. Frontend, Fullstack, Mobile" />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Tipe" value={formData.type} onChange={v => setFormData({...formData, type: v})} options={['image', 'video']} />
            <FormField label="Tanggal" value={formData.createdDate} onChange={v => setFormData({...formData, createdDate: v})} type="date" />
          </div>
          <FormImageUpload label="Gambar Portfolio" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
          <FormField label="Atau URL Gambar Manual" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} placeholder="https://..." />
          {formData.type === 'video' && (
            <FormField label="Link Video" value={formData.videoLink} onChange={v => setFormData({...formData, videoLink: v})} placeholder="https://youtube.com/..." />
          )}
          <FormTextArea label="Deskripsi" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
          <FormField label="Tags (pisah koma)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={v => setFormData({...formData, tags: v.split(',').map(t => t.trim()).filter(Boolean)})} placeholder="React, Node.js, PostgreSQL" />
        </>
      );
    }
    if (activeTab === 'skills') {
      return (
        <>
          <div className="grid grid-cols-[1fr_80px] gap-4">
            <FormField label="Nama Skill" value={formData.skillName} onChange={v => setFormData({...formData, skillName: v})} />
            <FormField label="Ikon Emoji" value={formData.icon} onChange={v => setFormData({...formData, icon: v})} placeholder="⚛️" />
          </div>
          <FormImageUpload label="Atau Upload Icon (Gambar)" value={formData.iconUrl} onChange={v => setFormData({...formData, iconUrl: v})} />
          <FormTextArea label="Deskripsi" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
        </>
      );
    }
    if (activeTab === 'network') {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Grup" value={formData.group} onChange={v => setFormData({...formData, group: v})} options={['Corporate', 'Personal']} />
            <FormSelect label="Platform" value={formData.platform} onChange={v => setFormData({...formData, platform: v})} options={['Instagram', 'TikTok', 'Shopee', 'Other']} />
          </div>
          <FormField label="Judul" value={formData.title} onChange={v => setFormData({...formData, title: v})} placeholder="Ranuna Indonesia" />
          <FormField label="Subjudul / Deskripsi" value={formData.subtitle} onChange={v => setFormData({...formData, subtitle: v})} placeholder="Brand Management" />
          <FormField label="URL Tujuan" value={formData.url} onChange={v => setFormData({...formData, url: v})} placeholder="https://..." />
        </>
      );
    }
    if (activeTab === 'contact') {
      return (
        <>
          <FormField label="Nomor WA atau Link (http...)" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} placeholder="0812... atau https://wa.me/..." />
          <FormField label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#080b14]/90 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-display font-bold"><span className="text-white">Porto</span><span className="text-cyan-400">ku.</span></span>
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-gray-400 hover:text-white text-sm transition-colors">View Site ↗</a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-sm">
              <FiLogOut size={14}/> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Tabs */}
        <nav className="w-56 shrink-0">
          <div className="glass-card p-3 sticky top-24 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon size={16}/> {tab.label}
                {tab.id !== 'contact' && tab.id !== 'hero' && (
                  <span className="ml-auto text-xs opacity-60">{data[tab.id]?.length || 0}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white capitalize">{activeTab}</h2>
            {activeTab !== 'contact' && activeTab !== 'hero' && (
              <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm">
                <FiPlus size={16}/> Tambah Baru
              </button>
            )}
            {activeTab === 'contact' && (
              <button onClick={handleContactEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all text-sm">
                <FiEdit3 size={16}/> Edit Contact
              </button>
            )}
            {activeTab === 'hero' && (
              <button onClick={handleHeroEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all text-sm">
                <FiEdit3 size={16}/> Edit Hero Section
              </button>
            )}
          </div>

          {/* Modal Form */}
          {showForm && (
            <div className="glass-card p-6 mb-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{editingItem ? 'Edit Item' : 'Tambah Item Baru'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors"><FiX size={20}/></button>
              </div>
              <div className="space-y-4">
                {renderFormFields()}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-all text-sm disabled:opacity-50">
                    <FiSave size={14}/> {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all text-sm">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table/Cards */}
          {activeTab === 'contact' || activeTab === 'hero' ? (
            <div className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data[activeTab] || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-gray-500">{key}</span>
                    {key.toLowerCase().includes('image') || key.toLowerCase().includes('iconurl') ? (
                       <img src={value} alt={key} className="h-20 object-contain self-start mt-2 rounded-lg border border-white/10" />
                    ) : (
                       <span className="text-white">{value || '-'}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {data[activeTab]?.length === 0 && (
                <div className="glass-card p-12 text-center text-gray-500">
                  Belum ada data. Klik "Tambah Baru" untuk menambah item pertama.
                </div>
              )}
              {data[activeTab]?.map(item => (
                <div key={item.id} className="glass-card p-5 flex items-center gap-5 group hover:border-cyan-400/30 transition-all">
                  {/* Icon/Image */}
                  {activeTab === 'portfolio' && item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  {(activeTab === 'skills' || activeTab === 'network') && (
                    <div className="shrink-0 w-12 flex items-center justify-center">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="icon" className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-3xl">{item.icon || (item.platform ? item.platform.charAt(0) : '')}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{item.title || item.skillName}</h4>
                    <p className="text-gray-400 text-sm truncate">{item.description || item.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.category && <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">{item.category}</span>}
                      {item.group && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">{item.group}</span>}
                      {item.createdDate && <span className="text-xs text-gray-500">{item.createdDate}</span>}
                      {item.tags && item.tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{tag}</span>)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <FiEdit3 size={14}/>
                    </button>
                    <button onClick={() => handleDelete(activeTab, item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                      <FiTrash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Reusable form components
const FormField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
    />
  </div>
);

const FormTextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm resize-none"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm"
    >
      {options.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
    </select>
  </div>
);

const FormImageUpload = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // The API returns the path e.g. /uploads/123.jpg or a full URL from ImgBB
      const url = res.data.url;
      const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
      onChange(fullUrl);
    } catch (err) {
      alert('Gagal mengupload gambar.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-white/10" />
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-medium transition-all text-sm disabled:opacity-50"
          >
            {uploading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <FiUpload size={16} />
            )}
            {uploading ? 'Mengupload...' : 'Pilih File Gambar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
