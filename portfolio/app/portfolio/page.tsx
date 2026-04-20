import React from 'react';
import { getPortfolioPage } from "@/app/lib/getPortfolioPage";
import PortfolioBanner from "@/app/components/Portfolio/Banner/PortfolioBanner";
import Breadcrumb from "@/app/components/Common/Breadcrumb";
import PortfolioSEOCTA from "@/app/components/Portfolio/SEOCTA/PortfolioSEOCTA";
import PortfolioProjects from "@/app/components/Portfolio/Projects/PortfolioProjects";
import PortfolioCTATwo from "@/app/components/Portfolio/CTATwo/PortfolioCTATwo";
import PortfolioBrands from "@/app/components/Portfolio/Brands/PortfolioBrands";
import PortfolioBlogs from "@/app/components/Portfolio/Blogs/PortfolioBlogs";
import { getBlogs } from "@/app/lib/getBlogs";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Explore the journey and projects of Techu Mayur, Web Developer & SEO Expert.",
};

const PortfolioPage = async () => {
    const portfolioData = await getPortfolioPage();
    const blogPosts = await getBlogs();

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Portfolio", active: true }
    ];

    return (
        <main id="portfolio-page" className="main-content">
            <PortfolioBanner data={portfolioData.banner} />
            <Breadcrumb items={breadcrumbItems} />
            <PortfolioSEOCTA data={portfolioData.intro} />
            <PortfolioProjects 
                title={portfolioData.all_projects?.title}
                subtitle={portfolioData.all_projects?.sub_heading}
                description={portfolioData.all_projects?.description}
                showFilters={portfolioData.all_projects?.show_filters}
            />
            <PortfolioCTATwo data={portfolioData.cta || null} />
            <PortfolioBrands data={portfolioData.our_valued_partners || null} />
            <PortfolioBlogs data={portfolioData.my_latest_blogs || null} blogs={blogPosts} />
        </main>
    );
};

export default PortfolioPage;
