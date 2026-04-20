"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { WPPortfolioItem } from '@/types/acf';

// This is a "Client-Side ONLY" wrapper component.
// Because it calls next/dynamic with { ssr: false }, and it has "use client",
// it's the correct place to isolate browser-only libraries.
const DynamicFlipbook = dynamic(() => import('./BrandGuidelines'), {
    ssr: false,
    loading: () => (
        <div className="text-center p-5 border rounded" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-primary me-3" role="status"></div>
            <span>Preparing Interactive Playbook...</span>
        </div>
    )
});

interface Props {
    project?: WPPortfolioItem;
    pdfSource?: string;
}

const BrandGuidelinesWrapper = (props: Props) => {
    return <DynamicFlipbook {...props} />;
};

export default BrandGuidelinesWrapper;
