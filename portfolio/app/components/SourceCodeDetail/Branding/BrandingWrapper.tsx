"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Browser-only library wrapper for the PDF flipbook
const DynamicBrandingFlipbook = dynamic(() => import('./Branding'), {
    ssr: false,
    loading: () => (
        <div className="pd-pdf-flipbook-branding section-spacing">
            <div className="container">
                <div className="text-center p-5 border rounded-4 bg-light shadow-sm" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner-border text-primary me-3" role="status"></div>
                    <span className="fw-bold text-muted">Preparing Interactive Playbook...</span>
                </div>
            </div>
        </div>
    )
});

import { ACFImage } from '@/types/acf';

interface BrandingWrapperProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        highlight_text?: string;
        description?: string;
        pdf_file?: ACFImage;
    };
    pdfSource?: string;
}

const BrandingWrapper: React.FC<BrandingWrapperProps> = (props) => {
    return <DynamicBrandingFlipbook {...props} />;
};

export default BrandingWrapper;
