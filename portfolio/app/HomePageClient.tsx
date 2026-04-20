"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import dynamic from "next/dynamic";
import HomeBanner from './components/HomePage/Banner/HomeBanner';
import AboutUs, { AboutUsData } from './components/HomePage/AboutUs/AboutUs';
import Skeleton from "@/app/components/Common/Skeleton";
import { PageData, BannerSlide, ACFSkill, ACFAboutUs, ACFStats, ACFResume, ACFPortfolio, ACFCTA, ACFSkillsSection, ACFBlogsSection, ACFTipsSection, ACFCTA2, ACFTutorialsSection, ACFContactSection, ACFSourceCodeSection, WPSourceCodeItem, ACFFaqSection } from "@/types/acf";
import type { StatsData } from './components/HomePage/Stats/Stats';
import type { ResumeData } from './components/HomePage/Resume/Resume';

// --- DEFERRED COMPONENTS (Lazy-loaded on scroll) ---
const SkillsSection = dynamic(() => import('./components/HomePage/Skills/HomeSkills'), {
  loading: () => <div className="container py-5"><Skeleton type="rectangle" height={150} /></div>
});
const Stats = dynamic(() => import('./components/HomePage/Stats/Stats'), {
  loading: () => <div className="container py-5"><Skeleton type="rectangle" height={100} /></div>
});
const Resume = dynamic(() => import('./components/HomePage/Resume/Resume'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="rectangle" height={400} /></div>
});
const Portfolio = dynamic(() => import('./components/HomePage/Portfolio/Portfolio'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="grid" count={3} /></div>
});
const CTA = dynamic(() => import('./components/HomePage/CTA/CTA'), {
  loading: () => <div className="container py-5"><Skeleton type="rectangle" height={200} /></div>
});
const MySkills = dynamic(() => import('./components/HomePage/MySkills/MySkills'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="rectangle" height={300} /></div>
});
const CTA1 = dynamic(() => import('./components/HomePage/CTA1/CTA1'), {
  loading: () => <div className="container py-5"><Skeleton type="rectangle" height={200} /></div>
});
const Blogs = dynamic(() => import('./components/HomePage/Blogs/Blogs'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="grid" count={3} /></div>
});
const TipsTricks = dynamic(() => import('./components/HomePage/Tips&Tricks/Tips&Tricks'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="grid" count={3} /></div>
});
const CTA2 = dynamic(() => import('./components/HomePage/CTA2/CTA2'), {
  loading: () => <div className="container py-5"><Skeleton type="rectangle" height={300} /></div>
});
const Tutorials = dynamic(() => import('./components/HomePage/Tutorials/Tutorials'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="grid" count={2} /></div>
});
const Contact = dynamic(() => import('./components/HomePage/Contact/Contact'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="rectangle" height={400} /></div>
});
const SourceCode = dynamic(() => import('./components/HomePage/SourceCode/SourceCode'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton type="grid" count={3} /></div>
});
const FAQS = dynamic(() => import('./components/HomePage/FAQS/FAQS'), {
  loading: () => <div className="container py-5"><Skeleton type="title" /><Skeleton count={5} height={60} className="mb-2" /></div>
});

// --- HELPER COMPONENT FOR INTERSECTION OBSERVER ---
const LazySection = ({ children, height = 400 }: { children: ReactNode, height?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before it enters the viewport
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : `${height}px` }}>
      {isVisible ? children : null}
    </div>
  );
};

interface HomeProps {
  data: {
    homeData: any;
    blogs: any;
    tips: any;
    tutorials: any;
    tutorialTaxonomies: any;
    portfolioItems: any;
    portfolioTaxonomies: any;
    skillsList: any;
    skillTaxonomies: any;
    sourceCodeTaxonomies: any;
  }
}

// Since we are using "use client" for intersection observer, we fetch in a wrapper or parent
// but for simplicity and score, we can pass data from a Server Component if needed.
// However, the user's page.tsx was a Server Component. 
// We will convert the sections to lazy components in the main page.

export default function HomeClient({ data }: HomeProps) {
  const { homeData, blogs, tips, tutorials, tutorialTaxonomies, portfolioItems, portfolioTaxonomies, skillsList, skillTaxonomies, sourceCodeTaxonomies } = data;
  const { banner, skills, about_us, stats, resume, portfolio, cta, cta1, my_skills, blogs_section, tips_section, cta_2, tutorials_section, contact_section, source_code_section, faq_section, source_projects } = homeData;

  return (
    <main>
      {/* Banner is the LCP - Must load immediately */}
      <HomeBanner bannerData={banner} />
      
      {/* Below the fold sections - Optimized for Speed Index */}
      <LazySection height={200}><SkillsSection skillsData={skills} /></LazySection>
      <LazySection height={600}><AboutUs data={(about_us as unknown) as AboutUsData} /></LazySection>
      <LazySection height={300}><Stats data={(stats as unknown) as StatsData} /></LazySection>
      <LazySection height={800}><Resume data={(resume as unknown) as ResumeData} /></LazySection>
      <LazySection height={1000}><Portfolio data={portfolio} items={portfolioItems} taxonomies={portfolioTaxonomies} /></LazySection>
      <LazySection height={300}><CTA data={cta} /></LazySection>
      <LazySection height={600}><MySkills skills={skillsList} taxonomies={skillTaxonomies} sectionData={my_skills} /></LazySection>
      <LazySection height={300}><CTA1 data={cta1} /></LazySection>
      <LazySection height={800}><Blogs sectionData={blogs_section} blogs={blogs} /></LazySection>
      <LazySection height={800}><TipsTricks sectionData={tips_section} tips={tips} /></LazySection>
      <LazySection height={300}><CTA2 data={cta_2} /></LazySection>
      <LazySection height={800}><Tutorials sectionData={tutorials_section} tutorials={tutorials} taxonomies={tutorialTaxonomies} /></LazySection>
      <LazySection height={600}><Contact sectionData={contact_section} /></LazySection>
      <LazySection height={800}><SourceCode sectionData={source_code_section} projects={source_projects} taxonomies={sourceCodeTaxonomies} /></LazySection>
      <LazySection height={600}><FAQS sectionData={faq_section} /></LazySection>
    </main>
  );
}
