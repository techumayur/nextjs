"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicFlipbook = dynamic(() => import('./ResumeFlipbook'), {
    ssr: false,
    loading: () => (
        <div className="text-center p-5 border rounded" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
            <div className="spinner-border text-primary me-3" role="status"></div>
            <span>Preparing Interactive Resume...</span>
        </div>
    )
});

interface Props {
    pdfUrl: string;
}

const ResumeFlipbookWrapper = (props: Props) => {
    return <DynamicFlipbook {...props} />;
};

export default ResumeFlipbookWrapper;
