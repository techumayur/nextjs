"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

import { WPPortfolioItem } from '@/types/acf';

interface BrandGuidelinesProps {
    project?: WPPortfolioItem;
    pdfSource?: string;
}

interface PageFlipAPI {
    flipNext(): void;
    flipPrev(): void;
    // Add other methods as needed:
    // getPageCount(): number;
    // getCurrentPageIndex(): number;
}

interface HTMLFlipBookRef {
    pageFlip(): PageFlipAPI;
}

// Sub-component for individual PDF Page
const PDFPage = React.forwardRef<HTMLDivElement, { pageNumber: number, width: number }>((props, ref) => {
    return (
        <div className="flipbook-page" ref={ref} data-density="hard">
            <Page
                pageNumber={props.pageNumber}
                width={props.width}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={<div className="page-loader">Loading Page {props.pageNumber}...</div>}
            />
        </div>
    );
});
PDFPage.displayName = 'PDFPage';

const BrandGuidelines = ({ project, pdfSource }: BrandGuidelinesProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);
    const flipSoundRef = useRef<HTMLAudioElement | null>(null);
    const bookRef = useRef<HTMLFlipBookRef>(null); // Ref for HTMLFlipBook
    const guidelinesData = project?.acf?.brand_guidelines;
    const [isMuted, setIsMuted] = useState(guidelinesData?.settings?.enable_sound === false);

    // Initial Sound Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/audio/page-flip.mp3');
            audio.preload = 'auto';
            audio.load();
            flipSoundRef.current = audio;
        }
    }, []);

    const playFlipSound = useCallback(() => {
        if (flipSoundRef.current && !isMuted) {
            flipSoundRef.current.currentTime = 0;
            const promise = flipSoundRef.current.play();
            if (promise !== undefined) {
                promise.catch(() => { });
            }
        }
    }, [isMuted]);

    const prevPage = useCallback(() => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipPrev();
        }
    }, []);

    const nextPage = useCallback(() => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipNext();
        }
    }, []);

    // Responsive width calculation
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // We leave some margin for the shadow and centering
                const newWidth = Math.min(window.innerWidth, containerRef.current.clientWidth);
                setContainerWidth(newWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Force HTTPS and use UNPKG which is more reliable for dynamic versioning
            const version = pdfjs.version || '4.8.52';
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        }
    }, []);


    const subHeading = guidelinesData?.sub_heading;
    const subHeadingIcon = guidelinesData?.sub_heading_icon || "/images/user-1.svg";
    const headingPart1 = guidelinesData?.heading;
    const highlightPart = guidelinesData?.highlight_text;
    const description = guidelinesData?.description;



    const finalPdf = useMemo(() => {
        if (pdfSource) return pdfSource;

        const acfPdf = guidelinesData?.brand_guidelines_pdf;
        if (!acfPdf) return undefined;

        let rawUrl: string | undefined;
        if (typeof acfPdf === 'string') {
            rawUrl = acfPdf;
        } else if (acfPdf && typeof acfPdf === 'object' && 'url' in acfPdf) {
            rawUrl = (acfPdf as { url: string }).url;
        }

        if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === "") {
            return undefined;
        }

        // Always proxy absolute URLs to avoid CORS, especially on localhost
        if (rawUrl.startsWith('http') || rawUrl.includes('localhost')) {
            return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
        }

        return rawUrl;
    }, [guidelinesData, pdfSource]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoaded(true);
        setError(null);
    }, []);

    const onDocumentLoadError = useCallback((err: Error) => {
        console.error("PDF Load Error:", err);
        setError(err.message);
        setIsLoaded(false);
    }, []);

    const pages = useMemo(() => {
        if (!numPages) return [];
        return Array.from({ length: numPages }, (_, i) => i + 1);
    }, [numPages]);

    if (!guidelinesData || (!headingPart1 && !subHeading)) return null;

    // Calculate dimensions for the book
    // For "Full Width", we want the book to be large but centered.
    const isMobile = containerWidth < 768;
    const bookWidth = isMobile ? containerWidth - 40 : Math.min(containerWidth * 0.9, 1400);
    const pageWidth = isMobile ? bookWidth : bookWidth / 2;
    const pageHeight = pageWidth * 1.414; // A4 Aspect Ratio

    return (
        <section className="pd-pdf-flipbook-branding pb-5" id="branding-guidelines" style={{
            overflow: 'hidden'
        }}>
            <div className="container-fluid px-lg-5" ref={containerRef}>
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <div className="section-title section-title-center mb-0">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <Image src={subHeadingIcon} alt="Techu Mayur" width={20} height={20} className="img-fluid" />
                                </div>
                                {subHeading}
                            </span>
                            <h2 className="mt-2">{headingPart1}<span className="highlight">{highlightPart}</span></h2>
                            <div className="section-para-center">
                                <div dangerouslySetInnerHTML={{ __html: description || "" }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12">
                        <div
                            className="flipbook-outer-container position-relative"
                            style={{ minHeight: isMobile ? '400px' : '700px' }}
                            onClick={() => {
                                // Resume audio context / pre-warm on first click
                                if (flipSoundRef.current && flipSoundRef.current.paused) {
                                    flipSoundRef.current.play().then(() => {
                                        flipSoundRef.current!.pause(); // Immediate pause after unlock
                                        flipSoundRef.current!.currentTime = 0;
                                    }).catch(() => { });
                                }
                            }}
                        >
                            {(!finalPdf) ? (
                                <div className="text-center py-5">
                                    <div className="alert alert-info d-inline-block px-5 border-0 shadow-sm">
                                        <p className="mb-0">Preparing interactive playbook assets...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-5">
                                    <div className="alert alert-warning d-inline-block px-5 shadow-sm border-0">
                                        <h4 className="mb-3 text-warning">Playbook Rendering Idle</h4>
                                        <p className="mb-2">The interactive playbook could not be initialized automatically.</p>
                                        <p className="small text-muted mb-4 text-break">Source: {finalPdf}</p>
                                        <a href={finalPdf || "#"} target="_blank" className="main-btn px-4 d-inline-flex align-items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            {guidelinesData?.download_text || "Download PDF Guidelines"}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!isLoaded && (
                                        <div className="flipbook-loader position-absolute top-50 start-50 translate-middle text-center p-5 z-2">
                                            <div className="spinner-border text-primary mb-3" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="text-secondary">Rendering Digital Playbook...</p>
                                        </div>
                                    )}

                                    <div className={`flipbook-viewport d-flex justify-content-center transition-all duration-700 ${isLoaded ? 'opacity-1 scale-100' : 'opacity-0 scale-95'}`}>
                                        <Document
                                            file={finalPdf}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            onLoadError={onDocumentLoadError}
                                            loading={null}
                                        >
                                            {numPages && (
                                                <HTMLFlipBook
                                                    ref={bookRef}
                                                    width={pageWidth}
                                                    height={pageHeight}
                                                    size="fixed"
                                                    minWidth={300}
                                                    maxWidth={1000}
                                                    minHeight={420}
                                                    maxHeight={1414}
                                                    maxShadowOpacity={0.6}
                                                    showCover={true}
                                                    className="brand-flipbook"
                                                    style={{ boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2), 0 18px 36px -18px rgba(0,0,0,0.2)' }}
                                                    startPage={0}
                                                    drawShadow={true}
                                                    flippingTime={1000}
                                                    usePortrait={isMobile}
                                                    startZIndex={0}
                                                    autoSize={true}
                                                    mobileScrollSupport={true}
                                                    clickEventForward={true}
                                                    useMouseEvents={true}
                                                    swipeDistance={30}
                                                    showPageCorners={true}
                                                    disableFlipByClick={false}
                                                    onFlip={playFlipSound}
                                                    onChangeState={(e) => {
                                                        if (e.data === 'folding') playFlipSound();
                                                    }}
                                                >
                                                    {pages.map((pNum) => (
                                                        <PDFPage key={pNum} pageNumber={pNum} width={pageWidth} />
                                                    ))}
                                                </HTMLFlipBook>
                                            )}
                                        </Document>
                                    </div>

                                    {/* Navigation Arrows */}
                                    {isLoaded && !isMobile && (
                                        <div className="flipbook-navigation d-none d-md-block">
                                            <button
                                                onClick={prevPage}
                                                className="flipbook-nav-btn prev position-absolute top-50 start-0 translate-middle-y"
                                                aria-label="Previous Page"
                                                title="Previous Page"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                            </button>
                                            <button
                                                onClick={nextPage}
                                                className="flipbook-nav-btn next position-absolute top-50 end-0 translate-middle-y"
                                                aria-label="Next Page"
                                                title="Next Page"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Sound Toggle Overlay */}
                                    {isLoaded && (
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="position-absolute bottom-0 end-0 m-4 flipbook-sound-btn btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                            style={{ width: '40px', height: '40px', zIndex: 10 }}
                                            title={isMuted ? "Unmute Flip" : "Mute Flip"}
                                        >
                                            {isMuted ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9l-5 5H2v-4h2l5-5v10z"></path><path d="M17.07 16.36a6 6 0 0 0 0-8.72"></path></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .flipbook-viewport {
                    perspective: 2000px;
                }
                .brand-flipbook {
                    background-color: #fff;
                    margin: 0 auto;
                }
                .flipbook-page {
                    overflow: hidden;
                    box-shadow: inset 7px 0 30px -7px rgba(0,0,0,0.1);
                }
                .scale-95 { transform: scale(0.95); }
                .scale-100 { transform: scale(1); }
                .transition-all { transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }

                .flipbook-nav-btn {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    width: 54px;
                    height: 54px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #111;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 20;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    cursor: pointer;
                }
                .flipbook-nav-btn.prev { margin-left: -27px; }
                .flipbook-nav-btn.next { margin-right: -27px; }
                
                .flipbook-nav-btn:hover {
                    background: #fff;
                    transform: translateY(-50%) scale(1.15);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    color: #000;
                }
                .flipbook-nav-btn:active {
                    transform: translateY(-50%) scale(0.95);
                }

                .flipbook-sound-btn {
                    transition: all 0.3s ease;
                }
                .flipbook-sound-btn:hover {
                    background: #fff;
                    transform: scale(1.1);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
            `}</style>
        </section>
    );
};

export default BrandGuidelines;
