import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BrainCircuit, LayoutDashboard, FileText, Target, 
  LineChart, Settings, LogOut, BookOpen, User, Mail 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0F172A]/50 glass flex-col hidden md:flex h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold font-['Sora']">BizMind</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 mt-2">
        <NavItem 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          active={currentPath === '/dashboard'} 
          onClick={() => navigate('/dashboard')}
        />
        <NavItem 
          icon={<BookOpen />} 
          label="Knowledge Base" 
          active={currentPath === '/dashboard/knowledge-base'} 
          onClick={() => navigate('/dashboard/knowledge-base')}
        />
        <NavItem 
          icon={<FileText />} 
          label="Business Plans" 
          active={currentPath === '/dashboard/generate' || currentPath.startsWith('/dashboard/plans')}
          onClick={() => navigate('/dashboard')} 
        />
        <NavItem 
          icon={<Mail />} 
          label="Contact Support" 
          active={currentPath === '/contact'}
          onClick={() => navigate('/contact')} 
        />
        <NavItem icon={<Target />} label="Market Research" disabled />
        <NavItem icon={<LineChart />} label="Financials" disabled />
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto space-y-1">
        <NavItem 
          icon={<User />} 
          label="My Profile" 
          active={currentPath === '/dashboard/profile'} 
          onClick={() => navigate('/dashboard/profile')} 
        />
        <NavItem 
          icon={<Settings />} 
          label="Settings" 
          active={currentPath === '/dashboard/settings'} 
          onClick={() => navigate('/dashboard/settings')} 
        />
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick, disabled }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); if (!disabled && onClick) onClick(); }}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-[#2563EB]/10 text-[#2563EB]'
        : disabled
        ? 'text-slate-600 cursor-not-allowed'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-4 h-4' })}
    <span className="flex-1">{label}</span>
    {disabled && <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-600">Soon</span>}
  </a>
);

export default Sidebar;
