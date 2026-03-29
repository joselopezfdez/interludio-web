'use client';

import { useEffect, useState } from 'react';

export default function SciFiLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING...');

  const messages = [
    'INITIALIZING SYSTEM...',
    'CONNECTING TO CORE...',
    'DECRYPTING ASSETS...',
    'SYNCING DATA...',
    'ACCESS GRANTED.',
    'REDIRECTING...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    const messageTimer = setInterval(() => {
      setStatus(messages[Math.floor(Math.random() * messages.length)]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono selection:bg-brand-primary overflow-hidden">
      {/* Background Matrix/Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />
      
      {/* Flicker scanline */}
      <div className="absolute inset-0 pointer-events-none z-10 animate-scanline bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent h-20 w-full" />

      <div className="relative z-20 flex flex-col items-center max-w-sm w-full px-6">
        <div className="w-24 h-24 mb-12 relative">
          <svg className="w-full h-full text-brand-primary animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" className="opacity-40" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black text-white">{Math.floor(progress)}%</span>
          </div>
        </div>

        <div className="w-full h-1 bg-white/5 relative overflow-hidden mb-6">
          <div 
            className="h-full bg-brand-primary shadow-[0_0_15px_#994a70] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-brand-primary font-black tracking-[0.4em] uppercase animate-pulse">{status}</span>
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${progress > (i + 1) * 20 ? 'bg-brand-primary animate-glow' : 'bg-white/10'}`} 
                    />
                ))}
            </div>
        </div>
      </div>
      
      {/* Technical data corners */}
      <div className="absolute top-10 left-10 text-[8px] text-white/20 font-bold uppercase tracking-widest hidden md:block">
        <p>System: Interludio_Core_v4.0.1</p>
        <p>Location: Madrid_Mainframe</p>
      </div>
      <div className="absolute bottom-10 right-10 text-[8px] text-white/20 font-bold uppercase tracking-widest text-right hidden md:block">
        <p>Status: Authorized_Connection</p>
        <p>Packets: Received_Verified</p>
      </div>
    </div>
  );
}
