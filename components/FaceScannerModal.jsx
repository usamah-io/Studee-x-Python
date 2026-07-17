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
  const [step, setStep] = useState("name"); // "name" | "welcome" | "scan"
  const [inputName, setInputName] = useState("");
  const [isFaceCentered, setIsFaceCentered] = useState(false);

  // Array untuk menampung sampel descriptor agar hasil rata-rata lebih presisi
  const collectedDescriptors = useRef([]);
  const animationFrameId = useRef(null);
  const localStream = useRef(null);
  const isCapturing = useRef(false);

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

  // 3. Jalankan webcam stream setelah model siap dan langkah scan aktif
  useEffect(() => {
    if (!modelsLoaded || step !== "scan") return;
    let isMounted = true;

    async function startCamera() {
      if (isCapturing.current) return;
      isCapturing.current = true;
      try {
        const constraints = {
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 }, 
            facingMode: "user" 
          },
          audio: false,
        };

        // Stop any running stream
        stopCamera();

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
              if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
                setErrorMsg("Akses kamera diblokir browser karena koneksi tidak aman (HTTP). Silakan gunakan HTTPS (misal: Ngrok) untuk pengujian di Handphone.");
              } else {
                setErrorMsg("Browser Anda tidak mendukung akses kamera webcam.");
              }
              isCapturing.current = false;
              return;
            }
          }
        } else {
          setErrorMsg("Browser environment tidak terdeteksi.");
          isCapturing.current = false;
          return;
        }

        if (!isMounted) {
          // Jika komponen di-unmount selama proses await, hentikan stream segera
          stream.getTracks().forEach((track) => track.stop());
          isCapturing.current = false;
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
        if (err.name === "NotReadableError" || err.message?.includes("Could not start video source")) {
          // Tunggu sebentar dan coba sekali lagi (Fast Refresh/Strict Mode lock resolution)
          await new Promise((resolve) => setTimeout(resolve, 800));
          if (isMounted) {
            try {
              const retryStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
              if (!isMounted) {
                retryStream.getTracks().forEach((track) => track.stop());
                isCapturing.current = false;
                return;
              }
              if (videoRef.current) {
                videoRef.current.srcObject = retryStream;
                localStream.current = retryStream;
                setStreamActive(true);
                setStatusText("Posisikan wajah Anda di tengah lingkaran");
                isCapturing.current = false;
                return;
              }
            } catch (retryErr) {
              console.error("Percobaan ulang kamera gagal:", retryErr);
              setErrorMsg("Kamera sedang digunakan oleh tab lain atau aplikasi lain. Harap tutup tab/aplikasi tersebut.");
            }
          }
        } else {
          setErrorMsg(err.message || "Kamera tidak dapat diakses.");
        }
      } finally {
        isCapturing.current = false;
      }
    }

    startCamera();

    // Cleanup
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [modelsLoaded, step]);

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error("Gagal menghentikan track kamera:", e);
        }
      });
      localStream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  // 4. Proses Loop Scan dan Pencarian Landmark Wajah
  useEffect(() => {
    if (!streamActive || !videoRef.current || scanComplete || step !== "scan") return;

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
          setIsFaceCentered(true);

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
          setStatusText("Dekatkan wajah Anda ke tengah bingkai.");
          setIsFaceCentered(false);
        }
      } else {
        setStatusText("Wajah tidak terdeteksi.");
        setIsFaceCentered(false);
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
  }, [streamActive, scanComplete, step]);

  // 5. Hubungkan ke backend API setelah scan 100%
  const handleScanSuccess = async (descriptor) => {
    setStatusText("Memproses data biometrik...");

    try {
      const endpoint = mode === "register" ? "/api/auth/face/register" : "/api/auth/face/login";
      const payload = mode === "register" ? { email, faceDescriptor: Array.from(descriptor) } : { faceDescriptor: Array.from(descriptor) };

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

  if (step === "name") {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white font-sans p-6 overflow-hidden select-none">
        {/* Glow background */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-sm flex flex-col gap-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-bold uppercase tracking-wider mb-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Face ID Verification
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">Masukkan Nama Anda</h2>
            <p className="text-sm text-white/50">Tuliskan nama Anda untuk memulai proses autentikasi.</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-white/30 focus:outline-none transition-all duration-300 shadow-inner"
            />
            <button
              onClick={() => {
                if (inputName.trim()) {
                  setStep("welcome");
                }
              }}
              disabled={!inputName.trim()}
              className="w-full py-4 bg-white disabled:bg-white/20 disabled:text-white/40 text-black hover:bg-gray-100 disabled:hover:bg-white/20 font-bold rounded-2xl shadow-xl transition-all duration-300 ease-in-out active:scale-[0.98] cursor-pointer text-sm tracking-wide"
            >
              LANJUTKAN
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors cursor-pointer text-center mt-2"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white font-sans p-6 overflow-hidden select-none">
        {/* Glow background */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-sm flex flex-col gap-8 text-center relative z-10">
          <div className="space-y-6">
            {/* Animated Face Scanner Icon (Black & White) */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Radial ticks (circular pattern of lines) using SVG */}
              <svg className="absolute inset-0 w-full h-full text-white/20 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i * 360) / 60;
                  return (
                    <line
                      key={i}
                      x1="50"
                      y1="6"
                      x2="50"
                      y2="14"
                      transform={`rotate(${angle} 50 50)`}
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  );
                })}
              </svg>

              {/* Center Smiley Face Box */}
              <div className="w-24 h-24 rounded-3xl border border-white/20 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md shadow-2xl relative">
                {/* Eyes */}
                <div className="flex gap-4 mb-3">
                  <span className="w-2 h-2 rounded-full bg-white/70"></span>
                  <span className="w-2 h-2 rounded-full bg-white/70"></span>
                </div>
                {/* Smile */}
                <svg className="w-8 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 12">
                  <path d="M2 2c4 8 16 8 20 0" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-3xl font-black tracking-tight text-white leading-tight">Hello {inputName}</h2>
              <p className="text-sm text-white/50 max-w-[280px] mx-auto leading-relaxed">
                Gunakan Face ID untuk masuk ke akun Anda.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setStep("scan")}
              className="w-full py-4 bg-white text-black hover:bg-gray-150 font-bold rounded-2xl shadow-xl transition-all duration-300 ease-in-out active:scale-[0.98] cursor-pointer text-sm tracking-wide"
            >
              GET STARTED
            </button>
            <button
              onClick={() => setStep("name")}
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors cursor-pointer block mx-auto pt-2"
            >
              Ganti Nama
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black text-white font-sans select-none overflow-hidden py-12 px-6">
      {/* Laser scan animation stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan-laser {
          0% { top: 5%; }
          50% { top: 95%; }
          100% { top: 5%; }
        }
      `}} />

      {/* Top Section */}
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          Sistem Autentikasi Biometrik
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {mode === "register" ? "DAFTARKAN WAJAH" : "SCAN MASUK FACE ID"}
          </h3>
          <p className="text-xs text-white/50 px-6 leading-relaxed">
            {mode === "register"
              ? "Pindai wajah Anda untuk mendaftarkan kunci login."
              : "Posisikan wajah Anda di depan kamera untuk verifikasi masuk."}
          </p>
        </div>
      </div>

      {/* Middle Section: Centered Camera Frame */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[40px] overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(255,255,255,0.02)] mx-auto flex-shrink-0">
        {/* Video stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
        
        {/* Canvas (hidden or clear) */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none scale-x-[-1] hidden"
        />

        {/* White Corner Borders */}
        {/* Top-Left */}
        <div className={`absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl transition-colors duration-300 ${isFaceCentered ? "border-white" : "border-white/20"}`}></div>
        {/* Top-Right */}
        <div className={`absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl transition-colors duration-300 ${isFaceCentered ? "border-white" : "border-white/20"}`}></div>
        {/* Bottom-Left */}
        <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl transition-colors duration-300 ${isFaceCentered ? "border-white" : "border-white/20"}`}></div>
        {/* Bottom-Right */}
        <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl transition-colors duration-300 ${isFaceCentered ? "border-white" : "border-white/20"}`}></div>

        {/* Scanning Laser Line (White) */}
        {!errorMsg && streamActive && (
          <div 
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#ffffff] z-10 pointer-events-none"
            style={{ animation: 'scan-laser 3s ease-in-out infinite' }}
          />
        )}

        {/* Error Message overlay inside frame */}
        {errorMsg && (
          <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-white px-2 leading-relaxed">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Status Text & Horizontal Progress */}
        {!errorMsg && streamActive && (
          <div className="w-full max-w-xs mx-auto space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
              <span className="truncate max-w-[200px]">{statusText}</span>
              <span className="text-white font-black">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cancel Scan Button */}
        <div className="px-6">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-4 border border-white/20 hover:bg-white/5 text-white rounded-2xl font-bold transition-all active:scale-[0.98] cursor-pointer text-sm tracking-wide"
          >
            BATALKAN SCAN
          </button>
        </div>
      </div>
    </div>
  );
}
