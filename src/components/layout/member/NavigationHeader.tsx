import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Home, ArrowLeft, LogOut, FileText, Users, CheckSquare, Save, Menu, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../features/auth/authSlice';
import { handleAddProject, handleViewTasks } from '../../../utils/navigation';
import { setView } from '../../../store/slices/viewSlice';

interface NavigationHeaderProps {
    readonly onBack?: () => void;
    readonly onHome?: () => void;
    readonly title?: string;
    readonly showBackButton?: boolean;
    readonly showHomeButton?: boolean;
    readonly showLogo?: boolean;
    readonly saveAndExit?: () => void;
    readonly wizardMode?: boolean;
    readonly saveAndExitDisabled?: boolean;
    readonly onMenuClick?: () => void;
}

export default function NavigationHeader({
    onBack,
    onHome,
    title,
    showBackButton = true,
    showHomeButton = false,
    showLogo = false,
    saveAndExit,
    wizardMode = false,
    saveAndExitDisabled = false,
    onMenuClick
}: NavigationHeaderProps) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAppSelector((state) => state.auth);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = useCallback(() => {
        dispatch(setView(null));
        dispatch(logout());
        navigate("/");
    }, []);

    const getButtonClasses = (path: string): string => {

        return location.pathname === path
            ? "flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm whitespace-nowrap"
            : "flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm";
    };

    return (
        <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">

                    {/* LEFT SECTION */}
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            <Menu className="w-6 h-6 text-slate-700" />
                        </button>
                        {/* Logo */}
                        {showLogo && (
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>

                                <span className="text-base sm:text-xl font-bold text-slate-900 whitespace-nowrap">
                                    Lien Manager
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">

                            {!wizardMode && showBackButton && onBack && (
                                <button
                                    onClick={onBack}
                                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Back</span>
                                </button>
                            )}

                            {!wizardMode && showHomeButton && onHome && (
                                <button
                                    onClick={onHome}
                                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                >
                                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </button>
                            )}

                            {!wizardMode && title && !showLogo && (
                                <h1 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
                                    {title}
                                </h1>
                            )}

                        </div>

                    </div>


                    {/* RIGHT SECTION */}
                    <div className="flex items-center justify-between gap-2  lg:flex-nowrap lg:justify-end">

                        {!wizardMode && (
                            <div className='flex items-center gap-2'>
                                {/* New Project */}
                                <button
                                    onClick={() => handleAddProject(navigate)}
                                    className={getButtonClasses("/project")}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">New Project</span>
                                </button>


                                {/* Contacts */}
                                <button
                                    onClick={() => navigate("/customer-contacts")}
                                    className={getButtonClasses("/customer-contacts")}
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden md:inline">Contacts</span>
                                </button>


                                {/* Documents */}
                                <button
                                    onClick={() => navigate("/documents")}
                                    className={getButtonClasses("/documents")}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="hidden md:inline">Documents</span>
                                </button>

                                {/* Tasks */}
                                <button
                                    onClick={() => handleViewTasks(navigate)}
                                    className={getButtonClasses("/tasks")}
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    <span className="hidden md:inline">Tasks</span>
                                </button>
                            </div>
                        )}


                        {/* Wizard Mode */}
                        {wizardMode && saveAndExit && (
                            <button
                                onClick={saveAndExit}
                                disabled={saveAndExitDisabled}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm text-sm"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">Save & Exit</span>
                            </button>
                        )}
                        <div className="" id="navbar-dropdown">
                            <ul className="flex flex-col font-medium relative">
                                <li>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        id="dropdownNvbarButton" data-dropdown-toggle="dropdownNavbar" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 transition">
                                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm text-white">
                                            <User className="w-5 h-5" />
                                        </div>
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 z-50 bg-white border rounded-lg shadow-lg w-44">
                                            <ul className="p-2 text-sm">
                                                <li>
                                                    <div className="px-4 py-3 border-b bg-slate-50">
                                                        {auth?.user?.name && (
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {auth?.user?.name}
                                                            </p>
                                                        )}
                                                        {auth?.user?.email && (

                                                            <p className="text-xs text-slate-500 truncate">
                                                                {auth?.user?.email}
                                                            </p>
                                                        )}
                                                    </div>

                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            navigate("/profile");
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </button>

                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
