'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-16 md:py-24 bg-transparent mt-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20 text-studio-text text-center sm:text-left">

                    <div className="space-y-6 flex flex-col items-center sm:items-start">
                        <div className="flex items-center gap-3 bg-brand-primary/10 p-2 rounded-md w-fit">
                            <span className="font-black text-xl tracking-tighter uppercase text-brand-primary">INTERLUDIO.</span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed font-bold max-w-xs text-white">
                            Tu sonido, nuestra pasión. Expertos en producción musical y mezcla.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full border border-brand-primary/20 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer opacity-70">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-brand-primary/20 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer opacity-70">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase opacity-60 tracking-[.4em] mb-6 md:mb-10 text-brand-primary">EXPLORA</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li><Link href="/#services" className="text-sm font-bold opacity-80 hover:text-brand-primary transition-colors text-white">Servicios</Link></li>
                            <li><Link href="/estudio" className="text-sm font-bold opacity-80 hover:text-brand-primary transition-colors text-white">Academia</Link></li>
                            <li><Link href="/reservar" className="text-sm font-bold opacity-80 hover:text-brand-primary transition-colors text-white">Reservar Cita</Link></li>
                            <li><Link href="/#contact" className="text-sm font-bold opacity-80 hover:text-brand-primary transition-colors text-white">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase opacity-60 tracking-[.4em] mb-6 md:mb-10 text-brand-primary">LEGAL</h4>
                        <ul className="space-y-3 md:space-y-4">
                            {["Política de Privacidad", "Términos de Servicio", "Política de Cancelación"].map((item) => (
                                <li key={item}><a href="#" className="text-sm font-bold opacity-80 hover:text-brand-primary transition-colors text-white">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="text-[10px] font-black uppercase opacity-60 tracking-[.4em] mb-6 md:mb-10 text-brand-primary">NEWSLETTER</h4>
                        <div className="space-y-4 md:space-y-6 w-full max-w-xs">
                            <p className="text-xs md:text-sm opacity-80 leading-relaxed font-bold text-white">Recibe consejos exclusivos de producción y actualizaciones del estudio.</p>
                            <div className="flex bg-studio-bg/50 border border-brand-primary/20 rounded-xl overflow-hidden p-1 shadow-sm">
                                <input type="email" placeholder="Email address" className="bg-transparent px-3 md:px-4 py-2 md:py-3 outline-none flex-1 text-xs md:text-sm font-bold text-studio-text placeholder:opacity-30" />
                                <button className="bg-brand-primary text-white p-2 md:p-3 rounded-lg hover:bg-brand-secondary transition-all">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-8 md:pt-12 border-t border-brand-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-[.4em] opacity-60 text-white text-center">
                    <p>© 2026 INTERLUDIO. ALL RIGHTS RESERVED.</p>
                    <p>MADRID, SPAIN / EXPERIENCIA DE ALTA FIDELIDAD</p>
                </div>
            </div>
        </footer>
    );
}
