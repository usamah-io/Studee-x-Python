"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleGoogleLoginClick = () => {
    /* global google */
    if (typeof window !== "undefined" && window.google && window.google.accounts && window.google.accounts.oauth2) {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "280008100286-53g4budrqvp9oibt9rrljs5s0ajrgdod.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              // Fetch user profile from google userinfo API
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const payload = await res.json();
              const userEmail = payload.email;
              const userName = payload.name;
              const userPicture = payload.picture;

              // Store in localStorage
              localStorage.setItem("userName", userName);
              localStorage.setItem("userEmail", userEmail);
              localStorage.setItem("userPicture", userPicture);

              // Determine role
              if (userEmail.toLowerCase() === "admin@example.com") {
                localStorage.setItem("userRole", "admin");
                document.cookie = "userRole=admin; path=/";
              } else {
                localStorage.setItem("userRole", "user");
                document.cookie = "userRole=user; path=/";
              }

              localStorage.setItem("isLoggedIn", "true");
              document.cookie = "isLoggedIn=true; path=/";
              localStorage.setItem("hasVisitedOnboarding", "true");

              // Redirect
              let redirectTo = "/dashboard";
              const params = new URLSearchParams(window.location.search);
              redirectTo = params.get("redirectTo") || "/dashboard";
              router.push(redirectTo);
            } catch (err) {
              console.error("Gagal mengambil data user Google:", err);
              alert("Terjadi kesalahan saat memproses data akun Google Anda.");
            }
          }
        },
      });
      tokenClient.requestAccessToken();
    } else {
      alert("Google Sign-In SDK belum termuat. Silakan coba sesaat lagi.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Admin check
    const emailLower = email.toLowerCase();
    if (emailLower === "admin@example.com" || emailLower === "admin@stry.com") {
      localStorage.setItem("userRole", "admin");
      document.cookie = "userRole=admin; path=/";
    } else {
      localStorage.setItem("userRole", "user");
      document.cookie = "userRole=user; path=/";
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", email.split("@")[0]);
    localStorage.setItem("isLoggedIn", "true");
    document.cookie = "isLoggedIn=true; path=/";
    localStorage.setItem("hasVisitedOnboarding", "true");

    // Read redirect parameter
    let redirectTo = "/dashboard";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      redirectTo = params.get("redirectTo") || "/dashboard";
    }
    router.push(redirectTo);
  };

  const handleSocialLogin = () => {
    localStorage.setItem("userRole", "user");
    document.cookie = "userRole=user; path=/";
    localStorage.setItem("isLoggedIn", "true");
    document.cookie = "isLoggedIn=true; path=/";
    localStorage.setItem("hasVisitedOnboarding", "true");

    // Read redirect parameter
    let redirectTo = "/dashboard";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      redirectTo = params.get("redirectTo") || "/dashboard";
    }
    router.push(redirectTo);
  };

  return (
    <main className="min-h-screen app-theme-bg font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 app-theme-text-muted app-theme-card hover:bg-black/5 dark:hover:bg-white/5 rounded-xl py-2 px-4 transition-all text-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.06)]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </Link>

      <div className="max-w-md w-full app-theme-card rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow behind card header */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-color)]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm app-theme-text-muted">
            Login untuk mulai belajar dan melacak progress kamu.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider app-theme-text-muted mb-2 pl-1">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-3.5 px-4 text-[var(--text-color)] placeholder-[var(--text-color)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all text-sm font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black rounded-2xl py-3.5 px-4 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] border border-black/10 dark:border-white/10"
          >
            Lanjutkan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 relative z-10">
          <div className="flex-1 border-t border-[var(--border-color)]"></div>
          <span className="px-3 text-xs app-theme-text-muted tracking-wider uppercase font-semibold">atau</span>
          <div className="flex-1 border-t border-[var(--border-color)]"></div>
        </div>

        {/* Social Logins */}
        <div className="space-y-3 relative z-10 flex flex-col items-center w-full">
          <button
            onClick={handleGoogleLoginClick}
            className="w-full app-theme-card hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-color)] rounded-2xl py-3.5 px-4 font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-[0.98] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Login dengan Google</span>
          </button>
        </div>
      </div>
    </main>
  );
}
