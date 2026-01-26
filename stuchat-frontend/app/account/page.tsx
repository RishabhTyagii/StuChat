"use client";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import { Upload, User, Mail, Camera, Loader2, LogOut } from "lucide-react";

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("https://studeskpro.site/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  function upload() {
    if (!file) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    setUploading(true);
    const form = new FormData();
    form.append("profile_pic", file);

    fetch("https://studeskpro.site/api/profile/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFile(null);
        setPreview(null);
      })
      .finally(() => setUploading(false));
  }

  function handleLogout() {
    localStorage.removeItem("access");
    window.location.href = "/login";
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg font-semibold">Loading your  profile...</p>
        </div>
      </div>
    );
  }

  return (
    

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
        <Navbar />
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12">
        
        
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blue-500/30 overflow-hidden shadow-2xl">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profile.profile_pic ? (
                      <img
                        src={`https://studeskpro.site${profile.profile_pic}`}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <User size={60} className="opacity-80" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
                  >
                    <Camera size={20} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{profile.username}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                      <Mail size={18} className="text-blue-400" />
                      <p className="text-lg">{profile.email}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-sm text-gray-400">Posts</p>
                      {/* <p className="text-2xl font-bold">42</p> */}
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-sm text-gray-400">Following</p>
                      {/* <p className="text-2xl font-bold">156</p> */}
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-sm text-gray-400">Followers</p>
                      {/* <p className="text-2xl font-bold">289</p> */}
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Upload size={20} />
                        <span>{file ? file.name : "Choose File"}</span>
                      </button>
                      
                      <button
                        onClick={upload}
                        disabled={!file || uploading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                    
                    {file && (
                      <p className="text-sm text-green-400 animate-pulse">
                        ✓ New image selected! Click "Update Profile" to save.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {['Updated profile picture', 'Changed password'].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{activity}</span>
                   
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Account Settings <span style={{ fontSize: '15px', color:'grey' }}>Not Allowed</span>  </h3> 
              <div className="space-y-4">
                <button className="w-full text-left p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                  Privacy & Security
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                  Notifications
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                  Connected Apps
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                  Dark Mode
                </button>
              </div>
            </div>



            {/* Danger Zone */}
            <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-300">Danger Zone <span style={{ fontSize: '15px', color:'grey' }}>Not Allowed</span></h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-300">
                  Deactivate Account
                </button>
                <button className="w-full text-left p-3 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-colors text-red-400">
                  Delete Account
                </button>
                  <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-IN')} • Made By yourbaazar IT Cell</p>
        </div>
      </div>
    </div>
  );
}