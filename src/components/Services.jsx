'use client';

import { Reveal } from './animations/Reveal';

const services = [
    {
        title: "Grabación",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
                <line x1="8" y1="22" x2="16" y2="22"></line>
            </svg>
        ),
        items: ["Multi-pista", "Afinación vocal", "Asesoramiento"]
    },
    {
        title: "Mezcla",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
        ),
        items: ["Mezcla Analógica", "Stem Mixing", "Dolby Atmos Ready"]
    },
    {
        title: "Mastering",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
        ),
        items: ["Mastering Digital", "Pre-Mastering Vinilo", "Optimización de Loudness"]
    }
];

export default function Services() {
    return (
        <section id="services" className="py-16 md:py-32 bg-transparent">
            <div className="container mx-auto px-6">
                <div className="flex flex-col justify-between items-center md:items-start mb-12 md:mb-20 gap-8 md:gap-10 text-center md:text-left">
                    <Reveal>
                        <div>
                            <div className="w-fit bg-brand-primary/50 border border-brand-primary/20 px-4 flex items-center justify-center py-1 rounded-full mb-4 mx-auto md:ml-0">
                                <span className="text-brand-secondary font-black text-[10px] tracking-[0.4em] uppercase">Excelencia en Producción</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-studio-text">Servicios de <span className="text-brand-secondary italic">Estudio</span></h2>
                        </div>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="max-w-md opacity-80 text-sm leading-relaxed font-bold text-white">
                            Desde la grabación hasta la post-producción, ofrecemos a artistas y sellos el entorno perfecto para la música independiente moderna.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <Reveal key={i} delay={i * 0.1}>
                            <div className="bg-brand-secondary/30 p-12 rounded-2xl border border-brand-primary/10 hover:border-brand-primary/30 transition-all group h-full shadow-lg shadow-brand-primary/5">
                                <div className="mb-8">{service.icon}</div>
                                <h3 className="text-2xl font-bold mb-6 text-studio-text">{service.title}</h3>
                                <p className="opacity-70 text-[13px] leading-relaxed mb-8 font-medium">
                                    Solución profesional para tus necesidades sónicas, garantizando claridad y potencia.
                                </p>
                                <ul className="space-y-4">
                                    {service.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-[10px] font-black tracking-widest text-white uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
