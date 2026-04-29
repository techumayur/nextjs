import { MetadataRoute } from 'next';
import { getBlogs } from './lib/getBlogs';
import { getPortfolioItems } from './lib/getPortfolio';
import { getTips } from './lib/getTips';
import { getTutorials } from './lib/getTutorials';
import { getSourceCode } from './lib/getSourceCode';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.techumayur.in';

  // Helper to ensure we always have a valid date for sitemap
  const safeDate = (dateStr: string | number | undefined | null): Date => {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  // Fetch all dynamic data in parallel with fallbacks to empty arrays
  const [blogsData, projectsData, tipsData, tutorialsData, sourceCodeData] = await Promise.all([
    getBlogs().catch(() => []),
    getPortfolioItems(1, 100).catch(() => []),
    getTips().catch(() => []),
    getTutorials().catch(() => []),
    getSourceCode().catch(() => []),
  ]);

  const blogs = Array.isArray(blogsData) ? blogsData : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const tips = Array.isArray(tipsData) ? tipsData : [];
  const tutorials = Array.isArray(tutorialsData) ? tutorialsData : [];
  const sourceCode = Array.isArray(sourceCodeData) ? sourceCodeData : [];

  // Static routes
  const staticRoutes = [
    '',
    '/about-me',
    '/contact-me',
    '/resume',
    '/toolbox',
    '/faq',
    '/sitemap',
    '/privacy-policy',
    '/terms-conditions',
    '/portfolio',
    '/blogs',
    '/tutorials',
    '/source-code',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes with safe date handling
  const blogRoutes = blogs.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: safeDate(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const portfolioRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: safeDate(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tipsRoutes = tips.map((tip) => ({
    url: `${baseUrl}/tips-and-tricks/${tip.slug}`,
    lastModified: safeDate(tip.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const sourceCodeRoutes = sourceCode.map((item) => ({
    url: `${baseUrl}/source-code/${item.slug}`,
    lastModified: safeDate(item.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tutorialsRoutes = tutorials.map((item) => ({
    url: `${baseUrl}/tutorials/${item.slug}`,
    lastModified: safeDate(item.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...portfolioRoutes,
    ...tipsRoutes,
    ...sourceCodeRoutes,
    ...tutorialsRoutes,
  ];
}
