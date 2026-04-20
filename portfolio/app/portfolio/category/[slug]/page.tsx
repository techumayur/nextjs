import React from "react";
import PortfolioBanner from "@/app/components/Portfolio/Banner/PortfolioBanner";
import Breadcrumb from "@/app/components/Common/Breadcrumb";
import PortfolioSEOCTA from "@/app/components/Portfolio/SEOCTA/PortfolioSEOCTA";
import PortfolioProjects from "@/app/components/Portfolio/Projects/PortfolioProjects";
import PortfolioCTATwo from "@/app/components/Portfolio/CTATwo/PortfolioCTATwo";
import PortfolioBrands from "@/app/components/Portfolio/Brands/PortfolioBrands";
import PortfolioBlogs from "@/app/components/Portfolio/Blogs/PortfolioBlogs";
import { getPortfolioPage } from "@/app/lib/getPortfolioPage";
import { getTaxonomyBySlug } from "@/app/lib/getPortfolio";
import { getBlogs } from "@/app/lib/getBlogs";
import { Metadata } from 'next';
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const taxonomy = await getTaxonomyBySlug(slug);
    if (!taxonomy) return { title: "Category Not Found" };

    return {
        title: `${taxonomy.name} Projects | Portfolio`,
        description: `Explore my projects in the ${taxonomy.name} category. Web Developer & SEO Expert expertise on display.`,
    };
}

const PortfolioCategoryPage = async ({ params }: CategoryPageProps) => {
    const { slug } = await params;
    const [data, taxonomy, blogPosts] = await Promise.all([
        getPortfolioPage(),
        getTaxonomyBySlug(slug),
        getBlogs()
    ]);

    if (!taxonomy) {
        notFound();
    }

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Portfolio", url: "/portfolio" },
        { label: taxonomy.name, active: true }
    ];

    return (
        <main id="portfolio-category-page" className="main-content">
            <PortfolioBanner data={data.banner} />
            <Breadcrumb items={breadcrumbItems} />
            <PortfolioSEOCTA data={data.intro} />
            {/* Pass the taxonomy ID to PortfolioProjects to pre-select this category and hide filters */}
            <PortfolioProjects 
                initialTaxId={taxonomy.id} 
                title={<>Projects in <span className="highlight">{taxonomy.name}</span></>}
                showFilters={false}
                subtitle={`Explore my professional work and projects categorized under ${taxonomy.name}.`}
            />
            <PortfolioCTATwo data={data.cta || null} />
            <PortfolioBrands data={data.our_valued_partners || null} />
            <PortfolioBlogs data={data.my_latest_blogs || null} blogs={blogPosts} />
        </main>
    );
};

export default PortfolioCategoryPage;
