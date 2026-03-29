'use client';

import { useCart } from './CartContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PresetModal({ preset, isOpen, onClose }) {
    const { addToCart, cart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    
    if (!isOpen || !mounted) return null;

    const isInCart = cart.some(item => item.id === preset.id);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in text-white selection:bg-brand-primary">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-5xl md:w-[85vw] bg-[#0A0A0F]/95 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col md:flex-row h-fit max-h-[90vh] animate-zoom-in">
                
                {/* Image Section */}
                <div className="w-full md:w-[45%] relative bg-brand-primary/5 min-h-[400px] md:min-h-full flex-shrink-0">
                    {preset.image ? (
                        <img src={preset.image} alt={preset.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brand-primary/20">
                            <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute top-8 left-8">
                        <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Premium Asset</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-8 md:p-16 overflow-y-auto min-w-0">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors z-10"
                    >
                        <svg className="w-8 h-8 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="mb-10 pt-4">
                        <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">{preset.category || 'Preset Pack'}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">{preset.name}</h2>
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-black text-white/90">{(preset.price / 100).toFixed(2)}€</p>
                            <span className="text-white/20 text-xs font-bold uppercase tracking-widest border border-white/10 px-3 py-1 rounded-md">Pago Único</span>
                        </div>
                    </div>

                    <div className="space-y-8 mb-12">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Descripción</h4>
                            <p className="text-white/60 leading-relaxed font-medium">
                                {preset.description || 'Este pack ha sido meticulosamente diseñado en los estudios de Interludio para ofrecerte la máxima calidad sonora. Compatible con los principales DAWs del mercado, garantiza un flujo de trabajo optimizado y resultados de primer nivel.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase text-white/30 mb-1">Formato</p>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">.WAV / .PRSET</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase text-white/30 mb-1">Tamaño</p>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">LIGERO</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => {
                                addToCart(preset);
                                onClose();
                            }}
                            disabled={isInCart}
                            className={`w-full py-5 rounded-2xl text-xs uppercase font-black tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${
                                isInCart 
                                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 cursor-default' 
                                : 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary hover:translate-y-[-2px]'
                            }`}
                        >
                            {isInCart ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    En el Carrito
                                </span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Añadir pedido • {(preset.price / 100).toFixed(2)}€
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-white/30 text-center font-bold uppercase tracking-widest">
                            Descarga inmediata tras el pago
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
