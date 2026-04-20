import Link from 'next/link';
import { WPBlogPost, WPTutorialTaxonomy } from '@/types/acf';
import './TipsGrid.css';

interface TipsGridProps {
    tips: WPBlogPost[];
    taxonomies: {
        categories: WPTutorialTaxonomy[];
        tags: WPTutorialTaxonomy[];
    };
}

export default function TipsGrid({ tips, taxonomies }: TipsGridProps) {
  const getImageUrl = (tip: WPBlogPost) => {
      if (tip._embedded && tip._embedded['wp:featuredmedia']) {
          return tip._embedded['wp:featuredmedia'][0].source_url;
      }
      return "";
  };

  const getCategoryInfo = (tip: WPBlogPost & { 'tips-and-trick-taxonomy'?: number[] }) => {
      const catIds = tip['tips-and-trick-taxonomy'] || [];
      if (!catIds.length) return { name: 'Tips', slug: '' };
      
      const categoryId = catIds[0];
      const category = taxonomies.categories.find(c => c.id === categoryId);
      return { 
          name: category?.name || 'Tips', 
          slug: taxonomies.categories.filter((c: WPTutorialTaxonomy) => catIds.includes(c.id)).map((c: WPTutorialTaxonomy) => c.slug).join(',') 
      };
  };

  const getTagsSlugs = (tip: WPBlogPost & { 'tips-and-trick-tags'?: number[] }) => {
      const tagIds = tip['tips-and-trick-tags'] || [];
      return taxonomies.tags.filter((t: WPTutorialTaxonomy) => tagIds.includes(t.id)).map((t: WPTutorialTaxonomy) => t.slug).join(', ');
  };

  return (
    <section id="tips-grid-section" className="section-spacing pt-5">
        <div className="container">
            {/* Tips Feed Container */}
            <div className="tips-grid" id="tips-feed">

                {/* Dynamic Tips Mapping */}
                {tips.map((tip, index) => {
                    const year = tip.date ? new Date(tip.date).getFullYear().toString() : "";
                    const catInfo = getCategoryInfo(tip);
                    const tagSlugs = getTagsSlugs(tip);
                    const author = tip._embedded?.author?.[0]?.name || "Techu Mayur";

                    return (
                        <article 
                            key={tip.id} 
                            className="tips-card" 
                            data-cat={catInfo.slug} 
                            data-year={year} 
                            data-tags={tagSlugs}
                        >
                            <Link href={`/tips-and-tricks/${tip.slug}`} className="tips-card-link">
                                <div className="tips-card-img-wrap">
                                    <img src={getImageUrl(tip)} alt={tip.title.rendered} className="tips-card-img" />
                                    <span className="tip-card-number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="tip-card-badge">{catInfo.name}</span>
                                    <div className="tips-card-reveal">
                                        <div className="primary-btn">
                                            <span className="primary-btn-icon">
                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                            </span>
                                            Read More
                                        </div>
                                    </div>
                                </div>
                                <div className="tips-card-body">
                                    <div className="tips-card-meta">
                                        <span className="tips-card-author">By {author}</span>
                                    </div>
                                    <h3 className="tips-card-title" dangerouslySetInnerHTML={{ __html: tip.title.rendered }}></h3>
                                    <div className="tip-list-btn-container">
                                        <div className="primary-btn">
                                            <span className="primary-btn-icon">
                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                            </span>
                                            Read More
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    );
                })}
            </div>

            {/* Infinite Scroll Sentinel (Matching Blog) */}
            <div id="tips-infinite-scroll-sentinel-wrap" className="mt-5">
                <div id="tips-infinite-scroll-spinner" className="is-spinner" aria-label="Loading more tips" hidden>
                    <div className="tips-skeleton-container" id="tips-skeletons"></div>
                </div>
                <div id="tips-infinite-scroll-sentinel" style={{ height: "20px" }}></div>
            </div>
        </div>
    </section>
  );
}

