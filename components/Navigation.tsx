"use client";
import { ME } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function Navigation() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-7 px-6 py-2.5 pl-6 rounded-full bg-crimson/88 backdrop-blur-xl text-red font-medium text-[15px] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
                }`}
            aria-label="Main"
        >
            <a href="#top" className="font-extrabold text-lg text-white mr-[150px] hover:text-white transition-colors">
                {ME.name}
            </a>
            <a href="#top" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#work" className="hover:text-white transition-colors">Projects</a>
            <a href="#ugc" className="hover:text-white transition-colors">UGC</a>
            <a
                href="#contact"
                className="bg-red text-crimson px-5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:bg-pink hover:text-white"
            >
                Contact me
            </a>
        </nav>
    );
}
