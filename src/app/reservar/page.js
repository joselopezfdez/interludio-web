'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/animations/Reveal';

export default function ReservarPage() {
    return (
        <main className="min-h-screen bg-transparent selection:bg-brand-primary selection:text-white">
            <Navbar />

            <section className="pt-32 md:pt-40 pb-20 px-6">
                <div className="container mx-auto">
                    <Reveal>
                        <div className="mb-12 text-center md:text-left">
                            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4">
                                RESERVA TU <span className="text-brand-primary italic uppercase">SITIO.</span>
                            </h1>
                            <p className="opacity-90 max-w-lg text-sm md:text-base font-bold text-white/90">
                                Selecciona el tipo de sesión y el horario que mejor se adapte a tu proyecto. 
                                Recibirás una confirmación automática en tu email.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className=" border border-brand-primary/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative">
                            {/* Calendario Directo (Ajustado a 680px para evitar espacios vacíos) */}
                            <iframe
                                src="https://cal.com/interludio-p6dks1/reserva-tu-sesion?embed=true&theme=light"
                                style={{ width: "100%", height: "680px", border: "none" }}
                                title="Reserva Cal.com"
                                className="bg-transparent"
                            ></iframe>
                        </div>
                    </Reveal>
                </div>
            </section>

            <Footer />
        </main>
    );
}
