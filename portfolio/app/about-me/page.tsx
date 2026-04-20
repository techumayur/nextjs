import React from 'react';
import AboutBanner from '../components/AboutMe/Banner/AboutBanner';
import Breadcrumb from '../components/Common/Breadcrumb';
import AboutMeIntro from '../components/AboutMe/Intro/AboutMeIntro';
import TechnicalSkills from '../components/AboutMe/Skills/TechnicalSkills';
import CareerTimeline from '../components/AboutMe/Timeline/CareerTimeline';
import Certifications from '../components/AboutMe/Certifications/Certifications';
import CoreValues from '../components/AboutMe/Values/CoreValues';
import WorkWithMe from '../components/AboutMe/WorkWithMe/WorkWithMe';
import ModernCTA from '../components/AboutMe/CTA/ModernCTA';
import { getAbout } from '../lib/getAbout';

export const metadata = {
  title: 'About Me | Web Developer & SEO Expert',
  description: 'Learn more about my journey, experience, and passion for building digital experiences that matter.',
};

export default async function AboutMe() {
  const data = await getAbout();

  if (!data) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2>About Me Data Not Available</h2>
          <p>We're having trouble fetching the about me details. Please try again later.</p>
        </div>
      </main>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'About Me', active: true }
  ];

  return (
    <main>
      <AboutBanner data={data.banner} />
      <Breadcrumb items={breadcrumbItems} />
      <AboutMeIntro data={data.intro} />
      <CoreValues data={data.core_values} />
      <WorkWithMe data={data.work_with_me} />
      <ModernCTA data={data.cta} />
      <TechnicalSkills data={data.technical_skills} />
      <Certifications data={data["certifications_&_achievements"]} />
      <CareerTimeline data={data.career_timeline} />
    </main>
  );
}
