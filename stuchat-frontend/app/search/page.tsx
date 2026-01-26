"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User, MessageCircle, Loader2, Filter, X, Shield, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: "students", label: "Students", icon: "👨‍🎓" },
    { id: "teachers", label: "Teachers", icon: "👨‍🏫" },
    { id: "online", label: "Online Now", icon: "🟢" },
    { id: "verified", label: "Verified", icon: "✅" },
    { id: "same_course", label: "Same Course", icon: "📚" },
  ];

  // 🔐 auth guard
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
    }
    // Load search history from localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, [router]);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  async function searchUsers() {
    console.log("Hitting URL:", `https://studeskpro.site/api/search/?q=${q}`);
    console.log("Token:", localStorage.getItem("access"));

    if (!q.trim()) {
      setUsers([]);
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Save to search history
      const updatedHistory = [q, ...searchHistory.filter(h => h !== q)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      const res = await fetch(
        `https://studeskpro.site/api/search/?q=${q}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // ✅ SAFE CHECK
      if (Array.isArray(data)) {
        setUsers(data);
        // Simulate recent searches (in real app, this would be from API)
        if (data.length > 0) {
          setRecentSearches(data.slice(0, 3));
        }
      } else {
        console.error("Search error:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Network error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  // Clear search
  const clearSearch = () => {
    setQ("");
    setUsers([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      {/* Hero Section */}
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Find Your Campus Buddies
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with students, teachers, and clubs in your campus network
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              <input
                ref={searchInputRef}
                placeholder="Search by name, email, "
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-xl border-2 border-gray-700 rounded-2xl text-lg focus:outline-none focus:border-blue-500 transition-all duration-300 text-black"
              />
              {q && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              <button
                onClick={searchUsers}
                disabled={loading || !q.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search Users
                  </>
                )}
              </button>
              
        
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Quick Filters</h3>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !loading && users.length === 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQ(term);
                    setTimeout(() => searchUsers(), 100);
                  }}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Finding the perfect connections...</p>
            </div>
          ) : users.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Found <span className="text-blue-400">{users.length}</span> users
                </h2>
                <span className="text-gray-400 text-sm">
                  {users.length > 1 ? "Tap to start chatting" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="group bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    onClick={() => router.push(`/chat/${u.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            {u.profile_pic ? (
                              <img
                                src={`https://studeskpro.site${u.profile_pic}`}
                                alt={u.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={28} />
                            )}
                          </div>
                          {u.is_online && (
                            <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{u.username}</h3>
                            {u.is_verified && (
                              <Shield size={16} className="text-blue-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{u.email}</p>
                          {u.course && (
                            <span className="inline-block mt-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              {u.course}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                        <MessageCircle size={20} className="text-blue-400" />
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {u.interests?.slice(0, 3).map((interest: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          {u.mutual_friends > 0 ? `${u.mutual_friends} mutual friends` : "No mutual friends"}
                        </span>
                        <span className={`text-sm ${u.is_online ? 'text-green-400' : 'text-gray-500'}`}>
                          {u.is_online ? 'Online' : 'Last seen 2h ago'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : q.trim() && !loading ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Search size={40} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No users found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Try searching with a different name, email, or check your spelling.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 flex items-center justify-center">
                <Search size={48} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Start Searching</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Find classmates, teachers, or join study groups. Type a name, email,.
              </p>
              
              {/* Quick Search Suggestions */}
              <div className="max-w-xl mx-auto">
                <div className="flex flex-wrap gap-3 justify-center">
                  {['John', 'CS101', 'Math Club', 'Study Group', 'Python', 'Music'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQ(term);
                        setTimeout(() => searchUsers(), 100);
                      }}
                      className="px-5 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      {users.length > 0 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 transition-transform duration-300"
        >
          <Search size={24} />
        </button>
      )}
    </div>
  );
}