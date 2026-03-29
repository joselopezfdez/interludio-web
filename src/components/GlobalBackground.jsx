'use client';

import { usePathname } from 'next/navigation';

export default function GlobalBackground() {
  const pathname = usePathname();
  
  // Don't show global background on the home page (splash page)
  if (pathname === '/') return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover opacity-80"
      >
        <source src="/fondo.mp4" type="video/mp4" />
      </video>
      {/* Universal dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
  );
}
