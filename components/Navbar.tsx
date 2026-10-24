"use client";
import { useState, useEffect } from "react";
import { ME } from "@/lib/data";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed left-1/2 top-4 z-50 w-[90%] md:w-auto -translate-x-1/2 rounded-full bg-crimson/70 py-3.5 pl-6 pr-3 text-sm font-medium text-light-red backdrop-blur-md transition-all duration-300 md:text-[15px] ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex items-center w-full">
          {/* Logo */}
          <a href="#top" className="flex items-center">
            <svg width="64" height="33" viewBox="0 0 64 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M1.68854 6.57233H6.75415L12.1043 19.6253H12.332L17.6822 6.57233H22.7478V26H18.7636V13.3549H18.6024L13.5747 25.9051H10.8617L5.83399 13.3075H5.67273V26H1.68854V6.57233ZM27.8069 26.2751C26.8772 26.2751 26.0488 26.1138 25.3215 25.7913C24.5942 25.4625 24.0187 24.9787 23.595 24.3399C23.1776 23.6949 22.9689 22.8917 22.9689 21.9304C22.9689 21.1209 23.1176 20.4411 23.4148 19.8909C23.712 19.3407 24.1168 18.898 24.629 18.5628C25.1413 18.2277 25.7231 17.9747 26.3745 17.804C27.0322 17.6332 27.7215 17.513 28.4425 17.4435C29.2899 17.3549 29.9729 17.2727 30.4915 17.1968C31.0101 17.1146 31.3863 16.9945 31.6203 16.8364C31.8543 16.6783 31.9713 16.4443 31.9713 16.1344V16.0775C31.9713 15.4767 31.7816 15.0119 31.4021 14.683C31.029 14.3541 30.4978 14.1897 29.8085 14.1897C29.0812 14.1897 28.5025 14.351 28.0725 14.6735C27.6425 14.9897 27.3579 15.3881 27.2187 15.8688L23.4812 15.5652C23.6709 14.6798 24.044 13.9146 24.6006 13.2696C25.1571 12.6182 25.8749 12.1186 26.7539 11.7707C27.6393 11.4166 28.6638 11.2395 29.8274 11.2395C30.6369 11.2395 31.4116 11.3344 32.1516 11.5241C32.8978 11.7138 33.5587 12.0079 34.1342 12.4063C34.716 12.8047 35.1745 13.317 35.5097 13.9431C35.8448 14.5628 36.0124 15.3059 36.0124 16.1723V26H32.18V23.9794H32.0662C31.8322 24.4348 31.5191 24.8364 31.1271 25.1842C30.735 25.5257 30.2638 25.7945 29.7136 25.9905C29.1634 26.1802 28.5278 26.2751 27.8069 26.2751ZM28.9642 23.4862C29.5587 23.4862 30.0836 23.3692 30.5389 23.1352C30.9942 22.8949 31.3516 22.5723 31.6108 22.1676C31.8701 21.7628 31.9998 21.3043 31.9998 20.7921V19.2458C31.8733 19.3281 31.6994 19.404 31.478 19.4735C31.263 19.5368 31.0195 19.5968 30.7476 19.6538C30.4757 19.7043 30.2037 19.7518 29.9318 19.796C29.6599 19.834 29.4132 19.8688 29.1919 19.9004C28.7176 19.97 28.3033 20.0806 27.9492 20.2324C27.595 20.3842 27.3199 20.5897 27.1239 20.849C26.9278 21.102 26.8298 21.4182 26.8298 21.7976C26.8298 22.3478 27.029 22.7684 27.4274 23.0593C27.8322 23.3439 28.3444 23.4862 28.9642 23.4862ZM36.7434 26V11.4292H40.6612V13.9715H40.813C41.0786 13.0672 41.5245 12.3842 42.1505 11.9225C42.7766 11.4545 43.4976 11.2206 44.3134 11.2206C44.5158 11.2206 44.7339 11.2332 44.9679 11.2585C45.2019 11.2838 45.4075 11.3186 45.5845 11.3628V14.9486C45.3948 14.8917 45.1324 14.8411 44.7972 14.7968C44.462 14.7526 44.1553 14.7304 43.877 14.7304C43.2826 14.7304 42.7513 14.8601 42.2834 15.1194C41.8217 15.3723 41.4549 15.7265 41.183 16.1818C40.9173 16.6372 40.7845 17.1621 40.7845 17.7565V26H36.7434ZM59.2974 11.4292L54.2033 26H49.6499L44.5559 11.4292H48.8246L51.8507 21.8545H52.0025L55.0191 11.4292H59.2974Z" fill="white" />
              <path d="M47 13.2783C47 13.8088 46.7893 14.3175 46.4142 14.6925C46.0391 15.0676 45.5304 15.2783 45 15.2783C44.4696 15.2783 43.9609 15.0676 43.5858 14.6925C43.2107 14.3175 43 13.8088 43 13.2783C43 12.7479 43.2107 12.2392 43.5858 11.8641C43.9609 11.489 44.4696 11.2783 45 11.2783C45.5304 11.2783 46.0391 11.489 46.4142 11.8641C46.7893 12.2392 47 12.7479 47 13.2783Z" fill="#FFBDB8" />
            </svg>
          </a>

          {/* Desktop Nav Links - pushed to the right with increased spacing */}
          <div className="hidden md:flex items-center gap-6 ml-auto pl-62">
            <a href="#top" className="hover:text-white">
              Home
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#work" className="hover:text-white">
              Projects
            </a>
            <a href="#ugc" className="hover:text-white">
              UGC
            </a>
            <a
              href="#contact"
              className="rounded-full bg-light-red px-5 py-2.5 font-semibold text-crimson transition hover:bg-vivid-pink hover:text-white whitespace-nowrap"
            >
              Contact me
            </a>
          </div>

          {/* Mobile Menu Button */}
          {/* Two lines, the lower one shorter, that turn into an × when the menu opens */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative ml-auto flex size-10 items-center justify-center rounded-full bg-light-red/10 transition hover:bg-light-red/20 md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span
              aria-hidden
              className={`absolute h-0.5 w-5 rounded-full bg-light-red transition duration-300 ${isMobileMenuOpen ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              aria-hidden
              className={`absolute h-0.5 rounded-full bg-light-red transition-all duration-300 ${isMobileMenuOpen ? "w-5 -rotate-45" : "w-3 translate-x-1 translate-y-[4px]"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed left-1/2 top-20 z-40 w-[90%] -translate-x-1/2 rounded-3xl bg-crimson/80 p-6 text-light-red backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#top" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
              Home
            </a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
              About
            </a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
              Services
            </a>
            <a href="#work" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
              Projects
            </a>
            <a href="#ugc" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">
              UGC
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full bg-light-red px-5 py-2.5 text-center font-semibold text-crimson transition hover:bg-vivid-pink hover:text-white"
            >
              Contact me
            </a>
          </div>
        </div>
      )}
    </>
  );
}
