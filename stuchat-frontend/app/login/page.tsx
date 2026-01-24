"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus, Shield, AlertCircle, Sparkles, GraduationCap, Users } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      router.push("/search");
    }
  }, [router]);

  // Add floating animation
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      form.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("access", data.access);
      
      // Save refresh token if available
      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }

      // Save remember me
      if (rememberMe) {
        localStorage.setItem("remember", "true");
      }

      // Success animation
      const form = formRef.current;
      if (form) {
        form.style.transform = "perspective(1000px) rotateY(0) rotateX(0) scale(0.95)";
        form.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        setTimeout(() => {
          form.style.transform = "perspective(1000px) rotateY(0) rotateX(0) scale(1)";
          router.push("/search");
        }, 300);
      } else {
        router.push("/search");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-10 animate-float">
        <GraduationCap className="text-blue-400/20" size={40} />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delayed">
        <Users className="text-purple-400/20" size={40} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Campus Connect</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                StuChat
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Connect with your campus community. Chat with classmates, join study groups, and never miss an update.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">1.1K+</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">166+</div>
                <div className="text-sm text-gray-400">Study Groups</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="font-bold">S</span>
                </div>
                <div>
                  <div className="font-semibold">Rishabh Tyagi</div>
                  <div className="text-sm text-gray-400">CTO & Founder </div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "StuChat Is the Most Secure chatting App Ever builded, it had End to End Encryption and 2FA which makes it more reliable and trustworthy."
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div 
            ref={formRef}
            className="transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-gray-900/40 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-2xl relative">
              {/* Decorative Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                  <Shield size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-400">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400" size={20} />
                    <input
                      type="email"
                      placeholder="student@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 text-black py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300"
                      onClick={() => router.push("/forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-black pl-12 pr-12 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Demo */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 text-black h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>
                  
             
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle size={20} className="text-red-400" />
                    <span className="text-red-300">{error}</span>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Sign In to StuChat
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900/40 text-gray-400">or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-gray-700/50">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push("/register")}
                      className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                    >
                      <UserPlus size={16} />
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Security Badge */} 
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <Shield size={14} className="text-green-400" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 <br /><br />
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          © 2024 StuChat. Connecting campuses worldwide.
        </p>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
}