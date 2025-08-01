import type { FC } from "react";
import { useEffect, useRef } from "react";
import { FileText, Zap, Settings } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Estilos CSS necesarios para la animación antes/después
const styles = `
  .comparisonSection {
    position: relative;
    width: 100%;
    max-width: 500px; /* Ajusta según el tamaño deseado */
    aspect-ratio: 16 / 9; /* Mantiene la proporción de la imagen */
    overflow: hidden;
  }
  .comparisonSection img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
  .afterImage {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const Hero: FC = () => {
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inyectar estilos CSS
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const section = comparisonRef.current;
    if (!section) return;

    const afterImage = section.querySelector(".afterImage") as HTMLElement;
    const afterImageImg = section.querySelector(".afterImage img") as HTMLImageElement;

    // Crear timeline de GSAP
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      afterImage,
      { xPercent: 100, x: 0 },
      { xPercent: 0, duration: 0.5, ease: "power2.out" }
    ).fromTo(
      afterImageImg,
      { xPercent: -100, x: 0 },
      { xPercent: 0, duration: 0.5, ease: "power2.out" },
      0
    );

    // Parametrizar posiciones de inicio y fin
    let startPosition = "top 40%"; // Valor por defecto
    let endPosition = "bottom 40%"; // Valor por defecto

    // Detectar si el dispositivo soporta hover y tiene ancho suficiente (escritorio)
    const isDesktop = window.matchMedia("(hover: hover) and (min-width: 769px)").matches;

    if (isDesktop) {
      // Posiciones para escritorio (hover)
      startPosition = "top 40%"; // Ajusta según necesites
      endPosition = "bottom 40%"; // Ajusta según necesites
      section.addEventListener("mouseenter", () => tl.play());
      section.addEventListener("mouseleave", () => tl.reverse());
    } else {
      // Posiciones para móvil (scroll)
      startPosition = "top 40%"; // Punto de entrada para móvil
      endPosition = "bottom 40%"; // Punto de salida para móvil
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: startPosition,
          end: endPosition,
          scrub: true,
          markers: false, // Mostrar marcadores para depuración
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
          onEnterBack: () => tl.play(),
          onLeave: () => tl.reverse(),
        },
        defaults: { ease: "none" },
      });
    }

    // Limpieza al desmontar
    return () => {
      if (isDesktop) {
        section.removeEventListener("mouseenter", () => tl.play());
        section.removeEventListener("mouseleave", () => tl.reverse());
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0"
    style={{
      background: "#ffffff",
      backgroundImage: `
        radial-gradient(
          circle at top center,
          rgba(173, 109, 244, 0.5),
          transparent 70%
        )
      `,
      filter: "blur(80px)",
      backgroundRepeat: "no-repeat",
    }}
  />
      
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Generate <span className=" text-purple-600">dynamic PDFs</span> under one hood
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Your ultimate gateway to PDF generation. Create stunning documents on-demand and in batch mode with complete customization control.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Get Started
            </button>
            <button className="border-primary/20 hover:bg-primary/5">
              View Documentation
            </button>
          </div>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>On-demand generation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-5 h-5 text-primary" />
              <span>Batch processing</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="w-5 h-5 text-primary" />
              <span>Fully customizable</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Visual element */}
        <div className="relative">
          <div
            ref={comparisonRef}
            className="comparisonSection relative bg-card rounded-2xl shadow-card p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            <img
              src="/ImageHeroBefore.png"
              alt="Ilustración Antes"
              className="beforeImage"
            />
            <div className="afterImage">
              <img
                src="/ImageHeroAfter.png"
                alt="Ilustración Después"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;