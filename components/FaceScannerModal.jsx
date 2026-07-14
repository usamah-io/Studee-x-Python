"use client";

import { useEffect, useRef, useState } from "react";

export default function FaceScannerModal({ mode = "login", email = "", onClose, onSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [statusText, setStatusText] = useState("Memuat AI...");
  const [progress, setProgress] = useState(0);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Array untuk menampung sampel descriptor agar hasil rata-rata lebih presisi
  const collectedDescriptors = useRef([]);
  const animationFrameId = useRef(null);
  const localStream = useRef(null);

  // 1. Load face-api.js script secara dinamis dari CDN
  useEffect(() => {
    if (window.faceapi) {
      setFaceApiLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js";
    script.async = true;
    script.onload = () => {
      setFaceApiLoaded(true);
    };
    script.onerror = () => {
      setErrorMsg("Gagal memuat library Face AI dari server CDN.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 2. Load neural network models setelah script terpasang
  useEffect(() => {
    if (!faceApiLoaded) return;

    async function loadModels() {
      try {
        setStatusText("Mengunduh model neural network...");
        // Gunakan model CDN resmi Vlad Mandic
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        
        await window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setModelsLoaded(true);
        setStatusText("Model terunduh. Mengaktifkan kamera...");
      } catch (err) {
        console.error("Gagal mengunduh model Face API:", err);
        setErrorMsg("Gagal mengunduh model deteksi wajah.");
      }
    }

    loadModels();
  }, [faceApiLoaded]);

  // 3. Jalankan webcam stream setelah model siap
  useEffect(() => {
    if (!modelsLoaded) return;

    async function startCamera() {
      try {
        const constraints = {
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 }, 
            facingMode: "user" 
          },
          audio: false,
        };

        let stream;
        
        // Cek dukungan API mediaDevices (HTTP menonaktifkan API ini pada IP non-localhost)
        if (typeof navigator !== "undefined") {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          } else {
            // Cek api legacy
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (getUserMedia) {
              stream = await new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            } else {
              // Jika diakses menggunakan HTTP pada IP lokal (bukan localhost), berikan informasi jelas
              if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
                setErrorMsg("Akses kamera diblokir browser karena koneksi tidak aman (HTTP). Silakan gunakan HTTPS (misal: Ngrok) untuk pengujian di Handphone.");
              } else {
                setErrorMsg("Browser Anda tidak mendukung akses kamera webcam.");
              }
              return;
            }
          }
        } else {
          setErrorMsg("Browser environment tidak terdeteksi.");
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          localStream.current = stream;
          setStreamActive(true);
          setStatusText("Posisikan wajah Anda di tengah lingkaran");
        }
      } catch (err) {
        console.error("Gagal membuka kamera:", err);
        setErrorMsg(err.message || "Kamera tidak dapat diakses.");
      }
    }

    startCamera();

    // Cleanup
    return () => {
      stopCamera();
    };
  }, [modelsLoaded]);

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  // 4. Proses Loop Scan dan Pencarian Landmark Wajah
  useEffect(() => {
    if (!streamActive || !videoRef.current || scanComplete) return;

    let localProgress = 0;
    const requiredSamples = 5; // Kita kumpulkan 5 frame wajah yang bagus untuk rata-rata agar stabil

    async function onPlay() {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || scanComplete) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !window.faceapi) {
        if (!scanComplete) {
          animationFrameId.current = requestAnimationFrame(onPlay);
        }
        return;
      }

      // Pastikan resolusi video valid (bukan 0x0) agar TFJS WASM tidak melempar error tensor
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        if (!scanComplete) {
          animationFrameId.current = requestAnimationFrame(onPlay);
        }
        return;
      }

      // Samakan ukuran canvas secara dinamis
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const faceapi = window.faceapi;
      let detection = null;

      try {
        detection = await faceapi
          .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 }))
          .withFaceLandmarks()
          .withFaceDescriptor();
      } catch (err) {
        console.error("Eror saat mendeteksi wajah:", err);
      }

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        const { box } = detection.detection;
        const positions = detection.landmarks.positions;

        // --- GAMBAR CYBERNETIC FACE MESH (MediaPipe-Style) ---
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)"; // Cyan transparan
        ctx.lineWidth = 1;

        // 1. Garis Rahang (Jaw Outline)
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        for (let i = 1; i <= 16; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();

        // 2. Alis Kiri (Left Eyebrow)
        ctx.beginPath();
        ctx.moveTo(positions[17].x, positions[17].y);
        for (let i = 18; i <= 21; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();

        // 3. Alis Kanan (Right Eyebrow)
        ctx.beginPath();
        ctx.moveTo(positions[22].x, positions[22].y);
        for (let i = 23; i <= 26; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();

        // 4. Batang Hidung (Nose Bridge)
        ctx.beginPath();
        ctx.moveTo(positions[27].x, positions[27].y);
        for (let i = 28; i <= 30; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();

        // 5. Cuping Hidung (Nose Bottom)
        ctx.beginPath();
        ctx.moveTo(positions[31].x, positions[31].y);
        for (let i = 32; i <= 35; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();

        // 6. Mata Kiri (Left Eye)
        ctx.beginPath();
        ctx.moveTo(positions[36].x, positions[36].y);
        for (let i = 37; i <= 41; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.closePath();
        ctx.stroke();

        // 7. Mata Kanan (Right Eye)
        ctx.beginPath();
        ctx.moveTo(positions[42].x, positions[42].y);
        for (let i = 43; i <= 47; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.closePath();
        ctx.stroke();

        // 8. Bibir Luar (Outer Lips)
        ctx.beginPath();
        ctx.moveTo(positions[48].x, positions[48].y);
        for (let i = 49; i <= 59; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.closePath();
        ctx.stroke();

        // 9. Bibir Dalam (Inner Lips)
        ctx.beginPath();
        ctx.moveTo(positions[60].x, positions[60].y);
        for (let i = 61; i <= 67; i++) ctx.lineTo(positions[i].x, positions[i].y);
        ctx.closePath();
        ctx.stroke();

        // 10. Titik Sensor Menyala (Glowing Cyan Sensor Nodes)
        ctx.fillStyle = "#22d3ee"; // Bright cyan
        for (let i = 0; i < positions.length; i++) {
          ctx.beginPath();
          ctx.arc(positions[i].x, positions[i].y, 1.8, 0, 2 * Math.PI);
          ctx.fill();
        }
        // ----------------------------------------------------
        
        // Verifikasi apakah posisi wajah berada di tengah area lingkaran deteksi
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const faceCenterX = box.x + box.width / 2;
        const faceCenterY = box.y + box.height / 2;

        const distanceToCenter = Math.sqrt(
          Math.pow(faceCenterX - canvasCenterX, 2) + Math.pow(faceCenterY - canvasCenterY, 2)
        );

        // Jika wajah relatif di tengah
        if (distanceToCenter < 120 && box.width > 120) {
          setStatusText("Memindai... Jangan bergerak.");
          
          // Gambar lingkaran hijau pelacak wajah
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(faceCenterX, faceCenterY, box.width / 2 + 10, 0, 2 * Math.PI);
          ctx.stroke();

          // Simpan descriptor
          collectedDescriptors.current.push(Array.from(detection.descriptor));
          localProgress += 20; // 5 sampel = 100%
          setProgress(Math.min(localProgress, 100));

          if (collectedDescriptors.current.length >= requiredSamples) {
            setScanComplete(true);
            stopCamera();
            
            // Hitung rata-rata 128-dimensi descriptor
            const avgDescriptor = new Array(128).fill(0);
            for (let i = 0; i < 128; i++) {
              let sum = 0;
              for (let j = 0; j < requiredSamples; j++) {
                sum += collectedDescriptors.current[j][i];
              }
              avgDescriptor[i] = sum / requiredSamples;
            }

            handleScanSuccess(avgDescriptor);
            return;
          }
        } else {
          setStatusText("Dekatkan wajah Anda ke tengah lingkaran.");
          // Gambar lingkaran kuning instruksi
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(faceCenterX, faceCenterY, box.width / 2 + 10, 0, 2 * Math.PI);
          ctx.stroke();
        }
      } else {
        setStatusText("Wajah tidak terdeteksi.");
      }

      if (!scanComplete) {
        animationFrameId.current = requestAnimationFrame(onPlay);
      }
    }

    // Tunggu metadata video termuat
    videoRef.current.onloadedmetadata = () => {
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
      onPlay();
    };

    // Jika video sudah dimuat sebelumnya
    if (videoRef.current.readyState >= 2) {
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
      onPlay();
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [streamActive, scanComplete]);

  // 5. Hubungkan ke backend API setelah scan 100%
  const handleScanSuccess = async (descriptor) => {
    setStatusText("Memproses data biometrik...");

    try {
      const endpoint = mode === "register" ? "/api/auth/face/register" : "/api/auth/face/login";
      const payload = mode === "register" ? { email, faceDescriptor: descriptor } : { faceDescriptor: descriptor };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatusText(mode === "register" ? "Registrasi Face ID Sukses!" : "Login Berhasil!");
        setTimeout(() => {
          onSuccess(data);
        }, 1200);
      } else {
        setErrorMsg(data.error || "Pencocokan biometrik wajah gagal.");
        setScanComplete(false);
        collectedDescriptors.current = [];
        setProgress(0);
        
        // Aktifkan kamera kembali setelah jeda singkat
        setTimeout(() => {
          setErrorMsg("");
          setStatusText("Silakan coba posisikan wajah Anda kembali");
          setStreamActive(false);
          setTimeout(() => setStreamActive(true), 500);
        }, 3000);
      }
    } catch (err) {
      console.error("Gagal memanggil API Face ID:", err);
      setErrorMsg("Koneksi server gagal.");
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-slate-950 text-white p-6 font-sans select-none">
      {/* Laser scan animation stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan-laser {
          0% { top: 5%; }
          50% { top: 95%; }
          100% { top: 5%; }
        }
      `}} />

      {/* Decorative background glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Top Section */}
      <div className="w-full max-w-md mx-auto text-center pt-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Sistem Autentikasi Biometrik
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">
          {mode === "register" ? "Daftarkan Face ID" : "Scan Masuk Face ID"}
        </h3>
        <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed">
          {mode === "register"
            ? "Pindai wajah Anda untuk mendaftarkan kunci login biometrik."
            : "Posisikan wajah Anda di depan kamera untuk verifikasi masuk."}
        </p>
      </div>

      {/* Middle Section (Camera Viewport) */}
      <div className="relative w-[280px] h-[280px] mx-auto bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center z-10">
        {/* Cyberpunk Neon Corner Brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-[3px] border-l-[3px] border-cyan-400 rounded-tl-lg z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-[3px] border-r-[3px] border-cyan-400 rounded-tr-lg z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3px] border-l-[3px] border-cyan-400 rounded-bl-lg z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3px] border-r-[3px] border-cyan-400 rounded-br-lg z-20 pointer-events-none" />

        {/* Scanning Laser Line */}
        {!errorMsg && streamActive && (
          <div 
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] z-20 pointer-events-none"
            style={{ animation: 'scan-laser 3s ease-in-out infinite', position: 'absolute' }}
          />
        )}

        {errorMsg ? (
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-red-400 px-2 leading-relaxed">{errorMsg}</p>
          </div>
        ) : null}

        {/* Video stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1] z-10"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none scale-x-[-1] z-20"
        />
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md mx-auto pb-12 relative z-10 space-y-8">
        {/* Progress & Status */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold px-2">
            <span className="text-slate-400 tracking-wide uppercase">{statusText}</span>
            <span className="text-cyan-400 font-mono text-sm">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cancel Scan Button */}
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-4 bg-slate-900 hover:bg-slate-850 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98] border border-slate-850 hover:border-slate-800 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer text-sm"
        >
          Batalkan Scan
        </button>
      </div>
    </div>
  );
}
