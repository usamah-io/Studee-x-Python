"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Check, Camera, User, Mail, AtSign, Phone, Lock } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();

  // Form states initialized empty for dynamic population
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "••••••••••••",
    phone: "",
    picture: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 1. Ambil data user dari NextAuth session & LocalStorage secara dinamis
    async function loadUserData() {
      try {
        let name = "";
        let email = "";
        let picture = "";
        let phone = "";
        let username = "";

        // Cek NextAuth Session API terlebih dahulu
        try {
          const res = await fetch("/api/auth/session");
          const session = await res.json();
          if (session?.user) {
            name = session.user.name || "";
            email = session.user.email || "";
            picture = session.user.image || "";
          }
        } catch (err) {
          console.error("Gagal mengambil NextAuth session:", err);
        }

        // Fallback ke LocalStorage jika data belum ada
        if (typeof window !== "undefined") {
          const localName = localStorage.getItem("userName");
          const localEmail = localStorage.getItem("userEmail");
          const localPicture = localStorage.getItem("userPicture");
          const localPhone = localStorage.getItem("userPhone");
          const localUsername = localStorage.getItem("userUsername");

          if (!name && localName) name = localName;
          if (!email && localEmail) email = localEmail;
          if (!picture && localPicture) picture = localPicture;
          if (localPhone) phone = localPhone;
          if (localUsername) username = localUsername;
        }

        // Default username berdasarkan email jika belum diset
        if (!username && email) {
          username = email.split("@")[0].toLowerCase();
        }

        setFormData({
          name: name || "Pengguna Studee",
          email: email || "user@studee.app",
          username: username || "penggunastudee",
          password: "••••••••••••",
          phone: phone || "",
          picture: picture || ""
        });
      } catch (error) {
        console.error("Gagal memuat profil pengguna:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userUsername", formData.username);
      localStorage.setItem("userPhone", formData.phone);
      if (formData.picture) {
        localStorage.setItem("userPicture", formData.picture);
      }
    }

    setIsSaved(true);
    setTimeout(() => {
      router.push("/profile");
    }, 600);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-semibold text-zinc-400">Memuat profil...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 bg-black text-white font-sans relative overflow-hidden flex flex-col items-center select-none">
      {/* Dynamic Background Noise / Gradient subtle glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-300" />
          </button>
          
          <span className="text-sm font-bold tracking-wider text-zinc-100">Edit Profile</span>
          
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white text-black hover:bg-zinc-200 border border-white rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Simpan"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Tersimpan</span>
              </>
            ) : (
              <span>Simpan</span>
            )}
          </button>
        </div>

        {/* Profile Image Editor */}
        <div className="flex flex-col items-center mt-2">
          <div className="relative">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl overflow-hidden">
              {formData.picture ? (
                <img 
                  src={formData.picture} 
                  alt={formData.name} 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-10 h-10 text-zinc-400" />
              )}
            </div>
            
            {/* Camera Icon Badge */}
            <button 
              type="button"
              onClick={() => alert("Fitur unggah foto lokal siap diintegrasikan.")}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-zinc-300 rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Ubah foto"
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium mt-3">Ketuk ikon kamera untuk mengubah foto profil</span>
        </div>

        {/* Form Fields Card */}
        <div className="flex flex-col gap-4 mt-2 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <User className="w-3 h-3 text-zinc-500" />
              Nama Lengkap
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner font-medium"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-zinc-500" />
              Alamat E-mail
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner font-medium"
            />
          </div>

          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <AtSign className="w-3 h-3 text-zinc-500" />
              Username
            </label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="username..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner font-medium"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-zinc-500" />
              Kata Sandi
            </label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner font-medium"
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-zinc-500" />
              Nomor Telepon
            </label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner font-medium"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl shadow-xl transition-all duration-300 ease-in-out active:scale-[0.98] cursor-pointer text-xs tracking-wider uppercase mt-2"
        >
          {isSaved ? "Berhasil Disimpan!" : "Simpan Perubahan"}
        </button>

      </div>
    </main>
  );
}
