'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SciFiLoader from '@/components/SciFiLoader';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [targetPath, setTargetPath] = useState('');
  const router = useRouter();

  const handleNavigation = (e, path) => {
    e.preventDefault();
    setTargetPath(path);
    setLoading(true);
  };

  const handleLoadComplete = () => {
    router.push(targetPath);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-end pb-16 md:pb-24 overflow-hidden bg-black">
      {loading && <SciFiLoader onComplete={handleLoadComplete} />}
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src="/capsulas.mp4" type="video/mp4" />
        </video>
        {/* Subtle Sci-fi overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-40" />
      </div>

      {/* Sci-fi Bottom Content */}
      <div className="relative z-10 w-full px-6 md:px-20 max-w-7xl mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-[15vw]">
          <Link 
            href="/estudio" 
            onClick={(e) => handleNavigation(e, '/estudio')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute -top-4 w-8 h-[1px] bg-brand-primary opacity-0 group-hover:opacity-100 group-hover:scale-x-150 transition-all duration-500 shadow-[0_0_15px_#994a70]" />
            <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-white group-hover:text-brand-primary transition-all duration-500 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_#994a70]">
              ESTUDIO
            </span>
            <span className="mt-2 text-[8px] font-bold text-white/20 tracking-[0.5em] group-hover:text-brand-primary/40 transition-colors uppercase">Data.Link_01</span>
          </Link>

          <Link 
            href="/servicios" 
            onClick={(e) => handleNavigation(e, '/servicios')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute -top-4 w-8 h-[1px] bg-brand-primary opacity-0 group-hover:opacity-100 group-hover:scale-x-150 transition-all duration-500 shadow-[0_0_15px_#994a70]" />
            <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-white group-hover:text-brand-primary transition-all duration-500 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_#994a70]">
              SERVICIOS
            </span>
            <span className="mt-2 text-[8px] font-bold text-white/20 tracking-[0.5em] group-hover:text-brand-primary/40 transition-colors uppercase">Core.Access_02</span>
          </Link>

          <Link 
            href="/presets" 
            onClick={(e) => handleNavigation(e, '/presets')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute -top-4 w-8 h-[1px] bg-brand-primary opacity-0 group-hover:opacity-100 group-hover:scale-x-150 transition-all duration-500 shadow-[0_0_15px_#994a70]" />
            <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-white group-hover:text-brand-primary transition-all duration-500 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_#994a70]">
              PRESETS
            </span>
            <span className="mt-2 text-[8px] font-bold text-white/20 tracking-[0.5em] group-hover:text-brand-primary/40 transition-colors uppercase">Asset.Store_03</span>
          </Link>
        </div>
      </div>

      {/* Floating Logo - Scientific Aesthetic */}
      <div className="absolute top-12 left-12 z-20">
        <Link href="/" className="block group">
          <img src="/interludiologo.png" alt="Logo" className="h-20 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </main>
  );
}
