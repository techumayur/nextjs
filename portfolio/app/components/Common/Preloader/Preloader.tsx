"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
    logo?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ logo = "/images/logo.svg" }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent scroll when loading
        document.body.style.overflow = 'hidden';

        const handleLoad = () => {
            setProgress(100);
        };

        // Check if already loaded
        if (document.readyState === 'complete') {
            // Small delay to ensure smooth transition even if cached
            setTimeout(handleLoad, 500);
        } else {
            window.addEventListener('load', handleLoad);
        }

        // Safety timeout - force loader to finish after 5 seconds
        const safetyTimeout = setTimeout(() => {
            handleLoad();
        }, 5000);

        // Simulate progress for visual feedback
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                // Slower increments after 80%
                const inc = prev > 80 ? (Math.random() * 2) : (Math.floor(Math.random() * 10) + 5);
                return Math.min(prev + inc, 95);
            });
        }, 200);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearInterval(interval);
            clearTimeout(safetyTimeout);
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            // Wait a bit at 100% for smooth transition
            const timer = setTimeout(() => {
                if (!overlayRef.current) {
                    setIsVisible(false);
                    return;
                }

                const tl = gsap.timeline({
                    onComplete: () => {
                        setIsVisible(false);
                        document.body.style.overflow = '';
                    }
                });

                tl.to(contentRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.4,
                    ease: "power2.in"
                })
                .to(overlayRef.current, {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    opacity: 0, // Fallback for browsers with clip-path issues
                    duration: 0.8,
                    ease: "power4.inOut"
                });

                // Ultimate fallback: force hide after 2 seconds
                const forceHide = setTimeout(() => {
                    setIsVisible(false);
                    document.body.style.overflow = '';
                }, 2000);

                return () => clearTimeout(forceHide);
            }, 400);

            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div className="preloader-overlay" ref={overlayRef}>
            <div className="loader-pattern"></div>
            
            <div className="loader-content" ref={contentRef}>
                <div className="loader-text-wrapper">
                    <div className="loader-text">Techu Mayur</div>
                    <div className="loader-progress-bar">
                        <div 
                            className="loader-progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="loader-status">{progress}% Loading...</div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
