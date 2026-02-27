'use client';

import { useState, useEffect } from 'react';

export default function StudioNotification({ notifications, removeNotification }) {
    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-[200] flex flex-col gap-4 pointer-events-none max-w-sm w-full">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`pointer-events-auto w-full bg-brand-primary border p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-in-right ${notif.type === 'success' ? 'border-green-500/20' :
                        notif.type === 'error' ? 'border-red-500/20' :
                            'border-white/20'
                        }`}
                >
                    <div>
                        {notif.type === 'success' && (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {notif.type === 'error' && (
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                        {notif.type === 'info' && (
                            <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] opacity-60 mb-1">
                            {notif.type === 'success' ? 'Éxito en el Estudio' :
                                notif.type === 'error' ? 'Error Detectado' :
                                    'Atención Artista'}
                        </p>
                        <p className="text-sm font-black text-white tracking-tight leading-tight uppercase">
                            {notif.text}
                        </p>
                    </div>

                    <button
                        onClick={() => removeNotification(notif.id)}
                        className="opacity-20 hover:opacity-100 transition-opacity p-1"
                    >
                        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
