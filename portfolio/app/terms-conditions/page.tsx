import React from 'react';
import LegalPage from '@/app/components/Legal/LegalPage';
import '@/app/components/Legal/LegalPage.css';
import type { Metadata } from 'next';
import { getLegalPage } from '@/app/lib/getLegalPage';
import { notFound } from 'next/navigation';
import { parseHtml } from '@/app/lib/parseHtml';

export async function generateMetadata(): Promise<Metadata> {
    const data = await getLegalPage('terms-conditions');
    return {
        title: data?.acf?.banner_heading || 'Terms & Conditions',
        description: data?.acf?.banner_sub_heading || "Read the Terms and Conditions for using Techu Mayur's website, services, and content.",
    };
}

export default async function TermsPage() {
    const data = await getLegalPage('terms-conditions');

    if (!data) {
        return notFound();
    }

    const { acf } = data;

    return (
        <LegalPage
            pageId="terms"
            badge={acf.banner_sub_heading || "Legal"}
            badgeIcon={acf.banner_sub_heading_image as string}
            title={acf.banner_heading || data.title.rendered}
            subtitle={acf.banner_content}
            lastUpdated={acf.last_updated}
            backgroundImage={acf.background_image as string}
            breadcrumbs={[
                { label: 'Home', url: '/' },
                { label: 'Terms & Conditions', active: true },
            ]}
        >
            {acf.content && typeof acf.content === 'string' && (
                <div dangerouslySetInnerHTML={{ __html: parseHtml(acf.content) }} />
            )}
        </LegalPage>
    );
}
