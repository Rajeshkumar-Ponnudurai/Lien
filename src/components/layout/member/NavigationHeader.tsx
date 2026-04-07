import { useCallback, useState, useEffect, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Plus,LogOut,FileTypeCorner,UserRound,CheckCircle2,ChevronDown,FileText,Menu,Save} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../features/auth/authSlice';
import { setView } from '../../../store/slices/viewSlice';
import { handleAddProject, handleViewTasks } from '../../../utils/navigation';
import { menuSections } from '../../../utils/menu';

interface NavigationHeaderProps {
  readonly showLogo?: boolean;
  readonly saveAndExit?: () => void;
  readonly wizardMode?: boolean;
  readonly saveAndExitDisabled?: boolean;
}

export default function NavigationHeader({
  showLogo = false,
  saveAndExit,
  wizardMode = false,
  saveAndExitDisabled = false,
}: NavigationHeaderProps) {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  const currentPath = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(setView(null));
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const navItems = [
    { icon: Plus, label: "New Project", action: () => handleAddProject(navigate), path: "/project" },
    { icon: UserRound, label: "Contacts", action: () => navigate("/customer-contacts"), path: "/customer-contacts" },
    { icon: FileTypeCorner, label: "Documents", action: () => navigate("/documents"), path: "/documents" },
    { icon: CheckCircle2, label: "Tasks", action: () => handleViewTasks(navigate), path: "/tasks" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    // MENU dropdown
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }

    // PROFILE dropdown
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="sticky top-0 z-[40] isolation-isolate backdrop-blur-xl bg-gradient-to-r from-[#0075be]/95 to-[#00aeea]/95 border-b border-white/20 shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MENU BUTTON */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <Menu className="w-5 h-5 text-white" />
              <ChevronDown className={`w-4 h-4 text-white transition ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN */}
            <div
            className={`absolute left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 space-y-2 
            transition-all duration-300
           ${menuOpen 
             ? 'opacity-100 scale-100 visible z-[999] pointer-events-auto' : 'opacity-0 scale-95 invisible z-[-1] pointer-events-none'
              }`}
>
              {menuSections.map((section, si) => (
                <div key={si}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-[#0075be] to-[#00aeea] text-white shadow'
                            : 'hover:bg-slate-100 text-slate-700'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>

          {/* LOGO */}
          {showLogo && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-white font-bold text-base md:text-lg tracking-wide">
                Optrixx
              </span>
            </div>
          )}
        </div>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-2 bg-white/10 px-2 py-1 rounded-2xl backdrop-blur-lg border border-white/20">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={item.action}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 whitespace-nowrap
                  ${isActive
                    ? 'bg-white text-[#0075be] shadow-md'
                    : 'text-white hover:bg-white/20'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#0075be] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SAVE & EXIT */}
          {wizardMode && saveAndExit && (
            <button
              onClick={saveAndExit}
              disabled={saveAndExitDisabled}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm
                         bg-white text-[#0075be] rounded-xl font-semibold shadow-md
                         hover:scale-105 hover:shadow-lg transition-all duration-300
                         disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save & Exit</span>
            </button>
          )}

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#0075be] flex items-center justify-center font-bold shadow-md">
                {auth?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </button>

            {/* PROFILE DROPDOWN */}
            <div
              className={`absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100
              transition-all duration-300 origin-top-right
              ${profileOpen
              ? 'opacity-100 scale-100 visible z-[999] pointer-events-auto'
              : 'opacity-0 scale-95 invisible z-[-1] pointer-events-none'
                }`}>

  {/* USER INFO */}
  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0075be] to-[#00aeea] text-white flex items-center justify-center font-bold shadow">
      {auth?.user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-800">
        {auth?.user?.name || "User"}
      </span>
      <span className="text-xs text-gray-500 truncate">
        {auth?.user?.email || "user@email.com"}
      </span>
    </div>
  </div>

  {/* MENU ITEMS */}
  <div className="py-2">

    <button
      onClick={() => {
        navigate("/profile");
        setProfileOpen(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      <UserRound className="w-4 h-4 text-gray-500" />
      My Profile
    </button>

    <div className="my-2 border-t border-gray-100"></div>

    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
              </div>
           </div>
          </div>

        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden grid grid-cols-4 gap-2 px-2 pb-3 pt-1 bg-white/10 backdrop-blur-lg">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={item.action}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all duration-300
                ${isActive
                  ? 'bg-white text-[#0075be] shadow'
                  : 'text-white/90 hover:bg-white/20'
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

      </div>
    </div>
  );
}