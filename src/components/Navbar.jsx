'use client';

import { useState, useRef, useEffect } from 'react';
import AuthModal from './AuthModal';
import VerificationModal from './VerificationModal';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSendingVerif, setIsSendingVerif] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsUserMenuOpen(false);
                    router.refresh();
                }
            }
        });
    };

    const handleStartVerification = async () => {
        if (!session?.user?.email) return;

        setIsSendingVerif(true);
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email: session.user.email,
                type: "email-verification"
            });
            setIsVerificationOpen(true);
        } catch (err) {
            console.error(err);
            // Even if it fails, open modal so they can try resending
            setIsVerificationOpen(true);
        } finally {
            setIsSendingVerif(false);
        }
    };

    const needsVerification = session && !session.user.emailVerified;

    return (
        <>
            {/* Verification Banner */}
            {needsVerification && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-brand-primary text-white text-[9px] md:text-xs font-black py-3 px-6 text-center animate-fade-in flex flex-wrap items-center justify-center gap-3">
                    <span className="opacity-90 tracking-widest uppercase">⚠️ TU EMAIL ({session.user.email}) NO ESTÁ VERIFICADO</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleStartVerification}
                            disabled={isSendingVerif}
                            className="bg-white text-brand-primary px-4 py-1.5 rounded-full hover:bg-studio-bg transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase shadow-lg"
                        >
                            {isSendingVerif ? 'ENVIANDO...' : 'ENVIAR NUEVO CÓDIGO'}
                        </button>
                        <button
                            onClick={() => {
                                setVerificationEmail(session.user.email);
                                setIsVerificationOpen(true);
                            }}
                            className="bg-brand-primary border border-white/30 text-white px-4 py-1.5 rounded-full hover:bg-white/10 transition-all active:scale-95 text-[10px] uppercase"
                        >
                            TENGO UN CÓDIGO
                        </button>
                    </div>
                </div>
            )}

            <nav className={`fixed left-0 right-0 z-50  backdrop-blur-md shadow-sm border-b border-brand-primary/5 transition-all duration-300 ${needsVerification ? 'top-[44px] md:top-[44px]' : 'top-0'}`}>
                <div className="container mx-auto px-6 py-4">
                    <div className="relative flex items-center justify-between">
                        {/* Placeholder for left on mobile to help center logo */}
                        <div className="w-10 md:hidden" />

                        {/* Logo */}
                        <Link href="/" className="flex items-center justify-center gap-2 bg-brand-primary/10 p-2 rounded-md transition-transform hover:scale-105">
                            <span className="font-black text-xl tracking-tighter text-white">INTERLUDIO.</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">SERVICIOS</a>
                            <Link href="/estudio" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">ESTUDIO</Link>
                            <Link href="/reservar" className="bg-brand-primary text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 whitespace-nowrap">
                                RESERVAR
                            </Link>

                            {!isPending && (
                                session ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all overflow-hidden ${needsVerification ? 'border-red-400 animate-bounce' : 'border-brand-primary/20 hover:border-brand-primary'}`}
                                        >
                                            {session.user.image ? (
                                                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <div className="w-full h-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm rounded-full">
                                                    {session.user.name[0].toUpperCase()}
                                                </div>
                                            )}
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-3 w-56 bg-brand-secondary/10 backdrop-blur-2xl rounded-[1.5rem] shadow-2xl border border-white/20 p-2 animate-fade-in-up">
                                                <div className="px-5 py-4 border-b border-white/10 mb-1 text-center sm:text-left">
                                                    <p className="text-xs font-black text-white truncate tracking-tighter">{session.user.name.toUpperCase()}</p>
                                                    <p className="text-[10px] text-white/40 truncate mt-0.5">{session.user.email}</p>
                                                </div>
                                                {session.user.isAdmin && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all mb-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                        </svg>
                                                        PANEL ADMIN
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/settings"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    AJUSTES
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    CERRAR SESIÓN
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthOpen(true)}
                                        className="text-sm font-bold text-brand-primary hover:opacity-80 transition-opacity px-4 py-2 border border-brand-primary/20 rounded-md whitespace-nowrap"
                                    >
                                        LOGIN
                                    </button>
                                )
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-end text-brand-primary focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out fixed left-0 right-0 top-full bg-[#5a1a3b]/95 backdrop-blur-2xl border-b border-white/10 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        <div className="flex flex-col gap-4 p-8 border-t border-white/5">
                            <Link href="/#services" onClick={() => setIsOpen(false)} className="text-sm font-bold text-center text-white hover:text-brand-primary transition-colors py-2">SERVICIOS</Link>
                            <Link href="/estudio" onClick={() => setIsOpen(false)} className="text-sm font-bold text-center text-white hover:text-brand-primary transition-colors py-2">ESTUDIO</Link>
                            <div className="flex flex-col gap-3 mt-2 px-4">
                                <Link href="/reservar" onClick={() => setIsOpen(false)} className="bg-brand-primary text-white px-6 py-3 rounded-md text-sm font-bold shadow-lg shadow-brand-primary/20 w-full text-center">
                                    RESERVAR
                                </Link>

                                {!isPending && (
                                    session ? (
                                        <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-brand-primary/5">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-primary/20">
                                                    {session.user.image ? (
                                                        <img src={session.user.image} className="w-full h-full object-cover rounded-full" />
                                                    ) : session.user.name[0].toUpperCase()}
                                                </div>
                                                <span className="text-xs font-black text-white">{session.user.name.toUpperCase()}</span>
                                            </div>
                                            {needsVerification && (
                                                <button
                                                    onClick={handleStartVerification}
                                                    disabled={isSendingVerif}
                                                    className="bg-brand-primary text-white text-[10px] font-black py-2 rounded-xl"
                                                >
                                                    {isSendingVerif ? 'ENVIANDO...' : 'VERIFICAR CUENTA'}
                                                </button>
                                            )}
                                            {session.user.isAdmin && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-sm font-black text-center text-white bg-white/10 py-2 rounded-xl mb-1"
                                                >
                                                    PANEL ADMIN
                                                </Link>
                                            )}
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsOpen(false)}
                                                className="text-sm font-bold text-center text-white/80 hover:text-white transition-colors"
                                            >
                                                AJUSTES
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="text-sm font-bold text-red-400 py-2"
                                            >
                                                CERRAR SESIÓN
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsAuthOpen(true);
                                                setIsOpen(false);
                                            }}
                                            className="text-sm font-bold text-brand-primary py-3 rounded-md border border-brand-primary/20 text-center"
                                        >
                                            LOGIN
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onRegisterSuccess={(email) => {
                    setVerificationEmail(email);
                    setIsVerificationOpen(true);
                }}
            />

            <VerificationModal
                isOpen={isVerificationOpen}
                onClose={() => setIsVerificationOpen(false)}
                email={verificationEmail || session?.user?.email}
            />
        </>
    );
}
