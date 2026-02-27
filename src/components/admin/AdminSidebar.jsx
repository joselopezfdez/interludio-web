'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = authClient.useSession();

    const isActive = (path) => pathname === path;

    const navItems = [
        { label: 'DASHBOARD', path: '/admin/dashboard' },
        { label: 'USUARIOS', path: '/admin/users' },
    ];

    if (session?.user?.role === 'owner') {
        navItems.push({ label: 'CURSOS', path: '/admin/courses' });
    }

    return (
        <>
            {/* Mobile Header / Navbar */}
            <header className="md:hidden bg-brand-primary border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-50">
                <span className="font-black text-lg tracking-tighter text-white uppercase">ADMIN PANEL</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden fixed inset-0 z-40 bg-brand-primary backdrop-blur-md transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <nav className="flex flex-col items-center justify-center h-full gap-6 p-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full max-w-xs text-center py-4 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all ${isActive(item.path)
                                ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20"
                                : "bg-white/5 opacity-60"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mt-10 text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">VOLVER A LA WEB</Link>
                </nav>
            </div>

            {/* Desktop Sidebar */}
            <aside className="w-72 border-r border-white/10 bg-brand-secondary/10 hidden md:flex flex-col min-h-screen p-8 sticky top-0">
                <div className="mb-12 p-2">
                    <span className="font-black text-2xl tracking-tighter text-white uppercase">ADMIN PANEL</span>
                </div>
                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`block px-6 py-4 rounded-2xl font-black text-[11px] tracking-[0.25em] uppercase transition-all ${isActive(item.path)
                                ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/25 scale-[1.02]"
                                : "hover:bg-white/5 opacity-40 hover:opacity-100"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="pt-10 border-t border-white/5">
                    <Link href="/" className="block px-4 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-[10px] font-black tracking-[0.3em] uppercase opacity-30 hover:opacity-100 text-center">
                        VOLVER A LA WEB
                    </Link>
                </div>
            </aside>
        </>
    );
}
