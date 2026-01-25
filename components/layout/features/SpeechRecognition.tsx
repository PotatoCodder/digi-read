"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { IoMic, IoSquare, IoWarning } from "react-icons/io5";

const passage = `There are rocks in our Solar System that never flocked together to form planets. Larger ones called asteroids gather in the Asteroid Belt`;

export default function RealtimeReadingTracker() {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const recognitionRef = useRef<any>(null);
  
  const words = useMemo(
    () => passage.toLowerCase().replace(/[^\w\s]/g, "").split(" "),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported. Please use Chrome, Edge, or Safari.");
    }
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Real-time tracking with improved accuracy
  useEffect(() => {
    const fullText = transcript + " " + interimTranscript;
    const spokenWords = fullText
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(Boolean);

    setCurrentIndex(Math.min(spokenWords.length, words.length));

    // Enhanced accuracy calculation
    if (spokenWords.length > 0) {
      let correctWords = 0;
      let totalChecked = Math.min(spokenWords.length, words.length);
      
      for (let i = 0; i < totalChecked; i++) {
        const spoken = spokenWords[i];
        const expected = words[i];
        
        // Exact match
        if (spoken === expected) {
          correctWords++;
        } 
        // Partial match (handles pronunciation variations)
        else if (spoken.length > 2 && expected.length > 2) {
          if (spoken.includes(expected) || expected.includes(spoken)) {
            correctWords += 0.7;
          } else if (
            spoken.substring(0, 3) === expected.substring(0, 3) ||
            spoken.substring(0, 2) === expected.substring(0, 2)
          ) {
            correctWords += 0.5;
          }
        }
      }
      
      setAccuracy(Math.round((correctWords / totalChecked) * 100));
    }
  }, [transcript, interimTranscript, words]);

  // Animate progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      const progress = Math.min((currentIndex / words.length) * 100, 100);
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [currentIndex, words.length]);

  // Initialize speech recognition with optimal settings
  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    
    // Optimized settings for accuracy and mobile performance
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPiece + " ";
        } else {
          interim += transcriptPiece;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          setError("Microphone access denied. Please enable microphone permissions in your browser settings.");
          break;
        case "no-speech":
          // Don't show error for no-speech, just continue listening
          return;
        case "audio-capture":
          setError("No microphone found. Please connect a microphone and try again.");
          break;
        case "network":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError(`Error: ${event.error}. Please try again.`);
      }
      
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimTranscript("");

      // Auto-restart if stopped unexpectedly while user hasn't clicked stop
      if (recognitionRef.current) {
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Already started or stopped by user
            }
          }
        }, 100);
      }
    };

    return recognition;
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    // Request microphone permission explicitly (important for mobile)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions and try again.");
      return;
    }

    // Reset state
    setTranscript("");
    setInterimTranscript("");
    setCurrentIndex(0);
    setAccuracy(0);
    setError("");

    // Stop existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Start new recognition
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Failed to start speech recognition. Please try again.");
      }
    }
  }, [isSupported, initRecognition]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const progress = Math.min(Math.round((currentIndex / words.length) * 100), 100);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div ref={containerRef} className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Practice Reading
          </h1>
          <p className="text-base text-slate-600">
            Read the passage aloud and track your progress in real-time
          </p>
        </div>

        {/* Main Container */}
        <div className="space-y-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <IoWarning className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <p className="text-sm text-slate-500 mb-1">Words</p>
              <p className="text-2xl font-bold text-slate-900">
                {currentIndex}<span className="text-slate-400">/{words.length}</span>
              </p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="text-sm text-slate-500 mb-1">Progress</p>
              <p className="text-2xl font-bold text-sky-500">{progress}%</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="text-sm text-slate-500 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-emerald-500">{accuracy}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          {/* Reading Passage */}
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <div className="text-lg md:text-xl leading-loose text-slate-800">
              {words.map((word, i) => {
                let className = "inline-block px-1 mx-0.5 my-1 transition-colors duration-200 ";

                if (i < currentIndex) {
                  className += "text-slate-400";
                } else if (i === currentIndex) {
                  className += "text-sky-500 font-semibold";
                } else {
                  className += "text-slate-800";
                }

                return (
                  <span key={i} className={className}>
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {!listening ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={start}
                disabled={!isSupported}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <IoMic className="w-5 h-5" />
                Start Reading
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={stop}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                <IoSquare className="w-5 h-5" />
                Stop
              </motion.button>
            )}
          </div>

          {/* Live Indicator */}
          <AnimatePresence>
            {listening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-slate-500"
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-sky-500 rounded-full"
                />
                Listening...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Tips */}
          <div className="text-center text-xs text-slate-500">
            <p>💡 Speak clearly at a natural pace • Allow microphone access when prompted</p>
          </div>
        </div>
      </div>
    </section>
  );
}