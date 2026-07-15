"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Check, Camera } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: "Pengguna Konsisten",
    email: "user@example.com",
    username: "penggunakonsisten",
    password: "••••••••••••",
    phone: "+62 812-3456-7890"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    alert("Profil berhasil diperbarui!");
    router.push("/profile");
  };

  return (
    <main className="min-h-screen pb-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-white/90" />
          </button>
          
          <span className="text-sm font-bold tracking-wider text-white/90">Edit Profile</span>
          
          <button
            onClick={handleSave}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl flex items-center justify-center text-emerald-400 transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Save"
          >
            <Check className="w-5 h-5 text-emerald-400" />
          </button>
        </div>

        {/* Profile Image Editor */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center border-2 border-white/25 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* Camera Icon Badge */}
            <button 
              onClick={() => alert("Mengunggah foto baru...")}
              className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5 mt-2">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-300 font-bold uppercase tracking-wider pl-1">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-300 font-bold uppercase tracking-wider pl-1">E-mail Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>

          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-300 font-bold uppercase tracking-wider pl-1">User Name</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-300 font-bold uppercase tracking-wider pl-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-purple-300 font-bold uppercase tracking-wider pl-1">Phone Number</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>
        </div>

      </div>
    </main>
  );
}
