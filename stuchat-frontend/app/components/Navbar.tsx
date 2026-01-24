"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Set active tab based on current route
    const path = window.location.pathname;
    if (path.includes("/search")) setActiveTab("search");
    else if (path.includes("/pending")) setActiveTab("inbox");
    else if (path.includes("/about")) setActiveTab("about");
    else if (path.includes("/account")) setActiveTab("account");

    // Check for mobile
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function logout() {
    localStorage.removeItem("access");
    router.push("/login");
  }

  /* ================= MOBILE BOTTOM NAV ================= */
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-[70px] bg-black border-t border-gray-800">
        {/* GLASS EFFECT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-black to-black" />
        
        <div className="relative flex items-center justify-around h-full px-4" style={{ paddingBottom:"10px"}}>
          {/* SEARCH */}
          <button
            onClick={() => {
              setActiveTab("search");
              router.push("/search");
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${activeTab === "search" ? "text-blue-400" : "text-gray-300"}`}
          >
            <div className={`p-2.5 rounded-full mb-1 ${activeTab === "search" ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30" : "hover:bg-gray-800"}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium"></span>
            {activeTab === "search" && (
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-1" />
            )}
          </button>

          {/* INBOX */}
          <button
            onClick={() => {
              setActiveTab("inbox");
              router.push("/pending");
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${activeTab === "inbox" ? "text-blue-400" : "text-gray-300"}`}
          >
            <div className="relative">
              <div className={`p-2.5 rounded-full mb-1 ${activeTab === "inbox" ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30" : "hover:bg-gray-800"}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
              </div>
            </div>
            <span className="text-xs font-medium"></span>
            {activeTab === "inbox" && (
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-1" />
            )}
          </button>

          {/* ABOUT */}
          <button
            onClick={() => {
              setActiveTab("about");
              router.push("/about");
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${activeTab === "about" ? "text-blue-400" : "text-gray-300"}`}
          >
            <div className={`p-2.5 rounded-full mb-1 ${activeTab === "about" ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30" : "hover:bg-gray-800"}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium"></span>
            {activeTab === "about" && (
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-1" />
            )}
          </button>

          {/* ACCOUNT */}
          <button
            onClick={() => {
              setActiveTab("account");
              router.push("/account");
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${activeTab === "account" ? "text-blue-400" : "text-gray-300"}`}
          >
            <div className={`p-2.5 rounded-full mb-1 ${activeTab === "account" ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30" : "hover:bg-gray-800"}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium"></span>
            {activeTab === "account" && (
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-1" />
            )}
          </button>
        </div>
      </nav>
    );
  }

  /* ================= DESKTOP TOP NAV ================= */
  return (
    <nav className="sticky top-0 z-50 h-16 bg-black border-b border-gray-800 px-6">
      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-black to-purple-900/10" />
      
      <div className="relative flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* LOGO */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            StuChat
          </span>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="flex items-center gap-1 bg-gray-900/80 rounded-full p-1 backdrop-blur-sm border border-gray-800">
          <button
            onClick={() => {
              setActiveTab("search");
              router.push("/search");
            }}
            className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === "search" 
              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-400 shadow-lg" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium">Search</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("inbox");
              router.push("/pending");
            }}
            className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === "inbox" 
              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-400 shadow-lg" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="relative mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
            </div>
            <span className="font-medium">Inbox</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("about");
              router.push("/about");
            }}
            className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === "about" 
              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-400 shadow-lg" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">About</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("account");
              router.push("/account");
            }}
            className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === "account" 
              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-400 shadow-lg" 
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Account</span>
          </button>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 hover:text-red-300 hover:bg-red-700/30 border border-red-600/30 hover:border-red-500/40 transition-all duration-300 flex items-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}