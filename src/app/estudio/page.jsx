'use client';

import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/animations/Reveal';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

const courseModules = [
    {
        title: "Fundamentos de Producción",
        description: "Aprende los conceptos básicos de la cadena de señal, ganancia y flujo de trabajo en el estudio.",
        duration: "15 min",
        thumbnail: "/studio1.jpg",
    },
    {
        title: "Mezcla Profesional",
        description: "Técnicas avanzadas de EQ, compresión y efectos espaciales para lograr un sonido comercial.",
        duration: "25 min",
        thumbnail: "/studio2.jpg",
    },
    {
        title: "Mastering Final",
        description: "Cómo preparar tu track para su distribución en plataformas digitales y vinilo.",
        duration: "20 min",
        thumbnail: "/studio3.jpg",
    }
];

const pricingPlans = [
    {
        name: "Básico",
        price: "0€",
        priceAmount: 0,
        interval: "month",
        period: "/mes",
        features: ["Acceso a 5 cursos", "Material descargable", "Comunidad Discord", "Soporte básico"],
        buttonText: "EMPEZAR YA",
        highlight: false
    },
    {
        name: "Pro",
        price: "0€",
        priceAmount: 0,
        interval: "month",
        period: "/mes",
        features: ["Todos los cursos", "Feedback de demos", "Masterclasses en vivo", "Soporte prioritario", "Samples exclusivos"],
        buttonText: "SER PRO",
        highlight: true
    },
    {
        name: "Elite",
        price: "0€",
        priceAmount: 0,
        interval: "one_time",
        period: "/pago único",
        features: ["Acceso de por vida", "Sesión 1 a 1 (1h)", "Revisión de proyecto DAW", "Certificado de estudio"],
        buttonText: "ACCESO ELITE",
        highlight: false
    }
];

export default function EstudioPage() {
    const { data: session } = authClient.useSession();
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleCheckout = async (plan) => {
        if (!session) {
            alert('Por favor, inicia sesión para suscribirte.');
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planName: plan.name,
                    priceAmount: plan.priceAmount,
                    interval: plan.interval,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error('Error starting checkout:', err);
            alert('Error al iniciar el pago. Revisa la consola.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const isSubscribed = session?.user?.role === 'alumno' || session?.user?.isAdmin;

    return (
        <main className="min-h-screen bg-transparent selection:bg-brand-primary selection:text-white pb-20">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center">
                        <Reveal>
                            <div className="w-fit bg-brand-primary border border-brand-primary/20 px-6 py-2 rounded-full mb-8">
                                <span className="text-white/50 font-black text-xs tracking-[0.3em] uppercase">Interludio Academy</span>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                                DOMINA LA <br />
                                <span className="text-brand-secondary italic">PRODUCCIÓN</span> MUSICAL
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="max-w-2xl text-lg md:text-xl opacity-80 leading-relaxed mb-12 font-medium text-white">
                                Aprende de profesionales activos en la industria. Cursos diseñados para llevar tus producciones al siguiente nivel con técnicas reales de estudio.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {isSubscribed ? (
                                    <Link href="/estudio/privado" className="bg-white text-brand-primary px-10 py-4 rounded-full text-base font-black hover:bg-brand-secondary hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                                        Entrar al Estudio
                                    </Link>
                                ) : (
                                    <a href="#pricing" className="bg-brand-primary text-white px-10 py-4 rounded-full text-base font-black hover:bg-brand-secondary transition-all shadow-[0_0_30px_rgba(153,74,112,0.3)] hover:scale-105 active:scale-95 uppercase tracking-widest">
                                        Ver Suscripciones
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 -right-24 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none" />
            </section>

            {/* Presentation Section */}
            <section className="py-24 bg-white/5 backdrop-blur-sm border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <Reveal>
                            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                                <img src="/studio1.jpg" alt="Estudio de producción" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white font-black text-xl italic tracking-tight">"La técnica es el medio, la emoción es el fin."</p>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">UN ENFOQUE <span className="text-brand-secondary">REAL</span></h2>
                                <p className="opacity-70 text-lg mb-8 leading-relaxed text-white">
                                    No te enseñamos a usar un programa, te enseñamos a hacer música. Nuestro método se basa en la escucha crítica y la resolución de problemas creativos que surgen en sesiones reales.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                        <h4 className="text-brand-secondary font-black text-3xl mb-1">+50h</h4>
                                        <p className="text-[10px] font-black tracking-widest uppercase opacity-60 text-white">Contenido HD</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                        <h4 className="text-brand-secondary font-black text-3xl mb-1">24/7</h4>
                                        <p className="text-[10px] font-black tracking-widest uppercase opacity-60 text-white">Acceso Ilimitado</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Course Preview Section */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <Reveal>
                        <div className="mb-20 text-center md:text-left">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                                Explora las <span className="text-brand-secondary italic">Lecciones</span>
                            </h2>
                            <p className="opacity-60 max-w-lg font-medium text-white">
                                Visualiza una pequeña parte de lo que aprenderás dentro de nuestra plataforma.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {courseModules.map((module, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="group bg-brand-secondary/5 border border-white/10 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(153,74,112,0.15)]">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 mb-3 shadow-2xl">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">Contenido Premium</span>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/50 text-[10px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                                            {module.duration}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-brand-secondary transition-colors uppercase tracking-tight text-white">{module.title}</h3>
                                        <p className="text-sm opacity-60 leading-relaxed mb-6 font-medium text-white">
                                            {module.description}
                                        </p>
                                        <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors">
                                            Ver Detalles
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 relative">
                <div className="container mx-auto px-6">
                    <Reveal>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
                                PLANES DE <span className="text-brand-secondary italic">ESTUDIO</span>
                            </h2>
                            <p className="opacity-60 max-w-xl mx-auto font-medium text-lg text-white">
                                Elige el plan que mejor se adapte a tu ritmo de aprendizaje y objetivos musicales.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                        {pricingPlans.map((plan, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className={`relative p-1 rounded-[2.5rem] transition-all duration-500 ${plan.highlight ? 'bg-gradient-to-b from-brand-secondary to-brand-primary scale-105 shadow-[0_30px_60px_rgba(255,79,162,0.25)]' : 'bg-white/10 hover:bg-white/20'}`}>
                                    <div className="bg-[#1a1a1a] rounded-[2.4rem] p-10 h-full flex flex-col">
                                        <div className="mb-8">
                                            <h3 className="text-brand-secondary font-black text-sm tracking-[0.3em] uppercase mb-4">{plan.name}</h3>
                                            <div className="flex items-end gap-1">
                                                <span className="text-5xl font-black tracking-tighter text-white">{plan.price}</span>
                                                <span className="text-white/40 font-bold mb-1">{plan.period}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-5 mb-12 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-4 text-sm font-medium text-white">
                                                    <svg className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="opacity-80">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {isSubscribed ? (
                                            <Link
                                                href="/estudio/privado"
                                                className={`w-full py-4 rounded-2xl font-black text-center transition-all uppercase tracking-widest text-xs ${plan.highlight ? 'bg-brand-secondary text-white hover:bg-brand-primary shadow-lg shadow-brand-secondary/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                            >
                                                YA TIENES ACCESO
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout(plan)}
                                                disabled={loadingPlan === plan.name}
                                                className={`w-full py-4 rounded-2xl font-black text-center transition-all uppercase tracking-widest text-xs disabled:opacity-50 ${plan.highlight ? 'bg-brand-secondary text-white hover:bg-brand-primary shadow-lg shadow-brand-secondary/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                            >
                                                {loadingPlan === plan.name ? 'CARGANDO...' : plan.buttonText}
                                            </button>
                                        )}
                                    </div>

                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap tracking-widest uppercase">
                                            RECOMENDADO
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <Contact />
            <Footer />
        </main>
    );
}
