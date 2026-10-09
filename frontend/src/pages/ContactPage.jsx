import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Phone, MapPin, Send, ArrowRight, ArrowLeft, Target, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    objectif: '',
    discussion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', objectif: '', discussion: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden font-sans relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/10 blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass w-fit text-xs border-white/10 text-[#06B6D4] mb-3 mx-auto shadow-lg">
            Get in touch
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold font-['Sora'] mb-4">
            Contact <span className="text-gradient">BizMind AI</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Have a business project, objective, or strategic inquiry? Send us your message and let's turn your ideas into reality.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <div className="glass p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden bg-[#0F172A]/80 backdrop-blur-xl">
              <h3 className="text-2xl font-bold font-['Sora'] mb-6">Demande Client</h3>
              
              {isSent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <span>Votre message et objectif ont été envoyés avec succès! Nous vous contacterons très bientôt.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Nom & Prénom *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] text-sm transition-colors"
                      placeholder="votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Email *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] text-sm transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#06B6D4]" /> Objectif du Projet *
                  </label>
                  <input
                    type="text" name="objectif" value={formData.objectif} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] text-sm transition-colors"
                    placeholder="ex: Lancement startup SaaS / Recherche de financement / Etude de marché"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" /> Discussion & Description *
                  </label>
                  <textarea
                    name="discussion" value={formData.discussion} onChange={handleChange} required rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED] text-sm transition-colors resize-none"
                    placeholder="Décrivez votre projet, vos besoins spécifiques et tous les détails importants pour la discussion..."
                  ></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 mt-2 cursor-pointer">
                  {isSubmitting ? 'Envoi en cours...' : (
                    <>Envoyer le Message <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Direct Contact Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col gap-6">
            
            <div className="glass p-6 sm:p-8 rounded-3xl border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-[#06B6D4]">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-['Sora'] mb-1">Email Direct</h4>
              <p className="text-xs text-slate-400 font-light mb-2">Envoyez vos e-mails directement à notre équipe</p>
              <a href="mailto:yousseflouhichi762@gmail.com" className="text-base font-semibold hover:text-[#06B6D4] transition-colors">
                yousseflouhichi762@gmail.com
              </a>
            </div>

            <div className="glass p-6 sm:p-8 rounded-3xl border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-[#7C3AED]">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-['Sora'] mb-1">Téléphone / Numéro</h4>
              <p className="text-xs text-slate-400 font-light mb-2">Contactez-nous directement par téléphone</p>
              <a href="tel:+21651231141" className="text-base font-semibold hover:text-[#7C3AED] transition-colors">
                +216 51 231 141
              </a>
            </div>

            <div className="glass p-6 sm:p-8 rounded-3xl border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-[#2563EB]">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-['Sora'] mb-1">Local / Adress</h4>
              <p className="text-xs text-slate-400 font-light mb-1">Emplacement & Siège</p>
              <p className="text-base font-semibold text-white">
                Sfax, Tunisie
              </p>
            </div>

            {/* Developer Profiles */}
            <div className="glass p-6 sm:p-8 rounded-3xl border-white/10 hover:border-white/20 transition-all duration-300">
              <h4 className="text-lg font-bold font-['Sora'] mb-4">Profil Developpeur</h4>
              <div className="flex flex-col gap-3">
                <a href="https://linkedin.com/in/youssef-louhichi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all text-[#2563EB] shrink-0">
                    <LinkedinIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-[#2563EB] transition-colors">Youssef Louhichi (LinkedIn)</p>
                    <p className="text-xs text-slate-400 font-light">linkedin.com/in/youssef-louhichi</p>
                  </div>
                </a>
                <a href="https://github.com/Louhichi-Youssef" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all text-white shrink-0">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-slate-300 transition-colors">GitHub Repository</p>
                    <p className="text-xs text-slate-400 font-light">github.com/Louhichi-Youssef</p>
                  </div>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
