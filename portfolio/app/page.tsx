import { getHome } from './lib/getHome';
import { getPortfolioItems, getPortfolioTaxonomies } from './lib/getPortfolio';
import { getSkills, getSkillTaxonomies } from './lib/getSkills';
import { getBlogs } from './lib/getBlogs';
import { getTips } from './lib/getTips';
import { getTutorials, getTutorialTaxonomies } from './lib/getTutorials';
import { getSourceCodeTaxonomies } from './lib/getSourceCode';
import HomeClient from './HomePageClient';

export const revalidate = 3600; // Cache for 1 hour to reduce server load

export default async function Home() {
  const [
    homeData,
    blogs,
    tips,
    tutorials,
    tutorialTaxonomies,
    portfolioItems,
    portfolioTaxonomies,
    skillsList,
    skillTaxonomies,
    sourceCodeTaxonomies
  ] = await Promise.all([
    getHome(),
    getBlogs(),
    getTips(),
    getTutorials(),
    getTutorialTaxonomies(),
    getPortfolioItems(),
    getPortfolioTaxonomies(),
    getSkills(),
    getSkillTaxonomies(),
    getSourceCodeTaxonomies()
  ]);

  const data = {
    homeData,
    blogs,
    tips,
    tutorials,
    tutorialTaxonomies,
    portfolioItems,
    portfolioTaxonomies,
    skillsList,
    skillTaxonomies,
    sourceCodeTaxonomies
  };

  return <HomeClient data={data} />;
}
