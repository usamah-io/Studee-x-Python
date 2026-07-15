// components/VideoPlayer.jsx
"use client";

import React from "react";

export default function VideoPlayer({ videoUrl }) {
  if (!videoUrl) return null;

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // YouTube Parser
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const ytMatch = url.match(ytReg);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    // Google Drive Parser
    const gdReg = /\/file\/d\/([^\/]+)/;
    const gdMatch = url.match(gdReg);
    if (gdMatch && gdMatch[1]) {
      return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    }

    // Return the URL as-is if it's already an embed link
    if (url.includes("embed") || url.includes("preview")) {
      return url;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col gap-3.5 relative overflow-hidden">
      {/* Decorative Blur Orb inside card */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 blur-xl pointer-events-none" />

      <div className="flex items-center justify-between pb-2.5 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
          </svg>
          <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider">
            Video Pembelajaran
          </span>
        </div>
        <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">
          Play Mode
        </span>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner z-10">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="Video Player"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40 italic">
            Video tidak dapat dimuat
          </div>
        )}
      </div>
    </div>
  );
}
