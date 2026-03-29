'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/presets/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PresetCard from '@/components/presets/PresetCard';
import CartDrawer from '@/components/presets/CartDrawer';
import { Reveal } from '@/components/animations/Reveal';

export default function PresetsPage() {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isCartOpen, setIsCartOpen, cart } = useCart();

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const res = await fetch('/api/presets');
                if (res.ok) {
                    const data = await res.json();
                    setPresets(data);
                }
            } catch (err) {
                console.error('Failed to fetch presets', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPresets();
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-white font-sans selection:bg-brand-primary selection:text-white">
            <Navbar />
            
            <main className="container mx-auto px-6 pt-32 pb-20">
                <header className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <Reveal>
                            <div className="w-fit bg-brand-primary/10 border border-brand-primary/20 px-4 flex items-center justify-center py-1 rounded-full mb-6 mx-auto md:ml-0">
                                <span className="text-brand-primary font-black text-[10px] tracking-[0.2em] uppercase">
                                    Store Premium
                                </span>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
                                PRESETS <br />
                                <span className="italic text-brand-primary">PROFESIONALES.</span>
                            </h1>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                                Lleva tus producciones al siguiente nivel con nuestra colección exclusiva de presets diseñados por ingenieros de Interludio.
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.3}>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white/5 border border-white/10 hover:border-brand-primary/50 p-4 rounded-2xl transition-all group active:scale-95 shadow-xl shadow-black/20"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">Carrito</span>
                                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white text-brand-primary w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-xl animate-bounce">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </Reveal>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : presets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {presets.map((preset, i) => (
                            <Reveal key={preset.id} delay={i * 0.1}>
                                <PresetCard preset={preset} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <Reveal>
                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                            <p className="text-white/40 font-bold uppercase tracking-widest">No hay presets disponibles actualmente.</p>
                        </div>
                    </Reveal>
                )}
            </main>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Footer />
        </div>
    );
}
