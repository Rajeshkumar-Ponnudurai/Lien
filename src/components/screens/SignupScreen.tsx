import { useState } from 'react';
import {
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  EyeOff,
  Eye,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAppDispatch } from '../../store/hooks';
import { useSignupMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const [signup] = useSignupMutation();
  const navigate = useNavigate();

  // ✅ State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🎨 OPTRIXX THEME CONSTANTS
  const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
  const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

  // ✅ Validation Logic (Preserved)
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    return true;
  };

  // ✅ Submit Handler (Preserved Logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        email,
        password,
        password_confirmation: confirmPassword,
      }).unwrap();

      dispatch(setCredentials(res));
      navigate('attorney/dashboard');
    } catch (err: any) {
      if (err?.data?.errors) {
        const firstKey = Object.keys(err.data.errors)[0];
        setError(err.data.errors[firstKey][0]);
      } else if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">
      
      {/* Left Section: Branding & Social Proof */}
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
              <UserPlus className="w-6 h-6 text-white" />
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
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Start managing your projects with precision.
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-100 shrink-0" />
                <p className="text-blue-50/90 text-lg font-medium leading-relaxed">
                  Enterprise-grade security for your data.
                </p>
              </div>
              <p className="text-blue-50/90 text-lg font-medium leading-relaxed">
                Join a community of professionals who value efficiency and clean design.
              </p>
            </div>
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
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/30">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-8 text-left">
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
              Create Account
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Get started with your free trial.</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
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
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ background: !loading ? primaryGradient : '#cbd5e1' }}
              className="w-full mt-2 py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-blue-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#0075be' }}
                className="font-extrabold hover:underline underline-offset-4 decoration-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}