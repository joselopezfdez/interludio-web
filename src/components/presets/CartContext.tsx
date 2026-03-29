'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('laromusic-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing cart from localStorage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage on change, but only after initialization to avoid overwriting with empty state
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('laromusic-cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (preset) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.id === preset.id);
            if (exists) return prev;
            return [...prev, preset];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (presetId) => {
        setCart((prev) => prev.filter((item) => item.id !== presetId));
    };

    const clearCart = () => {
        setCart([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('laromusic-cart');
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
