"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import './Branding.css';



import { ACFImage } from '@/types/acf';

interface BrandingProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        highlight_text?: string;
        description?: string;
        pdf_file?: ACFImage;
        brand_guidelines_pdf?: ACFImage;
    };
    pdfSource?: string;
}

interface PageFlipAPI {
    pageFlip(): {
        flipNext(): void;
        flipPrev(): void;
    };
}

const PDFPage = React.forwardRef<HTMLDivElement, { pageNumber: number, width: number }>((props, ref) => {
    return (
        <div className="flipbook-page" ref={ref} data-density="hard">
            <Page
                pageNumber={props.pageNumber}
                width={props.width}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={<div className="page-loader">Loading...</div>}
            />
        </div>
    );
});
PDFPage.displayName = 'PDFPage';

const Branding = ({ data, pdfSource }: BrandingProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [containerWidth, setContainerWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<PageFlipAPI>(null);
    const flipSoundRef = useRef<HTMLAudioElement | null>(null);

    // Dynamic Data extraction (no fallbacks)
    const brandingData = useMemo(() => {
        const icon = data?.sub_heading_icon;
        const iconUrl = typeof icon === 'string' ? icon : (icon && typeof icon === 'object' && 'url' in icon) ? icon.url : undefined;

        const pdf = data?.pdf_file || data?.brand_guidelines_pdf;
        const rawPdfUrl = pdfSource || (typeof pdf === 'string' ? pdf : (pdf && typeof pdf === 'object' && 'url' in pdf) ? pdf.url : undefined);

        // Always proxy absolute URLs to avoid CORS, especially on localhost
        let finalPdfUrl: string | undefined = rawPdfUrl;
        if (rawPdfUrl && (rawPdfUrl.startsWith('http') || rawPdfUrl.includes('localhost'))) {
            finalPdfUrl = `/api/proxy?url=${encodeURIComponent(rawPdfUrl)}`;
        }

        return {
            subHeading: data?.sub_heading,
            subHeadingIcon: iconUrl,
            heading: data?.heading,
            highlightText: data?.highlight_text,
            description: data?.description,
            pdfUrl: finalPdfUrl
        };
    }, [data, pdfSource]);

    // Debug Log (Development Only)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            
            
        }
    }, [data, brandingData.pdfUrl]);

    // Use a secondary check for the PDF loader worker
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const version = pdfjs.version || '4.8.52';
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        }
    }, []);

    // Initial Sound Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/audio/flip-book.mp3');
            audio.preload = 'auto';
            flipSoundRef.current = audio;
        }
    }, []);

    const playFlipSound = useCallback(() => {
        if (flipSoundRef.current) {
            flipSoundRef.current.currentTime = 0;
            flipSoundRef.current.play().catch(() => { });
        }
    }, []);

    // Responsive width calculation
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const newWidth = containerRef.current.clientWidth;
                setContainerWidth(newWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoaded(true);
    }, []);

    const pages = useMemo(() => {
        if (!numPages) return [];
        return Array.from({ length: numPages }, (_, i) => i + 1);
    }, [numPages]);

    const isMobile = containerWidth < 768;
    const bookWidth = isMobile ? containerWidth : Math.min(containerWidth, 1100);
    const pageWidth = isMobile ? bookWidth : bookWidth / 2;
    const pageHeight = pageWidth * 1.414; // A4 Aspect Ratio

    // Debug Log (Development Only)
    useEffect(() => {
        
        
    }, [data, brandingData]);

    // Only hide if BOTH heading and PDF are missing
    if (!brandingData.heading && !brandingData.pdfUrl) {
        return null;
    }

    return (
        <section className="pd-pdf-flipbook-branding section-spacing" id="sc-branding">
            <div className="container position-relative" ref={containerRef}>
                <div className="row mb-3">
                    <div className="col-12 text-center">
                        <div className="section-title section-title-center mb-0">
                            <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    {brandingData.subHeadingIcon ? (
                                        (brandingData.subHeadingIcon.trim().startsWith('<svg')) ? (
                                            <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: brandingData.subHeadingIcon }} />
                                        ) : (
                                            <picture>
                                                <img
                                                    src={brandingData.subHeadingIcon || '/images/home/brand-strategy.svg'}
                                                    alt="Icon"
                                                    width="14"
                                                    height="14"
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        )
                                    ) : (
                                        <picture>
                                            <img
                                                src="/images/home/brand-strategy.svg"
                                                alt="Icon"
                                                width="14"
                                                height="14"
                                                className="img-fluid"
                                            />
                                        </picture>
                                    )}
                                </div>
                                {brandingData.subHeading || "BRANDING DETAILS"}
                            </span>

                            {(brandingData.heading || brandingData.highlightText) && (
                                <h2>
                                    {brandingData.heading} {brandingData.highlightText && <span className="highlight">{brandingData.highlightText}</span>}
                                </h2>
                            )}

                            {brandingData.description && (
                                <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                    <div
                                        className="fs-5 mt-3"
                                        dangerouslySetInnerHTML={{ __html: brandingData.description }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="flipbook-wrapper shadow-premium" style={{ minHeight: isMobile ? '400px' : '650px' }}>
                            {!isLoaded && (
                                <div className="flipbook-loader-overlay">
                                    <div className="spinner-border text-primary me-3" role="status"></div>
                                    <span>Rendering Digital Playbook...</span>
                                </div>
                            )}

                            <div className={`flipbook-viewport ${isLoaded ? 'loaded' : ''}`}>
                                {brandingData.pdfUrl ? (
                                    <Document
                                        file={brandingData.pdfUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={(error) => console.error("PDF Load Error detail:", error)}
                                        loading={null}
                                    >
                                        {numPages && (
                                            <HTMLFlipBook
                                                ref={bookRef}
                                                width={pageWidth}
                                                height={pageHeight}
                                                size="stretch"
                                                minWidth={300}
                                                maxWidth={1200}
                                                minHeight={400}
                                                maxHeight={1600}
                                                maxShadowOpacity={0.5}
                                                showCover={true}
                                                flippingTime={1000}
                                                usePortrait={isMobile}
                                                startZIndex={0}
                                                autoSize={true}
                                                onFlip={playFlipSound}
                                                className="branding-flipbook"
                                                style={{ margin: '0 auto' }}
                                                startPage={0}
                                                drawShadow={true}
                                                mobileScrollSupport={true}
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
                                ) : (
                                    <div className="text-center p-5 text-muted">
                                        <p>Interactive digital playbook source not provided.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Branding;
