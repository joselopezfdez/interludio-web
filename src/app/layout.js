import "./globals.css";
import { CartProvider } from "@/components/presets/CartContext";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata = {
  title: "Interludio Music Studio | Tu Estudio de Grabación en Madrid",
  description: "Espacios de sonido premium y equipos de clase mundial para mezcla, masterización y grabación de alta fidelidad en el corazón de España.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className="antialiased font-sans flex flex-col min-h-screen"
      >
        <CartProvider>
            <GlobalBackground />
            {children}
        </CartProvider>
      </body>

    </html>
  );
}
