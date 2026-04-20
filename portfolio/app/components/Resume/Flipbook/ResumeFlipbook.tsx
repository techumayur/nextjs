"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

interface ResumeFlipbookProps {
    pdfUrl: string;
}

interface PageFlipAPI {
    flipNext(): void;
    flipPrev(): void;
}

interface HTMLFlipBookRef {
    pageFlip(): PageFlipAPI;
}

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

const ResumeFlipbook = ({ pdfUrl }: ResumeFlipbookProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);
    const flipSoundRef = useRef<HTMLAudioElement | null>(null);
    const bookRef = useRef<HTMLFlipBookRef>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/audio/page-flip.mp3');
            audio.preload = 'auto';
            audio.load();
            flipSoundRef.current = audio;
        }
    }, []);

    const playFlipSound = useCallback(() => {
        if (flipSoundRef.current) {
            flipSoundRef.current.currentTime = 0;
            flipSoundRef.current.play().catch(() => { });
        }
    }, []);

    const prevPage = useCallback(() => {
        bookRef.current?.pageFlip().flipPrev();
    }, []);

    const nextPage = useCallback(() => {
        bookRef.current?.pageFlip().flipNext();
    }, []);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const version = pdfjs.version || '4.8.52';
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        }
    }, []);

    const finalPdf = useMemo(() => {
        if (!pdfUrl) return undefined;
        // Proxy absolute URLs to avoid CORS
        if (pdfUrl.startsWith('http') || pdfUrl.includes('localhost')) {
            return `/api/proxy?url=${encodeURIComponent(pdfUrl)}`;
        }
        return pdfUrl;
    }, [pdfUrl]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoaded(true);
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

    const isMobile = containerWidth < 768;
    const bookWidth = isMobile ? containerWidth - 40 : Math.min(containerWidth * 0.9, 1200);
    const pageWidth = isMobile ? bookWidth : bookWidth / 2;
    const pageHeight = pageWidth * 1.414;

    return (
        <section className="resume-flipbook-section section-spacing" id="resume-flipbook">
            <div className="container" ref={containerRef}>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="flipbook-wrapper" style={{
                            boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                            borderRadius: '30px',
                            overflow: 'hidden',
                            background: '#fff',
                            padding: isMobile ? '10px' : '30px',
                            minHeight: isMobile ? '400px' : '650px',
                            position: 'relative'
                        }}>
                            {!finalPdf ? (
                                <div className="text-center py-5">
                                    <p>Loading PDF resources...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-5">
                                    <div className="alert alert-warning">
                                        <p>Could not load the resume preview.</p>
                                        <a href={pdfUrl} target="_blank" className="btn btn-primary mt-3">Download PDF</a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!isLoaded && <div className="flipbook-loader">Rendering Digital Resume...</div>}
                                    <div className={`flipbook-viewport transition-all duration-700 ${isLoaded ? 'opacity-1' : 'opacity-0'}`}>
                                        <Document file={finalPdf} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={null}>
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
                                                    showCover={true}
                                                    onFlip={playFlipSound}
                                                    usePortrait={isMobile}
                                                    startPage={0}
                                                    drawShadow={true}
                                                    flippingTime={1000}
                                                    mobileScrollSupport={true}
                                                    className="resume-flipbook"
                                                    style={{}}
                                                    startZIndex={0}
                                                    autoSize={true}
                                                    maxShadowOpacity={0.5}
                                                    clickEventForward={true}
                                                    useMouseEvents={true}
                                                    swipeDistance={30}
                                                    showPageCorners={true}
                                                    disableFlipByClick={false}
                                                >
                                                    {pages.map((pNum) => (
                                                        <PDFPage key={pNum} pageNumber={pNum} width={pageWidth} />
                                                    ))}
                                                </HTMLFlipBook>
                                            )}
                                        </Document>
                                    </div>

                                    {isLoaded && !isMobile && (
                                        <div className="flipbook-navigation">
                                            <button onClick={prevPage} className="nav-btn prev">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                                            </button>
                                            <button onClick={nextPage} className="nav-btn next">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .flipbook-viewport { display: flex; justify-content: center; }
                .flipbook-page { background: #fff; box-shadow: inset 7px 0 30px -7px rgba(0,0,0,0.1); }
                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #fff;
                    border: none;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s ease;
                }
                .nav-btn:hover { background: var(--primary-color); color: #fff; transform: translateY(-50%) scale(1.1); }
                .nav-btn.prev { left: -25px; }
                .nav-btn.next { right: -25px; }
                .flipbook-loader { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
                .opacity-0 { opacity: 0; }
                .opacity-1 { opacity: 1; }
                .transition-all { transition: all 0.7s ease; }

                @media (max-width: 991px) {
                    .nav-btn { display: none; }
                }
            `}</style>
        </section>
    );
};

export default ResumeFlipbook;
