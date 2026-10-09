import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LineChart, FileText, Target, Shield, FileOutput, ArrowRight, Menu, X, Play, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/15 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/15 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/15 blur-[120px]" 
        />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-lg shadow-black/20' : 'bg-transparent py-6'}`}>
        <div className="max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-['Sora'] tracking-tight">BizMind AI</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="hidden md:flex items-center gap-10 text-base font-medium text-slate-300">
            <a href="#features" className="hover:text-white hover:-translate-y-0.5 transition-all">Features</a>
            <a href="#how-it-works" className="hover:text-white hover:-translate-y-0.5 transition-all">How it works</a>
            <a href="#pricing" className="hover:text-white hover:-translate-y-0.5 transition-all">Pricing</a>
            <div className="group relative cursor-pointer flex items-center gap-1 hover:text-white hover:-translate-y-0.5 transition-all">
              <span>Resources</span> <ArrowRight className="w-4 h-4 rotate-90 group-hover:rotate-180 transition-transform duration-300" />
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-base font-medium hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3 rounded-xl text-base font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:-translate-y-1">
              Get Started
            </Link>
          </motion.div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-36 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 text-center md:text-left flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="md:w-1/2 flex flex-col gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass w-fit text-sm border-white/10 text-slate-200 mb-2 mx-auto md:mx-0 shadow-lg"
            >
              <span className="text-yellow-400 animate-pulse">✨</span> The New Standard in AI Business
            </motion.div>
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-extrabold font-['Sora'] leading-[1.1]">
              Your AI Co-Pilot<br />for Building <br className="hidden md:block" />
              <span className="text-gradient">Smarter Businesses</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
              BizMind AI uses multi-agent intelligence to create business plans, analyze markets, and generate winning strategies tailored for your success.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 justify-center md:justify-start">
              <Link to="/register" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-4 rounded-xl font-semibold transition-all w-full sm:w-auto shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] hover:-translate-y-1 text-lg flex items-center justify-center gap-2 group">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-semibold border-2 border-white/20 hover:bg-white/10 transition-all w-full sm:w-auto text-lg hover:-translate-y-1">
                <Play className="w-5 h-5 fill-current" /> Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="md:w-1/2 w-full relative"
          >
            <div className="glass rounded-3xl p-6 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0F172A]/80 backdrop-blur-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-sm text-slate-400 font-medium ml-2">BizMind Workspace</div>
              </div>
              <div className="flex gap-6">
                <div className="w-1/4 flex flex-col gap-4">
                  <motion.div animate={{ width: ['100%', '80%', '100%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-3 rounded bg-white/10"></motion.div>
                  <motion.div animate={{ width: ['75%', '90%', '75%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-3 rounded bg-white/10"></motion.div>
                  <motion.div animate={{ width: ['83%', '70%', '83%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-3 rounded bg-white/10"></motion.div>
                  <div className="h-3 rounded bg-[#2563EB]/40 w-full mt-6 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                </div>
                <div className="w-3/4 flex flex-col gap-6">
                  <div className="h-56 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 border border-white/5 p-5 flex items-end gap-3">
                    {[40, 70, 55, 90, 65, 80].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }} 
                        animate={{ height: `${h}%` }} 
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="w-full bg-gradient-to-t from-[#06B6D4] to-[#2563EB] rounded-t-md opacity-90"
                      />
                    ))}
                  </div>
                  <div className="flex gap-5">
                    <motion.div whileHover={{ scale: 1.05 }} className="flex-1 h-28 rounded-2xl glass border-white/5 flex items-center justify-center">
                       <Target className="w-8 h-8 text-[#7C3AED] opacity-50" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex-1 h-28 rounded-2xl glass border-white/5 flex items-center justify-center">
                       <LineChart className="w-8 h-8 text-[#06B6D4] opacity-50" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 glass p-5 rounded-2xl border-white/10 shadow-2xl bg-[#0F172A]/90"
            >
              <BrainCircuit className="w-10 h-10 text-[#06B6D4]" />
            </motion.div>
          </motion.div>
        </section>

        {/* Social Proof */}
        <motion.section 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="py-16 border-y border-white/5 bg-white/[0.01]"
        >
          <div className="max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 text-center">
            <p className="text-base font-medium text-slate-400 mb-10 uppercase tracking-[0.2em]">Trusted by innovators</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-bold font-['Sora']">Google</span>
              <span className="text-2xl font-bold font-['Sora']">Microsoft</span>
              <span className="text-2xl font-bold font-['Sora']">OpenAI</span>
              <span className="text-2xl font-bold font-['Sora']">NVIDIA</span>
              <span className="text-2xl font-bold font-['Sora']">Stripe</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-6xl mx-auto">
              {[
                { label: 'Active Users', value: '10K+' },
                { label: 'Business Plans', value: '25K+' },
                { label: 'Reports Generated', value: '50K+' },
                { label: 'User Satisfaction', value: '95%' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="glass p-8 rounded-2xl border-white/5 flex flex-col items-center transition-colors cursor-pointer"
                >
                  <h3 className="text-4xl lg:text-5xl font-bold text-white mb-3 font-['Sora']">{stat.value}</h3>
                  <p className="text-base text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <section id="features" className="py-24 max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-20 max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold font-['Sora'] mb-6">Powerful Multi-Agent Capabilities</h2>
            <p className="text-slate-400 text-xl font-light leading-relaxed">Unlock the full potential of your business with specialized AI agents working in harmony to deliver actionable insights.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText />} color="blue" title="Business Plan Generator" delay={0.1}
              desc="Generate complete, professional business plans in minutes, tailored to your specific industry and goals."
            />
            <FeatureCard 
              icon={<Target />} color="purple" title="Market Research AI Agent" delay={0.2}
              desc="Deep market analysis, emerging trends, and competitor insights delivered instantly by intelligent agents."
            />
            <FeatureCard 
              icon={<LineChart />} color="cyan" title="Financial Analysis" delay={0.3}
              desc="Detailed financial projections, P&L statements, cash flow analysis, and break-even calculations."
            />
            <FeatureCard 
              icon={<BrainCircuit />} color="blue" title="Marketing Strategy" delay={0.4}
              desc="AI-powered marketing strategies, campaign ideas, and positioning tailored to your target audience."
            />
            <FeatureCard 
              icon={<FileOutput />} color="purple" title="PDF Report Generator" delay={0.5}
              desc="Export your complete business plan and analyses as professional, boardroom-ready PDF reports."
            />
          </div>
        </section>
        
        {/* How it works */}
        <section id="how-it-works" className="py-24 max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#2563EB]/5 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-bold font-['Sora'] mb-6">How It Works</h2>
            <p className="text-slate-400 text-xl font-light">From idea to comprehensive strategy in 4 simple steps.</p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-between gap-12 relative max-w-7xl mx-auto">
            <div className="hidden md:block absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-[#06B6D4] via-[#2563EB] to-[#7C3AED] opacity-20 rounded-full"></div>
            
            {[
              { step: 1, title: 'Describe Your Idea', icon: <FileText />, desc: 'Tell us your business idea in simple words.', color: 'text-[#06B6D4]', shadow: 'shadow-[#06B6D4]' },
              { step: 2, title: 'AI Agents Work', icon: <BrainCircuit />, desc: 'Our multi-agent system conducts deep research.', color: 'text-[#2563EB]', shadow: 'shadow-[#2563EB]' },
              { step: 3, title: 'Get Insights', icon: <LineChart />, desc: 'Receive strategies and financial models.', color: 'text-[#7C3AED]', shadow: 'shadow-[#7C3AED]' },
              { step: 4, title: 'Download Report', icon: <FileOutput />, desc: 'Export your beautifully formatted plan.', color: 'text-slate-300', shadow: 'shadow-white' }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, type: "spring" }}
                className="flex flex-col items-center text-center relative z-10 flex-1 group"
              >
                <div className={`w-32 h-32 rounded-3xl glass border-white/10 flex items-center justify-center mb-8 bg-[#0F172A] relative transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] group-hover:${s.shadow}`}>
                  <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-sm font-bold border border-white/10 bg-[#0F172A] shadow-lg`}>{s.step}</div>
                  <div className={`w-14 h-14 ${s.color} transition-transform duration-500 group-hover:scale-125`}>{s.icon}</div>
                </div>
                <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
                <p className="text-slate-400 text-base max-w-[220px] font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="glass p-16 md:p-24 rounded-[3rem] text-center border-white/10 relative overflow-hidden shadow-2xl"
          >
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[50%] -left-[20%] w-full h-[200%] bg-gradient-to-br from-[#2563EB]/10 to-transparent z-0 origin-center pointer-events-none"
            ></motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#7C3AED]/10 to-[#06B6D4]/10 z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold font-['Sora'] mb-8">Ready to Build Your Business the Smart Way?</h2>
              <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light">Join thousands of entrepreneurs who trust BizMind AI to turn their vision into reality.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-5 rounded-2xl font-semibold transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-2 text-xl w-full sm:w-auto">
                  Get Started Free
                </Link>
                <button className="bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white px-10 py-5 rounded-2xl font-semibold transition-all text-xl w-full sm:w-auto hover:-translate-y-2">
                  See Pricing
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0F172A] pt-20 pb-10 text-base text-slate-400">
        <div className="max-w-[98%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <span className="text-2xl font-bold font-['Sora'] text-white">BizMind AI</span>
              </div>
              <p className="mb-8 max-w-sm text-lg font-light leading-relaxed">All intelligence for Smarter Business Decisions.</p>
              <div className="flex flex-wrap gap-4">
                <a href="https://linkedin.com/in/youssef-louhichi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2563EB] hover:text-white hover:-translate-y-1 transition-all">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="https://github.com/Louhichi-Youssef" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black hover:-translate-y-1 transition-all">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="mailto:yousseflouhichi762@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#06B6D4] hover:text-white hover:-translate-y-1 transition-all">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="tel:+21651231141" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#7C3AED] hover:text-white hover:-translate-y-1 transition-all">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors text-[#06B6D4]">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p>&copy; 2026 BizMind AI. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, desc, delay }) => {
  const colorMap = {
    blue: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20',
    purple: 'text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/20',
    cyan: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay, type: "spring" }}
      className="glass p-10 rounded-3xl border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${colorMap[color]} group-hover:scale-110 transition-transform duration-500`}>
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <h3 className="text-2xl font-bold mb-4 font-['Sora']">{title}</h3>
      <p className="text-slate-400 text-base leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
};

export default LandingPage;
