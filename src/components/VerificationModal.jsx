'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function VerificationModal({ isOpen, onClose, email }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    if (!isOpen) return null;

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await authClient.emailOtp.verifyEmail({
                email: email,
                otp: code
            });

            if (error) {
                setError(error.message || 'Código incorrecto. Inténtalo de nuevo.');
            } else {
                onClose();
                window.location.reload();
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "email-verification"
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-md bg-brand-primary border border-white/20 rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-2">VERIFICA TU EMAIL.</h2>
                    <p className="text-sm text-white opacity-40 uppercase tracking-widest font-bold">Código enviado a <strong>{email}</strong></p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-2">Código de Verificación</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="000000"
                            className="w-full px-6 py-5 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all text-center text-3xl font-black tracking-[0.5em] placeholder:text-white/20 text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-white text-brand-primary py-4 rounded-2xl font-black tracking-widest text-sm shadow-xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'VERIFICANDO...' : 'CONFIRMAR CÓDIGO'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs font-bold">
                    <p className="opacity-40 mb-1">¿No has recibido nada?</p>
                    <button type="button" onClick={handleResend} className="text-brand-primary hover:underline">Reenviar código</button>
                </div>
            </div>
        </div>
    );
}
