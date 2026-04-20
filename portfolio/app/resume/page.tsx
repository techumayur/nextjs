import React from 'react';
import ResumeBanner from '@/app/components/Resume/Banner/Banner';
import Breadcrumb from '@/app/components/Common/Breadcrumb';
import ResumeFlipbook from '@/app/components/Resume/Flipbook/ResumeFlipbookWrapper';
import ResumeIntro from '@/app/components/Resume/Intro/Intro';
import RelatedBlogs from '@/app/components/Toolbox/RelatedBlogs/RelatedBlogs';
import { getBlogs } from '@/app/lib/getBlogs';
import { getResume } from '@/app/lib/getResume';


export const metadata = {
    title: 'Interactive Resume | Techu Mayur - Full Stack Developer',
    description: 'Explore my professional journey, including years of experience, landmark projects, and technical mastery through an interactive 3D flippable resume.',
};

const ResumePage = async () => {
    const blogPosts = await getBlogs();
    const resumeData = await getResume();

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Resume", active: true }
    ];

    const { banner, flipbook, intro } = resumeData;
    const resumePdf = (typeof flipbook.pdf_url === 'string') ? flipbook.pdf_url : "/docs/resume.pdf";
    const primaryBtnUrl = (typeof intro.primary_button_url === 'string' && intro.primary_button_url) ? intro.primary_button_url : resumePdf;

    return (
        <>
            
            <main className="main-content">
                <ResumeBanner
                    sub_heading={banner.sub_heading}
                    title={banner.title}
                    highlight_text={banner.highlight_text}
                    description={banner.description}
                    background_image={typeof banner.background_image === 'string' ? banner.background_image : undefined}
                />
                <Breadcrumb items={breadcrumbItems} />

                <ResumeFlipbook pdfUrl={resumePdf} />

                <ResumeIntro
                    badge_text={intro.badge_text}
                    title={intro.title}
                    subtitle={intro.subtitle}
                    stats={intro.stats}
                    cta_heading={intro.cta_heading}
                    cta_text={intro.cta_text}
                    pdf_url={primaryBtnUrl}
                    primary_btn_text={intro.primary_btn_text}
                    secondary_btn_text={intro.secondary_btn_text}
                    secondary_btn_url={intro.secondary_btn_url}
                    features={intro.features.map(f => f.feature_text)}
                />
            </main>
        </>
    );
};

export default ResumePage;

