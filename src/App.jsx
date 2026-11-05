import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Camera,
  RotateCcw,
  X,
  Disc3,
  Moon,
  Sun
} from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);

  const [photos, setPhotos] = useState([
    {
      id: "picnic",
      title: "that sunny picnic 🧺",
      subtitle: "White SUV adventure & scenic vibes",
      url: "https://i.ibb.co/3YQgJLhB/WhatsApp-Image-2026-11-06-at-00-22-50.jpg",
      proxyUrl: "https://images.weserv.nl/?url=https://i.ibb.co/3YQgJLhB/WhatsApp-Image-2026-11-06-at-00-22-50.jpg",
      rotation: "-rotate-2"
    },
    {
      id: "stars",
      title: "counting stars ✨",
      subtitle: "Festive celebration & golden smiles",
      url: "https://i.ibb.co/C3rNJ2qg/WhatsApp-Image-2026-11-06-at-00-26-17.jpeg",
      proxyUrl: "https://images.weserv.nl/?url=https://i.ibb.co/C3rNJ2qg/WhatsApp-Image-2026-11-06-at-00-26-17.jpeg",
      rotation: "rotate-2"
    },
    {
      id: "chaos",
      title: "the sweetest chaos 🍰",
      subtitle: "Playful wink & golden hour curls",
      url: "https://i.ibb.co/3y1bKtD3/WhatsApp-Image-2026-11-06-at-00-21-29.jpg",
      proxyUrl: "https://images.weserv.nl/?url=https://i.ibb.co/3y1bKtD3/WhatsApp-Image-2026-11-06-at-00-21-29.jpg",
      rotation: "-rotate-3"
    },
    {
      id: "world",
      title: "top of the world 🎈",
      subtitle: "Pure elegance & butterfly charm",
      url: "https://i.ibb.co/M4pvGLD/WhatsApp-Image-2026-11-06-at-00-23-33.jpg",
      proxyUrl: "https://images.weserv.nl/?url=https://i.ibb.co/M4pvGLD/WhatsApp-Image-2026-11-06-at-00-23-33.jpg",
      rotation: "rotate-3"
    }
  ]);

  const fileInputRef = useRef(null);
  const [activeUploadId, setActiveUploadId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("madamji_custom_photos");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPhotos((prev) =>
          prev.map((item) => {
            const match = parsed.find((p) => p.id === item.id);
            return match && match.url ? { ...item, url: match.url, proxyUrl: match.url } : item;
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
    setTimeout(() => {
      setCurrentStep(2);
    }, 1500);
  };

  const handleTurnOnLights = () => {
    setLightsOn(true);
    setTimeout(() => {
      setCurrentStep(3);
    }, 1000);
  };

  const triggerUpload = (id, e) => {
    e.stopPropagation();
    setActiveUploadId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result;
        setPhotos((prev) => {
          const updated = prev.map((item) =>
            item.id === activeUploadId ? { ...item, url: dataUrl, proxyUrl: dataUrl } : item
          );
          try {
            localStorage.setItem("madamji_custom_photos", JSON.stringify(updated));
          } catch (err) {
            console.error(err);
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetSurprise = () => {
    setCurrentStep(1);
    setEnvelopeOpen(false);
    setLightsOn(false);
    setCakeCut(false);
    setWishMade(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-gray-800 flex flex-col items-center justify-between font-sans selection:bg-rose-200 selection:text-rose-800 overflow-x-hidden relative transition-colors duration-700">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Floating Spotify Audio Bar */}
      <div className="fixed top-3 z-50 flex flex-col items-center max-w-sm w-full px-4 transition-all">
        <div className="bg-white/95 backdrop-blur-md shadow-md border border-rose-100 rounded-full px-4 py-1.5 flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 text-rose-600">
            <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: "4s" }} />
            <span className="text-xs font-semibold tracking-wide text-rose-900">Madam Ji's Song</span>
          </div>
          <button
            type="button"
            onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200 transition font-medium"
          >
            {showMusicPlayer ? "Hide Player" : "Music 🎵"}
          </button>
        </div>

        {showMusicPlayer && (
          <div className="w-full mt-2 rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-200 transition-all duration-300">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/track/0uROb6x5IunKokDggpmwKz?utm_source=generator&theme=0"
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
            ></iframe>
          </div>
        )}
      </div>

      <main className="w-full max-w-md min-h-screen flex flex-col items-center justify-center p-6 pt-28 pb-12">
        {/* STEP 1: Envelope */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center page-transition w-full">
            <span className="text-sm font-medium tracking-widest uppercase text-rose-400 mb-2">
              A Special Delivery
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-8">
              There's something for you...
            </h1>

            <div
              onClick={handleOpenEnvelope}
              className={`relative cursor-pointer transition-all duration-700 hover:scale-105 active:scale-95 ${
                envelopeOpen ? "scale-105" : ""
              }`}
            >
              <div className="w-72 h-48 bg-[#F4E3D7] rounded-xl shadow-xl relative overflow-hidden flex items-center justify-center border border-[#e0c9ba]">
                {/* Flap */}
                <div
                  className={`absolute top-0 left-0 w-0 h-0 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent border-t-[96px] border-t-[#edd1c2] z-20 origin-top transition-transform duration-700 ${
                    envelopeOpen ? "-rotate-180 opacity-0" : ""
                  }`}
                ></div>

                {/* Seal */}
                {!envelopeOpen && (
                  <div className="absolute z-30 w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shadow-lg border-2 border-rose-400 animate-pulse">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                )}

                {/* Sliding Letter */}
                <div
                  className={`absolute w-60 h-40 bg-white rounded-lg shadow-md border border-rose-100 p-4 flex flex-col items-center justify-center transition-all duration-700 ${
                    envelopeOpen ? "-translate-y-16 shadow-2xl z-25 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-rose-400 font-semibold">Special Invite</p>
                  <h3 className="text-lg font-serif font-bold text-rose-800 mt-1">To Madam Ji ✨</h3>
                  <p className="text-[11px] text-gray-500 mt-1">Tap to open your birthday surprise!</p>
                </div>

                <div className="absolute bottom-2 text-rose-900/40 text-xs font-serif italic">
                  Tap to open
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-8">Click or tap on the envelope to open</p>
          </div>
        )}

        {/* STEP 2: Dark Room */}
        {currentStep === 2 && (
          <div
            className={`flex flex-col items-center text-center p-8 rounded-3xl w-full transition-all duration-700 ${
              lightsOn ? "bg-amber-50" : "bg-slate-900 shadow-2xl text-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className={`w-5 h-5 ${lightsOn ? "text-amber-500" : "text-amber-200 animate-pulse"}`} />
              <span className={`text-xs uppercase tracking-widest ${lightsOn ? "text-amber-700" : "text-amber-200"}`}>
                Midnight Mystery
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold mb-3">
              {lightsOn ? "The lights are turning on! ✨" : "Shhh... someone's in here"}
            </h2>
            <p className={`text-sm mb-8 ${lightsOn ? "text-amber-800" : "text-slate-300"}`}>
              {lightsOn
                ? "Here comes the surprise..."
                : "The room is waiting for you. Someone left the lights off on purpose."}
            </p>

            <div className="w-40 h-40 rounded-full flex items-center justify-center relative mb-8">
              <div className="text-7xl animate-float">
                {lightsOn ? "🧸🎉" : "🧸💤"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTurnOnLights}
              disabled={lightsOn}
              className={`px-6 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                lightsOn
                  ? "bg-amber-400 text-amber-950 font-bold scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-amber-300 hover:text-amber-200"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              Turn on the lights 💡
            </button>
          </div>
        )}

        {/* STEP 3: Reveal */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center text-center page-transition w-full">
            <div className="bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 flex items-center gap-1.5 shadow-sm border border-rose-200 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> 6 November
            </div>

            <h1 className="text-3xl font-serif font-extrabold text-rose-900 leading-tight">
              Happy Birthday, <br />
              <span className="text-rose-600 underline decoration-rose-300 decoration-wavy">Madam Ji!</span> ✨
            </h1>

            <p className="text-sm text-gray-600 mt-3 max-w-xs">
              Yay, you're here! Today is entirely all about celebrating you and your precious smile.
            </p>

            <div className="my-8 text-8xl animate-float select-none">
              🎂✨🎈
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Let's cut the cake! 🍰
            </button>
          </div>
        )}

        {/* STEP 4: Cut Cake */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center text-center w-full page-transition">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">
              Time for a treat
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Slice your birthday cake</h2>
            <p className="text-xs text-gray-500 mb-6">Tap the knife or button to cut the cake!</p>

            <div className="relative w-64 h-56 flex flex-col items-center justify-end mb-8 select-none">
              <div className="flex gap-4 mb-2 z-10">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-2.5 h-3.5 bg-amber-400 rounded-full animate-bounce shadow-md shadow-amber-300"></div>
                    <div className="w-1.5 h-6 bg-pink-400 rounded-sm"></div>
                  </div>
                ))}
              </div>

              <div className="relative w-52 flex items-center justify-center">
                <div
                  className={`w-24 h-24 bg-rose-300 border-2 border-rose-400 rounded-l-2xl shadow-md transition-all duration-700 flex items-center justify-center text-2xl ${
                    cakeCut ? "-translate-x-6 rotate-[-6deg]" : ""
                  }`}
                >
                  🍓
                </div>
                <div
                  className={`w-24 h-24 bg-rose-300 border-2 border-rose-400 rounded-r-2xl shadow-md transition-all duration-700 flex items-center justify-center text-2xl ${
                    cakeCut ? "translate-x-6 rotate-[6deg]" : ""
                  }`}
                >
                  🍰
                </div>

                <button
                  type="button"
                  onClick={() => setCakeCut(true)}
                  className={`absolute -top-12 z-20 text-4xl p-2 cursor-pointer transition-all duration-500 hover:scale-125 ${
                    cakeCut ? "translate-y-12 opacity-0 pointer-events-none" : "animate-bounce"
                  }`}
                  title="Click to cut cake"
                >
                  🔪
                </button>
              </div>

              <div className="w-60 h-3 bg-amber-100 border border-amber-300 rounded-full mt-1 shadow-sm"></div>
            </div>

            {cakeCut ? (
              <div className="flex flex-col items-center page-transition">
                <p className="text-sm font-semibold text-rose-600 mb-4">You did it! Sweet slice for Madam Ji 🎉</p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition transform hover:scale-105"
                >
                  Now, make a wish 🌟
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCakeCut(true)}
                className="bg-rose-100 text-rose-700 hover:bg-rose-200 font-semibold px-6 py-2.5 rounded-full text-xs transition border border-rose-300"
              >
                Tap knife or Click here to cut 🎂
              </button>
            )}
          </div>
        )}

        {/* STEP 5: Make a Wish */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center text-center w-full page-transition">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
              Secret Wishes
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Make a Wish, Madam Ji</h2>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">
              Close your eyes, breathe in all the happiness, and make your deepest wish for the year ahead.
            </p>

            <div
              onClick={() => setWishMade(true)}
              className={`w-44 h-44 rounded-full flex items-center justify-center text-7xl cursor-pointer transition-all duration-500 mb-8 border-4 ${
                wishMade
                  ? "bg-amber-100 border-amber-400 shadow-xl shadow-amber-200 scale-105 animate-glow"
                  : "bg-rose-50 border-dashed border-rose-300 hover:scale-105 animate-pulse"
              }`}
            >
              {wishMade ? "🌟✨" : "✨🙏"}
            </div>

            {wishMade ? (
              <div className="flex flex-col items-center page-transition">
                <p className="text-xs font-serif text-amber-700 mb-6 max-w-xs italic">
                  "Your wish is on its way. Somewhere, a tiny star just whispered yes."
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition transform hover:scale-105"
                >
                  View your special memories 📸
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setWishMade(true)}
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold px-8 py-3.5 rounded-full shadow-md shadow-amber-200 transition transform hover:scale-105"
              >
                I made my wish ✨
              </button>
            )}
          </div>
        )}

        {/* STEP 6: Polaroids */}
        {currentStep === 6 && (
          <div className="flex flex-col items-center text-center w-full page-transition">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-1">
              Little Moments
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Precious Polaroids</h2>
            <p className="text-xs text-gray-500 mb-6">Every picture tells a story of you.</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              {photos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item.url)}
                  className={`bg-white p-3 pb-4 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col items-center ${item.rotation} hover:rotate-0 hover:scale-105 relative group`}
                >
                  <div className="w-full aspect-square bg-rose-50 rounded-lg overflow-hidden border border-gray-100 relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== item.proxyUrl) {
                          target.src = item.proxyUrl;
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={(e) => triggerUpload(item.id, e)}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full shadow backdrop-blur-sm transition"
                      title="Upload custom photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[12px] font-serif font-bold text-gray-800 mt-3">{item.title}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{item.subtitle}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition transform hover:scale-105"
            >
              Read your letter 💌
            </button>
          </div>
        )}

        {/* STEP 7: Letter */}
        {currentStep === 7 && (
          <div className="flex flex-col items-center w-full page-transition">
            <div className="w-full bg-[#FFFDF9] border border-amber-200/80 rounded-2xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full opacity-40 pointer-events-none"></div>

              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold">
                  From the Heart
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Dear Madam Ji,</h2>

              <div className="text-xs text-gray-700 leading-relaxed font-serif space-y-3">
                <p>
                  Happy Birthday to the one who brings so much quiet warmth, laughter, and light into every single day.
                </p>
                <p>
                  Watching you grow, chase your dreams, and make everyone smile with that effortless grace is truly something special.
                </p>
                <p>
                  May this <strong>6 November</strong> bring you endless happiness, courage for all your ambitions, and moments that make your heart sparkle just as brightly as you do.
                </p>
                <p className="font-semibold text-rose-800 pt-2">
                  Stay as wonderful, stubborn, sweet, and genuine as you are. Always.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-100 flex justify-between items-center text-xs text-gray-400 font-serif">
                <span>With lots of love & blessings,</span>
                <span className="font-bold text-gray-700">Forever Yours</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(8)}
              className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition transform hover:scale-105"
            >
              Final message 🎈
            </button>
          </div>
        )}

        {/* STEP 8: Grand Finale */}
        {currentStep === 8 && (
          <div className="flex flex-col items-center text-center w-full page-transition">
            <div className="text-8xl animate-float mb-4">
              🎉🧸🎁
            </div>

            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Have the Happiest Year!</h1>
            <p className="text-xs text-gray-500 max-w-xs mb-8">
              May every single day be filled with endless reasons to smile. Happy Birthday once again, Madam Ji! ❤️
            </p>

            <button
              type="button"
              onClick={resetSurprise}
              className="flex items-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-full text-xs font-semibold shadow-sm transition transform hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay the surprise
            </button>
          </div>
        )}
      </main>

      {/* Lightbox Preview */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 page-transition"
        >
          <div className="relative max-w-md w-full bg-white p-2 rounded-2xl shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/90 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedPhoto}
              alt="Enlarged"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}