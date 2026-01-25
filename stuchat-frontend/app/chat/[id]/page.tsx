"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

type Msg = {
  text: string;
  sender: string;
  seen?: boolean;
};

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [myUsername, setMyUsername] = useState<string>("");
  const [myPic, setMyPic] = useState<string | null>(null);
  const [otherPic, setOtherPic] = useState<string | null>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [status, setStatus] = useState<"online" | "offline">("offline");

  // 🔥 AUTO SCROLL TO BOTTOM WHEN NEW MESSAGE COMES
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token || !otherUserId) return;

    /* 🔹 LOAD MY PROFILE */
    fetch("https://stuchat-1.onrender.com/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((u) => {
        setMyUsername(u.username);
        setMyPic(u.profile_pic ? `https://stuchat-1.onrender.com${u.profile_pic}` : null);
      });

    /* 🔹 LOAD CHAT HISTORY */
    fetch(`https://stuchat-1.onrender.com/api/chat/history/${otherUserId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(
            data.map((m: any) => ({
              text: m.content,
              sender: m.sender,
              seen: m.is_seen,
            }))
          );
        }
      });

    /* 🔹 LOAD OTHER USER PROFILE */
    fetch(`https://stuchat-1.onrender.com/api/user/${otherUserId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((u) => {
        setOtherPic(
          u.profile_pic ? `https://stuchat-1.onrender.com${u.profile_pic}` : null
        );
      });

    /* 🔹 WEBSOCKET */
    const socket = new WebSocket(
      `ws://stuchat-1.onrender.com/chat/${otherUserId}/?token=${token}`
    );

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // 🟢 ONLINE / OFFLINE (ONLY OTHER USER)
      if (data.type === "status") {
        if (data.user !== myUsername) {
          setStatus(data.status);
        }
        return;
      }

      // ✍️ TYPING (ONLY OTHER USER)
      if (data.type === "typing") {
        if (data.sender !== myUsername) {
          setTypingUser(data.status ? data.sender : null);
        }
        return;
      }

      // ✔✔ READ RECEIPT (ONLY MY MESSAGES)
      if (data.type === "seen") {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender === myUsername ? { ...m, seen: true } : m
          )
        );
        return;
      }

      // 💬 MESSAGE
      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            text: data.message,
            sender: data.sender,
            seen: false,
          },
        ]);
      }
    };

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "seen" }));
    };

    setWs(socket);
    return () => socket.close();
  }, [otherUserId, myUsername]);

  function sendMessage() {
    if (!ws || !message.trim()) return;

    ws.send(JSON.stringify({ message }));
    ws.send(JSON.stringify({ type: "typing", status: false }));
    setMessage("");
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* HEADER - GLASS EFFECT */}
      <div className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700 p-5">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {otherPic && (
              <div className="relative">
                <img
                  src={otherPic}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-3 border-blue-500"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${status === "online" ? "bg-green-400" : "bg-gray-500"}`} />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">
                User {otherUserId}
              </h1>
              <div className="flex items-center gap-2">
                <div className={`text-sm ${status === "online" ? "text-green-400" : "text-gray-400"}`}>
                  {status === "online" ? "• Online" : "• Offline"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((m, i) => {
          const isMe = m.sender === myUsername;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"} gap-3`}
            >
              {/* OTHER USER'S AVATAR */}
              {!isMe && otherPic && (
                <img
                  src={otherPic}
                  alt="Other user"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}

              {/* MESSAGE BUBBLE */}
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`rounded-2xl px-5 py-3 ${isMe
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                    }`}
                >
                  <p className="text-sm break-words">{m.text}</p>
                </div>
                
                {/* TICKS - Only for my messages */}
                {isMe && (
                  <div className={`flex justify-end mt-1 px-1 ${isMe ? "pr-2" : "pl-2"}`}>
                    <span className={`text-xs ${m.seen ? "text-blue-400" : "text-gray-500"}`}>
                      {m.seen ? "✔✔" : "✔"}
                    </span>
                  </div>
                )}
              </div>

              {/* MY AVATAR */}
              {isMe && myPic && (
                <img
                  src={myPic}
                  alt="Me"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}
            </div>
          );
        })}
        
        {/* TYPING INDICATOR - SHOWS AT THE BOTTOM */}
        {typingUser && (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="flex gap-1 ml-14">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
            <span className="text-sm text-gray-400">{typingUser} is typing...</span>
          </div>
        )}
        
        {/* AUTO SCROLL REF */}
        <div ref={messagesEndRef} />
      </div>

      {/* FIXED INPUT BOX - MODERN DESIGN */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 p-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  ws?.send(JSON.stringify({ type: "typing", status: true }));
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm shadow-xl"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-4 rounded-full transition-all duration-300 ${message.trim()
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:scale-105 active:scale-95"
                  : "bg-gray-800 border border-gray-700 cursor-not-allowed"
                }`}
            >
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        <p className="text-center text-white text-sm mt-4">End-to-end encrypted chat</p>
        </div>
      </div>
    </div>
  );
}