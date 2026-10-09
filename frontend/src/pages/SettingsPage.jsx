import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Sparkles, CheckCircle2, Save, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, loading } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    aiProvider: 'groq',
    autoSave: true,
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative px-4 sm:px-6 py-6">
        <div className="absolute top-[-20%] left-[50%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold font-['Sora'] mb-2">Settings & Profile</h1>
            <p className="text-slate-400 text-sm">
              Manage your personal account details, preferred AI engines, and application settings.
            </p>
          </header>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Settings and profile updated successfully!</span>
            </motion.div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* User Profile Card */}
            <div className="glass rounded-2xl p-6 border border-white/8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-['Sora']">Profile Information</h2>
                  <p className="text-xs text-slate-400">Update your account name and email address</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Settings Card */}
            <div className="glass rounded-2xl p-6 border border-white/8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-['Sora']">AI & Generation Preferences</h2>
                  <p className="text-xs text-slate-400">Configure multi-agent model behavior</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Primary AI Provider</label>
                  <select
                    name="aiProvider"
                    value={profile.aiProvider}
                    onChange={handleChange}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED] text-sm cursor-pointer"
                  >
                    <option value="groq">Groq (Llama-3.3 70B) - Super Fast (Primary)</option>
                    <option value="gemini">Google Gemini 2.0 Flash (Fallback)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-white/5 mt-4">
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Save Generated Business Plans</p>
                    <p className="text-xs text-slate-400">Automatically persist AI plans to MongoDB history</p>
                  </div>
                  <input
                    type="checkbox"
                    name="autoSave"
                    checked={profile.autoSave}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
