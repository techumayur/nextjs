import React from 'react';
import { Metadata } from 'next';
import BlogBanner from '@/app/components/Blogs/Banner/BlogBanner';
import BlogInsights from '@/app/components/Blogs/Insights/BlogInsights';
import LatestBlogs from '@/app/components/Blogs/LatestBlogs/LatestBlogs';
import BlogList from '@/app/components/Blogs/BlogList/BlogList';
import Breadcrumb from '@/app/components/Common/Breadcrumb';

import { getBlogsPage } from '@/app/lib/getBlogsPage';
import type { BlogPageData } from '@/types/blogs';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { pageData } = await getBlogsPage();
        return {
            title: pageData.banner_section?.heading || 'Blog – Insights on Web Development, SEO & Tech | Techu Mayur',
            description: pageData.banner_section?.content || 'Explore my latest blogs on web development, SEO, and tech tips. Insights and tutorials to grow your digital skills.',
        };
    } catch {
        return {
            title: 'Blog – Insights on Web Development, SEO & Tech | Techu Mayur',
            description: 'Explore my latest blogs on web development, SEO, and tech tips. Insights and tutorials to grow your digital skills.',
        };
    }
}

const BlogPage = async () => {
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Blogs", active: true }
    ];

    let data;
    try {
        data = await getBlogsPage();
    } catch (error) {
        console.error("Failed to fetch blog page data:", error);
        data = { pageData: {} as BlogPageData, posts: [], categories: [] };
    }

    const { pageData, posts, categories } = data;

    return (
        <main id="blog-main">
            <BlogBanner data={pageData?.banner_section} />
            <Breadcrumb items={breadcrumbItems} />
            <BlogInsights data={pageData?.insights_section} />
            <LatestBlogs data={pageData?.latest_blogs_section} posts={posts} />
            <BlogList config={pageData?.blog_list_section} posts={posts} categories={categories} />
        </main>
    );
};

export default BlogPage;
