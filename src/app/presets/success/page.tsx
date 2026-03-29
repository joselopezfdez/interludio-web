'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/presets/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

export default function PurchaseSuccessPage() {
    const { clearCart } = useCart();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearCart(); // Clear cart after success
        
        const fetchMyPurchases = async () => {
            try {
                const res = await fetch('/api/presets/my-purchases');
                if (res.ok) {
                    const data = await res.json();
                    setPurchases(data);
                }
            } catch (err) {
                console.error('Error fetching successes', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPurchases();
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-brand-primary">
            <Navbar />
            
            <main className="container mx-auto px-6 pt-40 pb-20">
                <div className="max-w-4xl mx-auto">
                    <Reveal>
                        <div className="bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-sm rounded-[3rem] p-8 md:p-16 mb-12 text-center shadow-2xl shadow-brand-primary/5">
                            <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-primary/40 animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Confirmación de Pago</span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-[1.1]">
                                ¡GRACIAS POR <br />
                                <span className="italic text-brand-primary">TU COMPRA!</span>
                            </h1>
                            <p className="text-white/40 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                                Tu pedido ha sido procesado correctamente. Ya puedes descargar tus productos a continuación.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 px-4">Tus Productos Adquiridos</h2>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6">
                        {loading ? (
                            <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                        ) : purchases.length > 0 ? (
                            purchases.map((preset, i) => (
                                <Reveal key={preset.id} delay={0.3 + i * 0.1}>
                                    <div className="group bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white/10 hover:border-brand-primary/40 backdrop-blur-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-black/40 rounded-2xl overflow-hidden flex-shrink-0">
                                                {preset.image ? (
                                                    <img src={preset.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
                                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">{preset.category || 'Preset'}</p>
                                                <h3 className="text-2xl font-black text-white">{preset.name}</h3>
                                            </div>
                                        </div>

                                        <a 
                                            href={`/api/presets/download/${preset.id}`}
                                            className="w-full md:w-auto bg-brand-primary text-white border border-brand-primary/20 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary hover:translate-y-[-2px] transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" />
                                            </svg>
                                            DESCARGAR AHORA
                                        </a>
                                    </div>
                                </Reveal>
                            ))
                        ) : (
                            <Reveal delay={0.3}>
                                <div className="p-12 bg-white/5 rounded-[3rem] text-center border border-white/5 backdrop-blur-sm">
                                    <p className="text-white/40 font-bold uppercase tracking-widest">No se encontraron productos descargables.</p>
                                    <Link href="/presets" className="text-brand-primary text-[10px] font-black uppercase mt-4 block hover:underline tracking-widest">Volver a la tienda</Link>
                                </div>
                            </Reveal>
                        )}
                    </div>

                    <Reveal delay={0.5}>
                        <div className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center backdrop-blur-sm">
                            <p className="text-white/40 text-sm font-medium mb-6">¿Tienes algún problema con tu descarga?</p>
                            <a href="mailto:soporte@interludio.es" className="inline-block bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 hover:border-brand-primary transition-all">Contactar a Soporte</a>
                        </div>
                    </Reveal>
                </div>
            </main>
            <Footer />
        </div>
    );
}
