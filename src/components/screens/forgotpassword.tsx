import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';

export default function ForgotPasswordScreen() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // 🎨 OPTRIXX THEME CONSTANTS
    const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
    const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            // API CALL (Simulated)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess("Reset password link sent to your email");

            // Auto redirect after 2.5 sec
            setTimeout(() => {
                navigate('/login');
            }, 2500);

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">
            
            {/* Left Section: Branding & Info */}
            <div 
                style={{ background: primaryGradient }}
                className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        {/* Logo Box with Secondary Gradient */}
                        <div 
                            style={{ background: secondaryGradient }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
                        >
                            <KeyRound className="w-6 h-6 text-white" />
                        </div>
                        <span 
                            className="text-2xl font-bold tracking-tight"
                            style={{ 
                                backgroundImage: secondaryGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'inline-block' 
                            }}
                        >
                            Optrixx
                        </span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-extrabold mb-6 leading-tight text-white drop-shadow-sm">
                            Secure access to your workspace.
                        </h2>
                        <p className="text-blue-50/90 text-lg font-medium leading-relaxed">
                            Don't worry, it happens to the best of us. Enter your registered email and we'll help you get back on track.
                        </p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex gap-6 text-sm text-blue-100/70 font-medium">
                    <span>© {new Date().getFullYear()} Optrixx Inc.</span>
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/30">
                <div className="w-full max-w-[400px]">
                    
                    {/* Header */}
                    <div className="mb-10 text-left">
                        <button 
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-[#0075be] text-sm font-bold mb-6 hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </button>
                        <h1 
                            className="text-3xl font-extrabold tracking-tight"
                            style={{ 
                                backgroundImage: secondaryGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'inline-block' 
                            }}
                        >
                            Forgot Password
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Enter your email to receive a reset link</p>
                    </div>

                    {/* Feedback Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium leading-relaxed">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                className="text-sm font-bold ml-1"
                                style={{ 
                                    backgroundImage: secondaryGradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    display: 'inline-block' 
                                }}
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    required
                                    disabled={loading || !!success}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading || !!success}
                                style={{ background: !(loading || success) ? primaryGradient : '#cbd5e1' }}
                                className="w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-blue-500/30"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full py-3.5 text-slate-600 font-bold hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {/* Support Link */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Having trouble?{' '}
                            <Link 
                                to="/support" 
                                style={{ color: '#0075be' }}
                                className="font-extrabold hover:underline underline-offset-4 decoration-2"
                            >
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}