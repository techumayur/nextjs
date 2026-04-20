import { MetadataRoute } from 'next';
import { getBlogs } from './lib/getBlogs';
import { getPortfolioItems } from './lib/getPortfolio';
import { getTips } from './lib/getTips';
import { getTutorials } from './lib/getTutorials';
import { getSourceCode } from './lib/getSourceCode';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.techumayur.in';

  // Fetch all dynamic data in parallel
  const [blogs, projects, tips, tutorials, sourceCode] = await Promise.all([
    getBlogs(),
    getPortfolioItems(1, 100),
    getTips(),
    getTutorials(),
    getSourceCode(),
  ]);

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

  // Dynamic routes
  const blogRoutes = blogs.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const portfolioRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tipsRoutes = tips.map((tip) => ({
    url: `${baseUrl}/tips-and-tricks/${tip.slug}`,
    lastModified: new Date(tip.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const sourceCodeRoutes = sourceCode.map((item) => ({
    url: `${baseUrl}/source-code/${item.slug}`,
    lastModified: new Date(item.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...portfolioRoutes,
    ...tipsRoutes,
    ...sourceCodeRoutes,
  ];
}
