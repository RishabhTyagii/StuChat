"use client";

import { Github, Linkedin, Mail, Code, Cpu, Database, Cloud, Globe, Shield, Zap, Sparkles, Rocket, Star, Trophy, Award } from "lucide-react";
import Navbar from "../components/Navbar";
export default function AboutPage() {
  const techStack = [
    { name: "Next.js 14", icon: <Cpu size={20} />, color: "text-gray-100" },
    { name: "TypeScript", icon: <Code size={20} />, color: "text-blue-400" },
    { name: "Tailwind CSS", icon: <Sparkles size={20} />, color: "text-cyan-400" },
    { name: "Django", icon: <Database size={20} />, color: "text-green-400" },
    { name: "Django Channels", icon: <Zap size={20} />, color: "text-yellow-400" },
    { name: "PostgreSQL", icon: <Database size={20} />, color: "text-purple-400" },
    { name: "WebSocket", icon: <Globe size={20} />, color: "text-orange-400" },
    { name: "JWT Auth", icon: <Shield size={20} />, color: "text-red-400" },
    { name: "C# .NET ASP.NET", icon: <Cpu size={20} />, color: "text-green-400" },
        { name: "AWS", icon: <Globe size={20} />, color: "text-blue-400" },


  ];

  const features = [
    "Real-time messaging with WebSocket",
    "Typing indicators & online status",
    "Read receipts & message history",
    "Secure JWT authentication",
    "File & image sharing",
    "Campus verification system",
    "Group chat capabilities",
    "End-to-end encryption",
  ];

  const projects = [
    {
      name: "YourBazar",
      description: "Full-stack e-commerce platform with real-time notifications",
      tech: "C# Python Gunicorn Nginx CI/CD CloudFront RDsAroura CMS + Socket.io Redis Next.JS Chart.js Three.js Pillow Fast API , Paymentgatway, DTDC/Curior API (Kotlin for andriod app) ",
      status: "Live",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Studesk",
      description: "Student productivity suite with task management",
      tech: "Next.js + PostgreSQL +Java",
      status: "Active Development",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "StuChat",
      description: "Real-time campus communication platform",
      tech: "Next.js + Django + WebSocket+WebRTC",
      status: "Live",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative" 
    style={{paddingBottom:"30px"}} >
      {/* Animated Background */}
      <Navbar />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full">
            <Rocket size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Built with Passion</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Architect
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Crafting digital experiences that blend innovation with impeccable design
          </p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-transparent group-hover:border-blue-500/50 transition-all duration-300">
                    <img 
                      src="https://yourbaazar.s3.ap-south-1.amazonaws.com/Screenshot+2026-01-25+124740.png" 
                      alt="Rishabh Tyagi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-gray-900">
                    <Sparkles size={20} />
                  </div>
                </div>

                {/* About Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-3xl font-bold">Rishabh Tyagi</h2>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Available
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl text-blue-400 font-semibold mb-3">
                    Full-Stack Developer & Digital Craftsman
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Passionate developer who transforms complex problems into elegant digital solutions. 
                    With expertise spanning from backend architectures to pixel-perfect frontends, 
                    I build applications that don't just work—they delight.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">3+</div>
                      <div className="text-sm text-gray-400">Years Experience</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">50+</div>
                      <div className="text-sm text-gray-400">Projects Built</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">24/7</div>
                      <div className="text-sm text-gray-400">Code Machine</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://github.com/RishabhTyagii" 
                      target="_blank"
                      className="p-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Github size={20} />
                    </a>
                    <a 
                      href="https://github.com/RishabhTyagii" 
                      target="_blank"
                      className="p-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a 
                      href="mailto:rishabhtyagi@yourbaazar.com" 
                      className="p-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-8">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Code size={24} className="text-blue-400" />
                Tech Arsenal
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {techStack.map((tech, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-500/30 transition-colors"
                  >
                    <div className={tech.color}>{tech.icon}</div>
                    <span className="text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy size={24} className="text-yellow-400" />
                Development Philosophy
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Clean, maintainable code</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>User-first design approach</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Performance optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Security by design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects Showcase */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Signature Projects</h2>
            <p className="text-gray-400">From e-commerce platforms to productivity suites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {idx === 0 ? <Database size={24} /> : idx === 1 ? <Code size={24} /> : <Globe size={24} />}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm">
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{project.tech}</span>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About StuChat */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">About StuChat</h2>
              <p className="text-gray-400">The campus communication revolution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                StuChat is more than just a messaging app—it's a complete campus ecosystem built from scratch. 
                What started as a learning project evolved into a full-featured platform supporting thousands of 
                concurrent users with real-time communication.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-400" />
                  Why It Stands Out
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400">⚡</span>
                    </div>
                    <div>
                      <p className="font-semibold">Real-time Performance</p>
                      <p className="text-sm text-gray-400">WebSocket-based architecture ensures instant messaging</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400">🔒</span>
                    </div>
                    <div>
                      <p className="font-semibold">Enterprise Security</p>
                      <p className="text-sm text-gray-400">JWT tokens, encrypted messages, and campus verification</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400">🎨</span>
                    </div>
                    <div>
                      <p className="font-semibold">Impeccable Design</p>
                      <p className="text-sm text-gray-400">Glassmorphism UI with smooth animations and transitions</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl mb-8">
            <div className="px-8 py-4 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-2">Let's Build Something Amazing</h3>
              <p className="text-gray-400 mb-4">Got a project idea? Let's turn it into reality</p>
              <a 
                href="mailto:sun@example.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Mail size={18} />
                Start a Conversation
              </a>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Made with ❤️ by Rishabh Tyagi • Building the future, End-to-End Encryption (E2EE)

          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-10 h-10 rounded-full bg-blue-500/10"></div>
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delayed">
        <div className="w-12 h-12 rounded-full bg-purple-500/10"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
}