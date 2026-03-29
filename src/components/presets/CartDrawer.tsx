'use client';

import { useCart } from './CartContext';
import { useState } from 'react';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, cartTotal } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/stripe/presets-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems: cart }),
            });

            if (response.ok) {
                const { url } = await response.json();
                window.location.href = url;
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (err) {
            console.error('Checkout error', err);
            alert('Algo salió mal al procesar el pago.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />
            
            {/* Drawer */}
            <div className="relative w-full max-w-md bg-[#0A0A0F]/90 backdrop-blur-2xl h-full shadow-2xl border-l border-white/5 flex flex-col animate-slide-in-right">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">TU CARRITO</h2>
                        <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-1">
                            {cart.length === 0 ? 'Sin artículos' : `${cart.length} Artículos seleccionados`}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm font-bold uppercase tracking-widest">El carrito está vacío</p>
                            <button 
                                onClick={onClose}
                                className="text-xs text-brand-primary font-black hover:underline"
                            >
                                CONTINUAR COMPRANDO
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group relative transition-all hover:bg-white/10 hover:border-brand-primary/20">
                                <div className="w-20 h-20 rounded-2xl bg-black/40 overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">{item.category || 'Preset'}</p>
                                    <h3 className="text-sm font-black text-white truncate pr-6">{item.name}</h3>
                                    <p className="text-sm font-bold text-white/40 mt-1">{(item.price / 100).toFixed(2)}€</p>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Section */}
                <div className="p-8 border-t border-white/5 bg-black/20">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Estimado</span>
                        <span className="text-3xl font-black text-white">{(cartTotal / 100).toFixed(2)}€</span>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isLoading}
                        className="w-full py-5 rounded-2xl bg-brand-primary text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 hover:bg-brand-secondary hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                PROCESANDO...
                            </span>
                        ) : (
                            <>
                                PROCEDER AL PAGO
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>
                    
                    <p className="text-[10px] text-center text-white/20 mt-6 font-bold uppercase tracking-widest font-mono">
                        Secure checkout powered by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
