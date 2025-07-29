import React, { useEffect, useRef, useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tlItems = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    console.log('toggleMenu called, current isMenuOpen:', isMenuOpen);
    setIsMenuOpen(prev => !prev);
  };

  // Función para asignar referencias a los ítems
  const setItemRef = (el: HTMLAnchorElement | null, index: number) => {
    itemsRef.current[index] = el;
  };

  useEffect(() => {
    itemsRef.current = new Array(4).fill(null);

    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    // Configuración inicial del menú
    gsap.set(menu, { height: 0, autoAlpha: 0, overflow: 'hidden' });

    // Configuración inicial de los ítems
    itemsRef.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: -10 });
      }
    });

    // Crear timeline para los ítems
    tlItems.current = gsap.timeline({ paused: true }).to(
      itemsRef.current.filter((el): el is HTMLAnchorElement => el !== null),
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.05,
        ease: 'elastic.inOut',
      }
    );

    // Cleanup
    return () => {
      tlItems.current?.kill();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !tlItems.current) {
      console.log('menu or tlItems is null', { menu: !!menu, tlItems: !!tlItems.current });
      return;
    }

    if (isMenuOpen) {
      const fullHeight = menu.scrollHeight;
      gsap.to(menu, {
        height: fullHeight,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          menu.style.height = 'auto';
        },
      });
      tlItems.current.play();
    } else {
      tlItems.current.reverse();
      gsap.to(menu, {
        height: 0,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.in',
      });
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">VAPDFKIT</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600">Features</a>
            <a href="#solutions" className="text-gray-700 hover:text-purple-600">Solutions</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600">Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-purple-600">Sign In</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Get Started</button>
          </div>

          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 cursor-pointer" /> : <Menu className="h-6 w-6 cursor-pointer" />}
          </button>
        </div>

        <div ref={menuRef} className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col space-y-4 py-4">
            {['#features', '#solutions', '#testimonials', '#pricing'].map((href, i) => (
              <a
                key={href}
                href={href}
                ref={(el) => setItemRef(el, i)}
                onClick={() => {
                  console.log(`Nav item ${href} clicked`);
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600"
              >
                {href.replace('#', '').replace(/^\w/, (c) => c.toUpperCase())}
              </a>
            ))}
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;