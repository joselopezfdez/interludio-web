'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import PresetModal from './PresetModal';

export default function PresetCard({ preset }) {
    const { addToCart, cart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isInCart = cart.some(item => item.id === preset.id);

    return (
        <>
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white/5 transition-all duration-700 hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/10 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Image / Icon container */}
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-8 bg-black/40 border border-white/5 group-hover:scale-105 transition-transform duration-700">
                    {preset.image ? (
                        <img src={preset.image} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-primary/10">
                            <svg className="w-16 h-16 text-brand-primary/50 group-hover:scale-125 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="w-full bg-white/10 backdrop-blur-xl py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-white/20 transition-all border border-white/20"
                        >
                            Ver Detalles
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-2 block">{preset.category || 'Preset Pack'}</span>
                            <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-primary transition-colors">{preset.name}</h3>
                        </div>
                        <span className="text-xl font-black text-white/90">{(preset.price / 100).toFixed(2)}€</span>
                    </div>

                    <p className="text-white/40 text-sm mb-8 line-clamp-2 leading-relaxed">
                        {preset.description || 'Eleva tu sonido con esta herramienta esencial para cualquier producción musical profesional.'}
                    </p>

                    <button 
                        onClick={() => addToCart(preset)}
                        disabled={isInCart}
                        className={`w-full py-4 rounded-2xl text-xs uppercase font-black tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${
                            isInCart 
                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 cursor-default' 
                            : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/25 hover:bg-brand-secondary hover:shadow-brand-primary/40'
                        }`}
                    >
                        {isInCart ? 'Añadido' : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                                Añadir al Carrito
                            </>
                        )}
                    </button>
                </div>
            </div>

            <PresetModal preset={preset} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
