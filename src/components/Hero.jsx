'use client';

import Link from 'next/link';
import { Reveal, RevealRotate } from './animations/Reveal';

export default function Hero() {
    return (
        <section className="relative min-h-[80vh] md:min-h-screen flex items-center pt-16 md:pt-20">
            <div className="container flex flex-col md:flex-row justify-center items-center mx-auto px-6 py-12 md:py-20 gap-8 md:gap-12">
                <div className="max-w-2xl text-center md:text-left">
                    <Reveal>
                        <div className="w-fit bg-brand-primary/10 border border-brand-primary/20 px-4 flex items-center justify-center py-1 rounded-full mb-6 md:mb-8 mx-auto md:ml-0">
                            <span className="text-brand-primary font-black text-[10px] tracking-[0.2em] uppercase">
                                Tu Estudio de Grabación en Madrid
                            </span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 md:mb-8">
                            Dale calidad a tu<br />
                            <span className="italic text-brand-primary">SONIDO.</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="text-sm md:text-md opacity-90 mb-8 md:mb-12 max-w-xl mx-auto md:ml-0 leading-relaxed font-bold text-white/90">
                            Espacios de sonido premium y equipos de clase mundial para mezcla, masterización
                            y grabación de alta fidelidad en el corazón de España.
                        </p>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
                            <Link href="/reservar" className="bg-brand-primary text-white px-8 md:px-10 py-4 rounded-md font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/25 text-center">
                                EMPIEZA TU PROYECTO
                            </Link>
                            <a href="#services" className="bg-studio-card border border-brand-primary/20 text-brand-primary px-8 md:px-10 py-4 rounded-md font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-brand-primary/5 transition-all text-center">
                                NUESTROS SERVICIOS
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
            <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 opacity-60">
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase text-white">Descubre</span>
                <div className="w-px h-12 md:h-20 bg-gradient-to-b from-brand-primary to-transparent shadow-[0_0_10px_rgba(153,74,112,0.5)]" />
            </div>
        </section>
    );
}
