'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose, onRegisterSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await authClient.signIn.email({
                    email,
                    password,
                    callbackURL: '/',
                }, {
                    onSuccess: () => {
                        onClose();
                        router.refresh();
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message || 'Error al iniciar sesión');
                    }
                });
            } else {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: '/',
                }, {
                    onSuccess: async () => {
                        // After sign up, prompt to send OTP code
                        // Verification OTP is sent automatically by the plugin.
                        // Removing the explicit call to fix double emails.
                        onClose();
                        if (onRegisterSuccess) {
                            onRegisterSuccess(email);
                        }
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message || 'Error al registrarse');
                    }
                });
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-brand-primary/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-fade-in-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-brand-primary hover:scale-110 transition-transform focus:outline-none"
                    disabled={loading}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 pt-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                            {isLogin ? 'BIENVENIDO.' : 'ÚNETE.'}
                        </h2>
                        <p className="text-sm font-medium text-white/70">
                            {isLogin ? 'Accede a tu cuenta de estudio' : 'Crea tu perfil para empezar'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tu nombre completo"
                                    className="w-full px-5 py-3.5 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/30 text-white"
                                />
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="artista@estudio.com"
                                className="w-full px-5 py-3.5 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/30 text-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-3.5 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/30 text-white pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full mt-6 bg-white text-brand-primary py-4 rounded-2xl font-black tracking-widest text-sm hover:bg-white/90 transition-all hover:scale-[1.02] shadow-xl shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    PROCESANDO...
                                </>
                            ) : (
                                isLogin ? 'ENTRAR' : 'REGISTRARSE'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-white/70">
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya eres miembro?'}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="mt-1 text-sm font-bold text-white hover:underline underline-offset-4 decoration-2"
                        >
                            {isLogin ? 'Crea una ahora' : 'Inicia sesión aquí'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
