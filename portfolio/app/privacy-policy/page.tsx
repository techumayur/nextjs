import React from 'react';
import LegalPage from '@/app/components/Legal/LegalPage';
import '@/app/components/Legal/LegalPage.css';
import type { Metadata } from 'next';
import { getLegalPage } from '@/app/lib/getLegalPage';
import { notFound } from 'next/navigation';
import { parseHtml } from '@/app/lib/parseHtml';

export async function generateMetadata(): Promise<Metadata> {
    const data = await getLegalPage('privacy-policy');
    return {
        title: data?.acf?.banner_heading || 'Privacy Policy',
        description: data?.acf?.banner_sub_heading || 'Learn how Techu Mayur collects, uses, and protects your personal information.',
    };
}

export default async function PrivacyPage() {
    const data = await getLegalPage('privacy-policy');

    if (!data) {
        return notFound();
    }

    const { acf } = data;

    return (
        <LegalPage
            pageId="privacy"
            badge={acf.banner_sub_heading || "Privacy"}
            badgeIcon={acf.banner_sub_heading_image as string}
            title={acf.banner_heading || data.title.rendered}
            subtitle={acf.banner_content}
            lastUpdated={acf.last_updated}
            backgroundImage={acf.background_image as string}
            breadcrumbs={[
                { label: 'Home', url: '/' },
                { label: 'Privacy Policy', active: true },
            ]}
        >
            {acf.content && typeof acf.content === 'string' && (
                <div dangerouslySetInnerHTML={{ __html: parseHtml(acf.content) }} />
            )}
        </LegalPage>
    );
}
