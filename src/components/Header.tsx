import React, { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';



const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const burgerRef = useRef<SVGSVGElement>(null);
  const tlItems = useRef<gsap.core.Timeline | null>(null);
  const tlBurger = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const setItemRef = (el: HTMLAnchorElement | null, index: number) => {
    itemsRef.current[index] = el;
  };

  useEffect(() => {

    gsap.registerPlugin(DrawSVGPlugin);

    itemsRef.current = new Array(4).fill(null) as (HTMLAnchorElement | null)[];

    const menu = menuRef.current;
    if (!menu) return;

    // Initialize menu
    gsap.set(menu, { height: 0, autoAlpha: 0, overflow: 'hidden' });

    // Initialize menu items
    itemsRef.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: -10 });
      }
    });

    // Create timeline for menu items
    tlItems.current = gsap.timeline({ paused: true }).to(
      itemsRef.current.filter((el): el is HTMLAnchorElement => el !== null),
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );

    // Initialize burger menu animation
    const burger = burgerRef.current;
    if (burger) {
      gsap.set(burger, { autoAlpha: 1 });
      gsap.set(burger.querySelectorAll('.buns'), { drawSVG: '0% 30%' });
      gsap.set(burger.querySelector('.patty'), { drawSVG: '0% 100%' });

      tlBurger.current = gsap.timeline({ paused: true })
        .to(burger.querySelector('.patty'), { duration: 0.35, drawSVG: '50% 50%' }, 0)
        .to(burger.querySelector('.patty'), { duration: 0.1, opacity: 0, ease: 'none' }, 0.25)
        .to(burger.querySelectorAll('.buns'), { duration: 0.85, drawSVG: '69% 96.5%' }, 0);

      tlBurger.current.reversed(true);
    }

    return () => {
      tlItems.current?.kill();
      tlBurger.current?.kill();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !tlItems.current || !tlBurger.current) return;

    if (isMenuOpen) {
      const fullHeight = menu.scrollHeight;
      gsap.to(menu, {
        height: fullHeight,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          menu.style.height = 'auto';
        },
      });
      tlItems.current.play();
      tlBurger.current.play();
    } else {
      tlItems.current.reverse();
      tlBurger.current.reverse();
      gsap.to(menu, {
        height: 0,
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.in',
      });
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80   backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-[#046C95]" />
            <span className="text-2xl font-bold text-gray-900">VAPDFKIT</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-[#046C95]">
              Features
            </a>
            <a href="#solutions" className="text-gray-700 hover:text-[#046C95]">
              Solutions
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-[#046C95]">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-[#046C95]">
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-[#046C95]">Sign In</button>
            <button className="bg-[#046C95] text-white px-4 py-2 rounded-lg cursor-pointer">
              Get Started
            </button>
          </div>

          <button className="md:hidden pt-[10px]" onClick={toggleMenu}>
            <svg
              id="theBurger"
              ref={burgerRef}
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 200 200"
              className="cursor-pointer"
            >
             
              <g
                id="burger"
                fill="none"
                stroke="#046C95"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="10"
              >
                <line className="patty" x1="50" y1="61" x2="150" y2="61" />
                <path
                  className="buns"
                  d="M50,29h96c27,0,48-1,34,40-18.12,53.08-48.64,23.86-48.64,23.86L60.64,22.14"
                />
                <path
                  className="buns"
                  d="M50,94h96c27,0,48,1,34-40C161.88,1,131.36,30.17,131.36,30.17L60.64,100.88"
                />
              </g>
            </svg>
          </button>
        </div>

        <div ref={menuRef} className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col space-y-4 py-4">
            {['#features', '#solutions', '#testimonials', '#pricing'].map((href, i) => (
              <a
                key={href}
                href={href}
                ref={el => setItemRef(el, i)}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-[#046C95]"
              >
                {href.replace('#', '').replace(/^\w/, c => c.toUpperCase())}
              </a>
            ))}
            <button className="bg-[#046C95] text-white px-4 py-2 rounded-lg cursor-pointer">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;