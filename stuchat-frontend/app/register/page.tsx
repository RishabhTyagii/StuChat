"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowRight, Sparkles, Shield, Calendar, BookOpen, Globe, Award, BadgeCheck, Fingerprint, GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    course: "",
    year: "",
    interests: [] as string[],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const courses = [
    "Computer Science", "Electrical Engineering", "Mechanical Engineering", 
    "Civil Engineering", "Business Administration", "Medicine", "Law", 
    "Arts & Humanities", "Science", "Commerce"
  ];

  const interestsList = [
    "Programming", "Design", "Music", "Sports", "Gaming", "Reading", 
    "Photography", "Travel", "Cooking", "Dance", "Debate", "Robotics",
    "AI/ML", "Web Development", "Mobile Apps", "Data Science"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Post Graduate"];

  // Check password strength
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    };
    calculateStrength();
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (currentStep === 2 && !formData.fullName) {
      setError("Please enter your full name");
      return false;
    }
    return true;
  };

  // Handle next step
  const nextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
      setError("");
    }
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(1);
    setError("");
  };

  // Handle interest selection
  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 5) // Limit to 5
    }));
  };

  async function handleRegister() {
    if (!validateForm()) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          ...(formData.fullName && { full_name: formData.fullName }),
          ...(formData.course && { course: formData.course }),
          ...(formData.year && { year: formData.year }),
          ...(formData.interests.length > 0 && { interests: formData.interests }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Success
      setSuccess("Account created successfully! Redirecting to verification...");
      
      // Show success animation
      if (formRef.current) {
        formRef.current.style.transform = "scale(0.95)";
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      } else {
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 1000);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

   

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <Sparkles size={16} className="text-green-400" />
              <span className="text-sm font-medium">Join 10,000+ Students</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Start Your{' '}
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Campus Journey
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Create your account and unlock exclusive features to connect, learn, and grow with your campus community.
            </p>

            {/* Features List */}
            <div className="space-y-6 mb-8">
              {[
                { icon: <Globe size={20} />, text: "Connect with campus mates worldwide" },
                { icon: <BookOpen size={20} />, text: "Join study groups & share resources" },
                { icon: <Shield size={20} />, text: "Secure & private campus network" },
                { icon: <Award size={20} />, text: "Earn badges for participation" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className="text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">100%</div>
                <div className="text-sm text-gray-400">Verified Students</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div 
            ref={formRef}
            className="bg-gray-900/40 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-2xl relative transition-transform duration-300"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-green-500 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 rounded-full"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 mb-4">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {currentStep === 1 ? "Create Account" : "Complete Your Profile"}
              </h2>
              <p className="text-gray-400">
                {currentStep === 1 
                  ? "Step 1: Basic information" 
                  : "Step 2: Tell us about yourself"}
              </p>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        placeholder="student@campus.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full text-black pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full pl-12 pr-4 text-black py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full text-black pl-12 pr-12 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Password strength:</span>
                        <span className={passwordStrength >= 75 ? "text-green-400" : passwordStrength >= 50 ? "text-yellow-400" : "text-red-400"}>
                          {passwordStrength >= 75 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-300`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full text-black pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-300">Password must contain:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { check: formData.password.length >= 8, text: "At least 8 characters" },
                      { check: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
                      { check: /[0-9]/.test(formData.password), text: "One number" },
                      { check: /[^A-Za-z0-9]/.test(formData.password), text: "One special character" },
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.check ? 
                          <CheckCircle size={14} className="text-green-400" /> : 
                          <XCircle size={14} className="text-gray-500" />
                        }
                        <span className={req.check ? "text-green-400" : "text-gray-500"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full text-black pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course/Department
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                        className="w-full text-black pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 appearance-none"
                      >
                        <option value="">Select your course</option>
                        {courses.map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year of Study
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full text-black pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 appearance-none"
                      >
                        <option value="" className="text-black">Select year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select your interests (max 5)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                          formData.interests.includes(interest)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {formData.interests.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Selected interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className="ml-1 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-1">Your privacy matters</h4>
                      <p className="text-xs text-gray-400">
                        We verify all students to ensure a safe campus community. Your information is encrypted and never shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error & Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <XCircle size={20} className="text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-300">{success}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700/50">
              {currentStep === 2 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl font-medium transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl font-medium transition-colors"
                >
                  Already have an account?
                </button>
              )}

              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.email || !formData.username || !formData.password || !formData.confirmPassword}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <BadgeCheck size={20} />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Terms */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                By registering, you agree to our{' '}
                <button className="text-blue-400 hover:text-blue-300">Terms of Service</button>{' '}
                and{' '}
                <button className="text-blue-400 hover:text-blue-300">Privacy Policy</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Badge */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full">
          <Fingerprint size={14} className="text-green-400" />
          <span className="text-sm text-gray-400">All accounts require campus verification</span>
        </div>
      </div>
    </div>
  );
}