"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Mail, Lock, CheckCircle, Clock, RefreshCw, Shield, Sparkles, ArrowLeft, Fingerprint, Key, AlertCircle, UserCheck } from "lucide-react";

export default function VerifyOTPContent() {
  const params = useSearchParams();
  const email = params.get("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();
  const otpRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  // Initialize OTP refs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-focus first input
  useEffect(() => {
    if (otpRefs.current[0]) {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto submit when last digit entered
    if (index === 5 && value) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        setTimeout(() => handleVerify(fullOtp), 300);
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus last input
      const lastIndex = Math.min(pastedData.length, 5);
      setTimeout(() => {
        otpRefs.current[lastIndex]?.focus();
      }, 10);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0 || !email) return;

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("https://studeskpro.site/api/register/resend-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setTimer(60);
        setSuccess("New OTP sent to your email!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to resend OTP. Try again.");
      }
    } catch (err) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerify = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join("");
    
    if (otpToVerify.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://studeskpro.site/api/register/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpToVerify }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Verification successful! Redirecting...");
        setAttempts(0);
        
        // Success animation
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        setError(data.detail || "Invalid OTP. Please try again.");
        
        // Clear OTP on too many attempts
        if (attempts >= 2) {
          setOtp(["", "", "", "", "", ""]);
          setTimeout(() => {
            if (otpRefs.current[0]) {
              otpRefs.current[0].focus();
            }
          }, 100);
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If email is not provided, show error
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
        <div className="bg-gray-900/40 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Email Not Found</h2>
          <p className="text-gray-300 mb-6">
            Please register first with your email address.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold transition-all duration-300"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/register")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl z-20 transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <Shield size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Secure Verification</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Verify Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Identity
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
              Enter the 6-digit code sent to your email to complete your registration.
            </p>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-2xl relative">
            {/* Decorative Elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full"></div>
            
            {/* Email Display */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl mb-6">
                <Mail className="text-blue-400" size={24} />
                <div className="text-left">
                  <p className="text-sm text-gray-400">Verification email sent to</p>
                  <p className="text-lg font-semibold break-all">{email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Clock size={16} />
                <span>Code expires in {formatTime(timer)}</span>
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              
              <div className="flex justify-center gap-3 md:gap-4 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-16 h-16 md:w-20 md:h-20 text-3xl font-bold text-center bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Virtual Keyboard Hint */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/30 rounded-lg">
                  <Key size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Tip: You can paste the code (Ctrl+V) or use number keys
                  </span>
                </div>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6 animate-in fade-in duration-300">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6 animate-in fade-in duration-300">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-300">{success}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some(d => !d)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <UserCheck size={20} />
                  Verify & Continue
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Didn't receive the code?{' '}
                {timer > 0 ? (
                  <span className="text-gray-500">
                    Resend in {formatTime(timer)}
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading || timer > 0}
                    className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Resend OTP
                  </button>
                )}
              </p>
              
              <button
                onClick={() => router.push(`/register?email=${encodeURIComponent(email)}`)}
                className="text-sm text-gray-400 hover:text-gray-300 inline-flex items-center gap-1 transition-colors"
              >
                <Mail size={14} />
                Wrong email? Go back and edit
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-2">
                <Shield size={20} className="text-blue-400" />
              </div>
              <h4 className="font-semibold mb-1">Secure</h4>
              <p className="text-xs text-gray-400">End-to-end encrypted</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-2">
                <Clock size={20} className="text-purple-400" />
              </div>
              <h4 className="font-semibold mb-1">Time-bound</h4>
              <p className="text-xs text-gray-400">Expires in 10 minutes</p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-2">
                <Fingerprint size={20} className="text-green-400" />
              </div>
              <h4 className="font-semibold mb-1">One-time Use</h4>
              <p className="text-xs text-gray-400">Single use code</p>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 text-center">
            <details className="inline-block text-left">
              <summary className="text-gray-400 hover:text-gray-300 cursor-pointer list-none transition-colors">
                Need help? Click here
              </summary>
              <div className="mt-3 p-4 bg-gray-800/30 border border-gray-700 rounded-xl text-sm text-gray-400 space-y-2">
                <p>• Check your spam or junk folder</p>
                <p>• Ensure you entered the correct email address</p>
                <p>• Wait 1-2 minutes for the email to arrive</p>
                <p>• Contact support if you still haven't received the code</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Floating Security Badge */}
      <div className="absolute bottom-8 right-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full">
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-sm text-gray-400">Campus Verified Only</span>
        </div>
      </div>
    </div>
  );
}