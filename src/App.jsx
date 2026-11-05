import React, { useState, useRef, useEffect } from "react";
import { 
  Heart, Sparkles, Cake, Star, Music, Volume2, VolumeX, 
  Upload, Camera, RefreshCw, ChevronRight, Moon, Lightbulb, 
  PartyPopper, Wand2, Mail, Check, Disc3, Image as ImageIcon, X
} from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSpotify, setShowSpotify] = useState(true);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [activeZoomPhoto, setActiveZoomPhoto] = useState(null);

  // Real photos mapped with primary direct CDN link, backup direct link, and web page reference
  const initialPolaroids = [
    {
      id: 1,
      caption: "that sunny picnic 🧺",
      tag: "Road Trip by the Car",
      rotation: "-rotate-2",
      imageSrc: "https://i.ibb.co/3YQgJLhB/WhatsApp-Image-2026-11-06-at-00-22-50.jpg",
      pageUrl: "https://ibb.co/3YQgJLhB"
    },
    {
      id: 2,
      caption: "counting stars ✨",
      tag: "Festive Night Out",
      rotation: "rotate-2",
      imageSrc: "https://i.ibb.co/C3rNJ2qg/WhatsApp-Image-2026-11-06-at-00-26-17.jpeg",
      pageUrl: "https://ibb.co/C3rNJ2qg"
    },
    {
      id: 3,
      caption: "the sweetest chaos 🍰",
      tag: "Cute Wink & Curls",
      rotation: "-rotate-1",
      imageSrc: "https://i.ibb.co/3y1bKtD3/WhatsApp-Image-2026-11-06-at-00-21-29.jpg",
      pageUrl: "https://ibb.co/3y1bKtD3"
    },
    {
      id: 4,
      caption: "top of the world 🎈",
      tag: "Butterfly Glow Portrait",
      rotation: "rotate-3",
      imageSrc: "https://i.ibb.co/M4pvGLD/WhatsApp-Image-2026-11-06-at-00-23-33.jpg",
      pageUrl: "https://ibb.co/M4pvGLD"
    }
  ];

  const [polaroids, setPolaroids] = useState(initialPolaroids);

  // Load any user uploaded overrides from local storage if saved
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem("madam_ji_photos");
      if (savedPhotos) {
        const parsed = JSON.parse(savedPhotos);
        setPolaroids(prev =>
          prev.map(p => ({
            ...p,
            userPhoto: parsed[p.id] || null
          }))
        );
      }
    } catch (e) {
      console.log("Storage check:", e);
    }
  }, []);

  // Handle Photo File Upload & save to Base64 in state + localStorage
  const handlePhotoUpload = (e, id) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      setPolaroids(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, userPhoto: base64Data } : p);
        try {
          const toSave = {};
          updated.forEach(item => {
            if (item.userPhoto) toSave[item.id] = item.userPhoto;
          });
          localStorage.setItem("madam_ji_photos", JSON.stringify(toSave));
        } catch (err) {
          console.log("Could not store image locally:", err);
        }
        return updated;
      });
      playChime(780, "sine", 0.4);
    };
    reader.readAsDataURL(file);
  };

  const removeCustomPhoto = (id, e) => {
    e.stopPropagation();
    setPolaroids(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, userPhoto: null } : p);
      try {
        const toSave = {};
        updated.forEach(item => {
          if (item.userPhoto) toSave[item.id] = item.userPhoto;
        });
        localStorage.setItem("madam_ji_photos", JSON.stringify(toSave));
      } catch (err) {}
      return updated;
    });
  };

  // Audio synthesizer for cute sound effects using Web Audio API
  const playChime = (freq = 520, type = "sine", duration = 0.4) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  const playConfettiMelody = () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => playChime(freq, "triangle", 0.5), idx * 120);
    });
  };

  const playCakeCutSound = () => {
    playChime(320, "sawtooth", 0.2);
    setTimeout(() => playChime(640, "sine", 0.4), 150);
  };

  const playWishSound = () => {
    [600, 800, 1000, 1200, 1500].forEach((freq, idx) => {
      setTimeout(() => playChime(freq, "sine", 0.6), idx * 100);
    });
  };

  // Screen 1: Open Envelope
  const handleEnvelopeClick = () => {
    playChime(440, "triangle", 0.3);
    setEnvelopeOpened(true);
    setTimeout(() => {
      playChime(660, "sine", 0.5);
      setCurrentStep(2);
    }, 1800);
  };

  // Screen 2: Lights Switch
  const handleTurnLightsOn = () => {
    setLightsOn(true);
    playConfettiMelody();
    setTimeout(() => {
      setCurrentStep(3);
    }, 1200);
  };

  // Screen 4: Cake Cutting logic
  const handleCakeSlice = () => {
    if (cakeCut) return;
    setIsCutting(true);
    playCakeCutSound();
    setTimeout(() => {
      setCakeCut(true);
      setIsCutting(false);
      playConfettiMelody();
    }, 600);
  };

  // Screen 5: Make a wish
  const handleMakeWish = () => {
    playWishSound();
    setWishMade(true);
    setTimeout(() => {
      setCurrentStep(6);
    }, 2800);
  };

  const resetAll = () => {
    setCurrentStep(1);
    setEnvelopeOpened(false);
    setLightsOn(false);
    setCakeCut(false);
    setWishMade(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf8f4] text-[#4a3b32] font-sans antialiased relative overflow-hidden flex flex-col items-center justify-between selection:bg-pink-200">
      
      {/* Background Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-[10%] w-32 h-32 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 bg-amber-100/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/40 text-xs animate-ping"
            style={{
              top: `${(i * 19) % 90}%`,
              left: `${(i * 27) % 94}%`,
              animationDuration: `${2.5 + (i % 3)}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Top Header / Progress Bar */}
      <header className="w-full max-w-md pt-5 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 text-xs tracking-wider text-pink-600/80 font-medium uppercase">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-bounce" />
          <span>Birthday Surprise</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Spotify Player Toggle Button */}
          <button
            onClick={() => setShowSpotify(!showSpotify)}
            title="Music Player"
            className="flex items-center gap-1 text-[11px] font-semibold text-pink-700 bg-pink-100/90 hover:bg-pink-200 border border-pink-200 px-2.5 py-1 rounded-full shadow-sm transition-all"
          >
            <Disc3 className="w-3.5 h-3.5 animate-spin text-pink-600" />
            <span>Music</span>
          </button>
          <span className="text-[11px] font-semibold text-stone-400 bg-white/70 backdrop-blur px-2.5 py-1 rounded-full border border-stone-200 shadow-sm">
            Step {currentStep} / 8
          </span>
        </div>
      </header>

      {/* Floating Spotify Player */}
      {showSpotify && (
        <div className="w-full max-w-md px-4 mt-2 z-20 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-pink-100 flex flex-col gap-1">
            <div className="flex items-center justify-between px-2 text-[10px] text-stone-400 font-medium">
              <span className="flex items-center gap-1">
                <Music className="w-3 h-3 text-pink-500" /> Playing Madam Ji's Song
              </span>
              <button 
                onClick={() => setShowSpotify(false)} 
                className="hover:text-stone-700 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <iframe 
              style={{ borderRadius: "12px" }} 
              src="https://open.spotify.com/embed/track/0uROb6x5IunKokDggpmwKz?utm_source=generator&theme=0" 
              width="100%" 
              height="80" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Spotify Birthday Track"
            />
          </div>
        </div>
      )}

      {/* Main Dynamic Viewport */}
      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center px-4 py-6 z-10">

        {/* SCREEN 1: THE ENVELOPE */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <span className="text-pink-500 text-sm font-medium tracking-wide flex items-center gap-1 mb-1 animate-pulse">
              a little something ✨
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight mb-1">
              There's something for you
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mb-6 max-w-xs">
              A tiny birthday surprise, made just for you.
            </p>

            <div className="relative w-72 h-64 flex items-center justify-center my-2">
              <div 
                className={`absolute w-56 bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center border border-pink-100 transition-all duration-1000 ease-out z-10 ${
                  envelopeOpened ? "-translate-y-24 scale-105 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
                }`}
              >
                <div className="text-[10px] uppercase font-semibold text-pink-400 tracking-widest">For</div>
                <div className="text-2xl font-serif font-bold text-pink-600 my-0.5">
                  Madam Ji 🌸
                </div>
                <div className="text-xs text-stone-400 flex items-center gap-1">
                  <span>Special Delivery</span> • <span>6 Nov</span>
                </div>
                <div className="text-3xl mt-2 animate-bounce">🧸🎀🐰</div>
              </div>

              <div 
                onClick={handleEnvelopeClick}
                className="group cursor-pointer relative w-64 h-48 bg-gradient-to-br from-[#f8eee4] to-[#edd9c7] rounded-3xl shadow-2xl border-2 border-[#e3ceba] flex flex-col items-center justify-center p-4 transition-transform duration-300 hover:scale-[1.02] z-20"
              >
                <div className="text-3xl mb-1 filter drop-shadow-md group-hover:scale-110 transition-transform">
                  🌾🌸💐
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 border-2 border-rose-200/80 shadow-md flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-all">
                  <Heart className="w-7 h-7 fill-white text-white drop-shadow" />
                </div>
                <div className="absolute -bottom-2 text-pink-400/80 text-xl">🎀</div>
              </div>
            </div>

            <div className="mt-6 w-full max-w-xs">
              <button
                onClick={handleEnvelopeClick}
                disabled={envelopeOpened}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Heart className="w-4 h-4 fill-white text-white group-hover:animate-ping" />
                <span>{envelopeOpened ? "Opening surprise..." : "Open your surprise ✨"}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: DARK ROOM */}
        {currentStep === 2 && (
          <div className={`w-full max-w-md h-[540px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-between p-8 text-center transition-all duration-1000 ${
            lightsOn ? "bg-amber-50" : "bg-gradient-to-b from-[#0f1123] via-[#161a33] to-[#0d0f1f] text-slate-100"
          }`}>
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-amber-200 animate-pulse text-[10px]"
                  style={{
                    top: `${(i * 17) % 85}%`,
                    left: `${(i * 23) % 90}%`,
                    animationDuration: `${1.5 + (i % 4)}s`
                  }}
                >
                  ✦
                </div>
              ))}
              <div className="absolute top-10 right-10 text-3xl opacity-80 animate-pulse">
                🌙
              </div>
            </div>

            {lightsOn && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 via-yellow-100/30 to-transparent pointer-events-none animate-fade-in" />
            )}

            <div className="mt-8 z-10">
              <span className="text-amber-300 font-serif italic text-lg tracking-wider block mb-2">
                Shhh...
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                The room is waiting for you.
              </h2>
              <p className="text-slate-300/80 text-xs sm:text-sm mt-2 max-w-xs mx-auto">
                Someone left the lights off on purpose.
              </p>
            </div>

            <div className="z-10 flex flex-col items-center my-auto">
              <div className="relative">
                <span className="text-7xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] animate-pulse inline-block">
                  🧸
                </span>
                <span className="absolute -top-3 -right-2 text-2xl rotate-12">
                  💤
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono tracking-wider">
                sleeping gently...
              </p>
            </div>

            <div className="w-full max-w-xs z-10 mb-2">
              <button
                onClick={handleTurnLightsOn}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 text-stone-900 font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-400/60 active:scale-95 transition-all flex items-center justify-center gap-2 border border-amber-200"
              >
                <Lightbulb className="w-4 h-4 text-stone-900 fill-stone-900 animate-bounce" />
                <span>Turn on the lights 💡</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: SURPRISE PARTY REVEAL */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <div className="text-3xl mb-1 tracking-widest animate-bounce">
              🎊 🎈 🎉 🎈 🎊
            </div>
            <p className="text-stone-400 text-xs font-serif italic mb-1">
              Look who's having a birthday...
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-800 tracking-tight">
              Happy Birthday, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                Madam Ji ✨
              </span>
            </h1>

            <div className="my-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-bold shadow-sm">
              <span>🗓️</span>
              <span>6 November</span>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-52 h-52 bg-gradient-to-b from-pink-100 to-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative overflow-hidden">
                <span className="text-7xl filter drop-shadow-md">
                  🧸
                </span>
                <div className="flex gap-2 text-2xl -mt-2 absolute bottom-5">
                  <span>🍰</span>
                  <span>🎁</span>
                  <span>💐</span>
                </div>
              </div>
            </div>

            <p className="text-rose-400 text-xs font-serif italic mb-6">
              yay, you're here! The whole world is celebrating you today.
            </p>

            <div className="w-full max-w-xs">
              <button
                onClick={() => {
                  playChime(580, "triangle", 0.3);
                  setCurrentStep(4);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>There's more ✨</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: CAKE CUTTING */}
        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <span className="text-pink-500 text-xs font-bold uppercase tracking-wider mb-1">
              Cake time
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
              {cakeCut ? "You did it! 🎉" : "Make the first cut ✨"}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 mb-4 max-w-xs">
              {cakeCut 
                ? "The first slice is always the sweetest one." 
                : "Tap or slice down across the cake, top to bottom."
              }
            </p>

            <div 
              onClick={handleCakeSlice}
              className={`relative cursor-pointer w-64 h-64 bg-white/60 backdrop-blur rounded-3xl border border-pink-100 shadow-xl flex flex-col items-center justify-center p-4 transition-all my-2 select-none ${
                isCutting ? "scale-95" : "hover:shadow-2xl"
              }`}
            >
              <div className="flex gap-4 mb-1 z-10">
                {[1, 2, 3].map(candle => (
                  <div key={candle} className="flex flex-col items-center">
                    <div className="w-2 h-3 bg-gradient-to-t from-orange-400 to-yellow-200 rounded-full animate-ping opacity-90 shadow-[0_0_8px_gold]" />
                    <div className="w-1.5 h-6 bg-pink-300 rounded-t-sm border-b border-pink-400" />
                  </div>
                ))}
              </div>

              <div className="relative flex items-center justify-center">
                {cakeCut ? (
                  <div className="flex items-center gap-5 transition-all duration-700 ease-out">
                    <div className="flex flex-col items-end transform -rotate-3 transition-transform">
                      <div className="w-16 h-8 bg-rose-300 rounded-tl-xl border-l-2 border-t-2 border-rose-200 flex items-center justify-end pr-1 text-xs">🍓</div>
                      <div className="w-20 h-10 bg-pink-200 rounded-tl-xl border-l-2 border-pink-100 flex items-center justify-end pr-1 text-[10px]">✨</div>
                      <div className="w-24 h-12 bg-rose-400 rounded-tl-2xl border-l-2 border-b-2 border-rose-300 flex items-center justify-end pr-2 text-sm">🍰</div>
                    </div>
                    <div className="h-28 w-0.5 bg-gradient-to-b from-amber-300 to-transparent animate-pulse" />
                    <div className="flex flex-col items-start transform rotate-3 transition-transform">
                      <div className="w-16 h-8 bg-rose-300 rounded-tr-xl border-r-2 border-t-2 border-rose-200 flex items-center justify-start pl-1 text-xs">🍓</div>
                      <div className="w-20 h-10 bg-pink-200 rounded-tr-xl border-r-2 border-pink-100 flex items-center justify-start pl-1 text-[10px]">✨</div>
                      <div className="w-24 h-12 bg-rose-400 rounded-tr-2xl border-r-2 border-b-2 border-rose-300 flex items-center justify-start pl-2 text-sm">🍰</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center group">
                    <div className="absolute inset-y-0 w-0.5 border-r-2 border-dashed border-rose-400/80 z-20 pointer-events-none group-hover:opacity-100 transition-opacity" />
                    <div className="w-32 h-9 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-t-2xl shadow-inner border border-rose-200 flex items-center justify-around px-2">
                      <span>🍓</span>
                      <span>🍒</span>
                      <span>🍓</span>
                    </div>
                    <div className="w-40 h-11 bg-gradient-to-r from-pink-200 via-white to-pink-200 shadow-inner border border-pink-200 flex items-center justify-around px-3">
                      <span>🍬</span>
                      <span>🌸</span>
                      <span>🍬</span>
                    </div>
                    <div className="w-48 h-14 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 rounded-b-2xl shadow-md border border-rose-300 flex items-center justify-around px-4">
                      <span>🧁</span>
                      <span>🎀</span>
                      <span>🧁</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-56 h-3 bg-stone-200/90 rounded-full mt-1 border border-stone-300 shadow-sm" />
              {!cakeCut && (
                <div className="absolute bottom-3 text-xs text-pink-500 font-medium flex items-center gap-1 animate-pulse">
                  <span>🔪 Tap anywhere to slice</span>
                </div>
              )}
            </div>

            <div className="mt-5 w-full max-w-xs">
              {cakeCut ? (
                <button
                  onClick={() => {
                    playChime(650, "sine", 0.4);
                    setCurrentStep(5);
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group animate-bounce"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Make a wish 🪄</span>
                </button>
              ) : (
                <button
                  onClick={handleCakeSlice}
                  className="w-full py-3.5 px-6 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Click here to Cut Cake 🔪</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 5: MAKE A WISH */}
        {currentStep === 5 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <div className="relative my-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-amber-100 via-pink-100 to-rose-50 flex items-center justify-center shadow-lg border border-pink-200">
                <span className="text-6xl filter drop-shadow animate-pulse">
                  🧸🙏✨
                </span>
              </div>
              <div className="flex gap-2 text-xl mt-2 animate-bounce">
                <span>🎂</span>
                <span>⭐</span>
                <span>💖</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 mt-2">
              {wishMade ? "Your wish is on its way ✨" : "Close your eyes..."}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 mb-6 max-w-xs">
              {wishMade 
                ? "Somewhere, a tiny star just said yes." 
                : "Make a little wish for the year ahead."
              }
            </p>

            <div className="w-full max-w-xs">
              <button
                onClick={handleMakeWish}
                disabled={wishMade}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Star className="w-4 h-4 fill-white text-white group-hover:rotate-45 transition-transform" />
                <span>{wishMade ? "Sending wish to stars..." : "I made my wish ✨"}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: POLAROID MEMORY GALLERY WITH REAL HOSTED PHOTOS */}
        {currentStep === 6 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 tracking-tight">
              Some moments are worth keeping forever.
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 mb-4 max-w-xs">
              Here's to all the laughs, chaos, late-night talks and little moments.
            </p>

            {/* Helper tip banner */}
            <div className="text-[11px] text-pink-700 bg-pink-50/90 border border-pink-200 rounded-full px-3.5 py-1 mb-3.5 flex items-center gap-1.5 shadow-sm">
              <Camera className="w-3.5 h-3.5 text-pink-500" />
              <span>Tap any photo to view full size!</span>
            </div>

            {/* 4 Aesthetic Polaroids Grid with Real Photos */}
            <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm px-2 mb-4">
              {polaroids.map((item) => {
                const currentImgUrl = item.userPhoto || item.imageSrc;
                return (
                  <div
                    key={item.id}
                    className={`bg-white p-2.5 pb-2.5 rounded-2xl shadow-md hover:shadow-xl transition-all border border-stone-200/90 flex flex-col items-center group relative cursor-pointer ${item.rotation}`}
                    onClick={() => setActiveZoomPhoto(item)}
                  >
                    {/* Polaroid Pin / Tape aesthetic */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-amber-200/60 backdrop-blur-xs rounded-xs border-b border-amber-300/40 rotate-1 z-20 pointer-events-none" />

                    {/* Photo frame */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-stone-100 flex items-center justify-center border border-stone-100 shadow-inner">
                      <img
                        src={currentImgUrl}
                        alt={item.caption}
                        loading="eager"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Fallback to direct page embed resolver if CDN hotlink blocks
                          if (e.target.src !== item.pageUrl) {
                            e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(item.imageSrc)}`;
                          }
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Zoom Indicator */}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-2 text-stone-800 font-serif italic text-xs tracking-tight text-center font-medium">
                      {item.caption}
                    </div>

                    {/* Optional Replace / Upload Button */}
                    <div className="mt-1.5 w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      <label 
                        htmlFor={`photo-upload-${item.id}`}
                        className="w-full flex items-center justify-center gap-1 bg-pink-50/70 hover:bg-pink-100 text-pink-700 border border-pink-200/60 rounded-lg py-1 px-2 text-[10px] font-semibold cursor-pointer active:scale-95 transition-all shadow-xs"
                      >
                        <Upload className="w-3 h-3 text-pink-500" />
                        <span>Change Photo</span>
                        <input
                          id={`photo-upload-${item.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, item.id)}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read Letter Button */}
            <div className="w-full max-w-xs mt-2">
              <button
                onClick={() => {
                  playChime(620, "sine", 0.4);
                  setCurrentStep(7);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Mail className="w-4 h-4" />
                <span>Read your letter 💌</span>
              </button>
            </div>
          </div>
        )}

        {/* FULL PHOTO ZOOM MODAL */}
        {activeZoomPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
            onClick={() => setActiveZoomPhoto(null)}
          >
            <div 
              className="bg-white p-3 pb-4 rounded-3xl max-w-xs w-full shadow-2xl flex flex-col items-center relative animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveZoomPhoto(null)}
                className="absolute top-2 right-2 bg-stone-100 hover:bg-stone-200 text-stone-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow transition-all"
              >
                ✕
              </button>
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner mt-4 bg-stone-100">
                <img
                  src={activeZoomPhoto.userPhoto || activeZoomPhoto.imageSrc}
                  alt={activeZoomPhoto.caption}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="mt-3 font-serif font-bold text-stone-800 text-base">
                {activeZoomPhoto.caption}
              </p>
              <p className="text-pink-600 text-xs font-medium">
                {activeZoomPhoto.tag}
              </p>
            </div>
          </div>
        )}

        {/* SCREEN 7: THE HEARTFELT LETTER */}
        {currentStep === 7 && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="w-full max-w-sm bg-[#fffaf5] border border-[#f0dfce] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-left mb-6">
              <div className="border-b border-pink-100 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-pink-400 tracking-widest block">
                    a letter, just for you
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-800">
                    For you, Madam Ji 🌸
                  </h3>
                </div>
                <div className="text-2xl">💌</div>
              </div>

              <div className="space-y-3.5 text-stone-700 font-serif text-xs sm:text-[13px] leading-relaxed">
                <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-pink-600 first-letter:mr-0.5">
                  Happy birthday, you wonderful cutie.
                </p>
                <p>
                  I wanted to make something that felt a little like you — warm, a bit silly, and full of tiny surprises. So here it is: a small corner of the internet that exists only because you do.
                </p>
                <p>
                  Thank you for every late-night talk, every ridiculous inside joke, every time you showed up without being asked. You make ordinary days feel like something worth remembering.
                </p>
                <p>
                  This year, I hope you get the slow mornings, the loud laughs, the good news you've been waiting for, and at least one perfect slice of cake.
                </p>
                <p>
                  Whatever you've wished for back there — I hope it finds you soon. And if it takes a little while, I'll be right here, cheering the loudest.
                </p>
                <p className="pt-1 font-semibold text-pink-600">
                  Happy birthday. Today is all yours.
                </p>
                <div className="pt-2 text-right text-stone-500 font-serif italic text-xs">
                  — Someone Special 💕
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs">
              <button
                onClick={() => {
                  playConfettiMelody();
                  setCurrentStep(8);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>One last thing ✨</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 8: GRAND FINALE */}
        {currentStep === 8 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <div className="flex gap-2 text-2xl mb-2 animate-bounce">
              <span>🎉</span>
              <span>🎂</span>
              <span>✨</span>
              <span>🎈</span>
              <span>💖</span>
            </div>

            <div className="relative my-4 flex flex-col items-center">
              <div className="text-5xl animate-bounce filter drop-shadow mb-1" style={{ animationDuration: "2s" }}>
                🎈
              </div>
              <div className="w-0.5 h-6 bg-stone-300 -mt-2 mb-0.5" />
              <div className="w-40 h-40 rounded-full bg-pink-100 flex items-center justify-center border-4 border-white shadow-xl relative">
                <span className="text-7xl filter drop-shadow">
                  🧸
                </span>
                <span className="absolute bottom-1 right-2 text-3xl animate-pulse">
                  💐
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-800 tracking-tight">
              Happy Birthday, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                Madam Ji! 🎂✨
              </span>
            </h1>

            <p className="text-stone-600 text-xs sm:text-sm mt-3 mb-1 max-w-xs leading-relaxed font-serif">
              May this year bring you countless little reasons to smile.
            </p>

            <p className="text-pink-500 text-xs font-serif italic mb-6">
              — with love, Someone Special 💝
            </p>

            <div className="w-full max-w-xs space-y-2">
              <button
                onClick={resetAll}
                className="w-full py-3.5 px-6 rounded-full bg-white border border-pink-200 text-pink-600 font-semibold text-sm shadow-md hover:bg-pink-50 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Replay the surprise ↺</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-md py-4 px-6 text-center text-[11px] text-stone-400 z-10 flex items-center justify-center gap-1">
        <span>Crafted with</span>
        <Heart className="w-3 h-3 fill-pink-500 text-pink-500 inline" />
        <span>for Madam Ji's special day</span>
      </footer>

    </div>
  );
}a