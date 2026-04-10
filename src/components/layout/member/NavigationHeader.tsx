﻿import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, Menu, UserRound, Home, FolderKanban, 
  Clock, CheckCircle2, Calculator, BrainCircuit, 
  Compass, LogOut, ChevronUp, ChevronDown, FileText,
  Contact2, Files, History
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import { handleAddProject } from '../../../utils/navigation';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';

interface NavigationHeaderProps {
  readonly showLogo?: boolean;
  readonly onMenuClick: () => void;
}

export default function NavigationHeader({
  showLogo = false,
  onMenuClick,
}: NavigationHeaderProps) {
  const navigate = useNavigate();
  const { data: profileData } = useGetProfileQuery();
  const profile = profileData?.data || null;

  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleAddProjectClick = useCallback(() => {
    handleAddProject(navigate);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleProfileClick = useCallback(() => {
    setProfileOpen(!profileOpen);
  }, [profileOpen]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <div className="sticky top-0 z-[40] isolation-isolate backdrop-blur-xl bg-gradient-to-r from-[#0075be]/95 to-[#00aeea]/95 border-b border-white/20 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* LOGO */}
          {showLogo && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-white font-bold text-base md:text-lg tracking-wide">
                Optrixx
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* ADD PROJECT BUTTON */}
          <button
            onClick={handleAddProjectClick}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0075be] rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Project</span>
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 overflow-hidden"
              title="Profile"
            >
              {profile?.user_details?.image ? (
                <img
                  src={profile.user_details.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="w-5 h-5 text-white" />
              )}
            </button>

            {/* PROFILE DROPDOWN MENU */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleNav('/profile')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <UserRound className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* NAVIGATION DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <Menu className="w-5 h-5 text-white" />
              {menuOpen ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
            </button>

            {/* NAVIGATION DROPDOWN MENU */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('/projects')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </button>
                <button
                  onClick={() => handleNav('/deadlines')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/deadlines' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Clock className="w-4 h-4" />
                  Deadlines
                </button>
                <button
                  onClick={() => handleNav('/tasks')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tasks
                </button>
                <button
                  onClick={() => handleNav('/documents')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/documents' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <FileText className="w-4 h-4" />
                  Documents
                </button>
                <button
                  onClick={() => handleNav('/contacts')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/contacts' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Contact2 className="w-4 h-4" />
                  Contacts
                </button>
                <button
                  onClick={() => handleNav('/recent')}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${location.pathname === '/recent' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <History className="w-4 h-4" />
                  Recent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}