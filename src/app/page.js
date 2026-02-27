import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import { Reveal } from '@/components/animations/Reveal';


export default function Home() {
  return (
    <main className="min-h-screen bg-transparent selection:bg-brand-primary selection:text-white">
      <Navbar />
      <Hero />
      <Services />
      
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                THE <span className="text-brand-secondary italic">STUDIO</span> GALLERY
              </h2>
              <p className="opacity-60 max-w-lg">
                Explora nuestro estudio de grabación en Madrid. Diseñado para la máxima experiencia creativa.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <Carousel 
              images={[
                "/studio1.jpg",
                "/studio2.jpg",
                "/studio3.jpg"
              ]} 
              autoSlideInterval={6000}
            />
          </Reveal>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
