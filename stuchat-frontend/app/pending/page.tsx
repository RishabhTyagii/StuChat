"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type PendingChat = {
  user_id: number;
  username: string;
  profile_pic: string | null;
  last_message: string;
  last_time: string | null;
  unread_count: number;
};

export default function PendingPage() {
  const [chats, setChats] = useState<PendingChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    fetch("https://studeskpro.site/api/chat/pending/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChats(data);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function formatTime(ts: string | null) {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric"
    });
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* IMAGE MODAL */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={selectedImage}
              alt="Profile Preview"
              className="rounded-2xl shadow-2xl object-contain w-full h-full max-h-[80vh]"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-3 bg-gray-900/80 hover:bg-gray-800/90 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Navbar />
      
      {/* GLASS EFFECT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />
      
      <div className="relative max-w-2xl mx-auto p-4 md:p-6">
        {/* HEADER WITH GLASS EFFECT */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Messages
                <span className="ml-3 text-blue-400">💬</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-gray-400">
                  {chats.length} active conversation{chats.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* SEARCH ICON */}
            <div className="p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 cursor-pointer hover:bg-gray-800/70 transition-all duration-300">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* LOADING SKELETONS */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-800/30 backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-full bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-32 mb-3"></div>
                    <div className="h-3 bg-gray-800 rounded w-48"></div>
                  </div>
                  <div className="w-12 h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO CHATS STATE */}
        {!loading && chats.length === 0 && (
          <div className="text-center py-20">
            <div className="relative mx-auto mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700/50">
                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-bounce">
                <span className="text-white text-2xl">💭</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No messages yet</h3>
            <p className="text-gray-400 mb-8">Your inbox is waiting for new conversations</p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Start New Chat
            </button>
          </div>
        )}

        {/* CHATS LIST */}
        {!loading && chats.length > 0 && (
          <div className="space-y-3">
            {chats.map((c) => (
              <div
                key={c.user_id}
                onClick={() => router.push(`/chat/${c.user_id}`)}
                className="group relative bg-gray-800/40 backdrop-blur-xl hover:bg-gray-800/60 rounded-2xl p-5 cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-700/30 hover:border-blue-500/30 active:scale-[0.98] overflow-hidden"
              >
                {/* ANIMATED BACKGROUND GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative flex items-center gap-5">
                  {/* PROFILE AVATAR WITH MODAL */}
                  <div className="relative flex-shrink-0">
                    {c.profile_pic ? (
                      <div 
                        className="relative overflow-hidden rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-all duration-300 hover:scale-105 active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (c.profile_pic) {
                            openImageModal(c.profile_pic);
                          }
                        }}
                      >
                        <img
                          src={c.profile_pic}
                          alt={c.username}
                          className="w-16 h-16 rounded-full object-cover group-hover:brightness-110 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white text-2xl font-bold">
                          {c.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* ONLINE INDICATOR */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg" />
                    </div>
                  </div>

                  {/* CHAT DETAILS */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-blue-300 transition-colors duration-300">
                        {c.username}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-900/50 px-2 py-1 rounded-full">
                        {formatTime(c.last_time)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 truncate mb-3 group-hover:text-gray-200 transition-colors duration-300">
                      {c.last_message}
                    </p>
                    
                    {/* UNREAD BADGE */}
                    {c.unread_count > 0 && (
                      <div className="inline-flex items-center gap-2 animate-pulse">
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border border-blue-500/30">
                          <span className="mr-1">📬</span>
                          {c.unread_count} new message{c.unread_count > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHEVRON WITH ANIMATION */}
                  <div className="text-gray-500 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">🔒</span>
            </div>
            <p className="text-center text-sm text-gray-500">
              All messages are end-to-end encrypted • Your privacy is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
