import { useState } from 'react';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  EyeOff,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { validateEmail, validatePassword } from '../../utils/validation';

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const validationErrors: LoginErrors = {
      email: validateEmail(email) || undefined,
      password: validatePassword(password) || undefined,
    };

    Object.keys(validationErrors).forEach(
      (key) =>
        validationErrors[key as keyof LoginErrors] === undefined &&
        delete validationErrors[key as keyof LoginErrors]
    );

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const extractErrorMessage = (err: any): string => {
    if (err?.data?.errors) {
      const firstKey = Object.keys(err.data.errors)[0];
      return err.data.errors[firstKey][0];
    }
    if (err?.data?.message) return err.data.message;
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      if (!res?.active_projects?.length) {
        navigate('/tour');
      }
    } catch (err: any) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">
      
      {/* Left Section*/}
      <div 
        style={{ background: primaryGradient }}
        className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            {/* Logo Box with Gradient */}
            <div 
              style={{ background: secondaryGradient }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
            >
              <LogIn className="w-6 h-6 text-white" />
            </div>
           <span className="text-2xl font-bold tracking-tight" style={{ backgroundImage: secondaryGradient,
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
              Optimize your workflow with precision.
            </h2>
            <p className="text-blue-50/90 text-lg font-medium">
              Join thousands of teams managing their projects with our intuitive interface and powerful analytics.
            </p>
          </div>
        </div>

        {/* Decorative Blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex gap-6 text-sm text-blue-100/70 font-medium">
          <span>© {new Date().getFullYear()} Optrixx Inc.</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right Section: Form Content */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/30">
        <div className="w-full max-w-[400px]">

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight"
            style={{ backgroundImage: secondaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block' 
            }}>
              Welcome back
            </h1>
            <p className="mt-2 font-medium" 
            style={{ backgroundImage: secondaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block' 
            }}>
              Login to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {(errorMessage || Object.keys(errors).length > 0) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                {errorMessage || Object.values(errors)[0]}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1"
              style={{ backgroundImage: secondaryGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block' 
            }}>Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold" 
                style={{ backgroundImage: secondaryGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block' 
                }}>Password</label>
                <Link to="/forgot-password" style={{ color: '#0075be' }} className="text-xs font-extrabold hover:text-[#00aeea]">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0075be] transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:border-[#00aeea] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button with Requested Gradient */}
            <button
              type="submit"
              disabled={loading}
              style={{ background: !loading ? primaryGradient : '#cbd5e1' }}
              className="w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                style={{ color: '#0075be' }} 
                className="font-extrabold hover:underline underline-offset-4 decoration-2"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}