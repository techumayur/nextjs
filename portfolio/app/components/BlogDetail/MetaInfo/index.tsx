import React from 'react';
import Link from 'next/link';
import { WPBlogPostExtended } from '@/types/blogs';
import './css/MetaInfo.css';

interface BlogMetaInfoProps {
  post: WPBlogPostExtended;
}

const BlogMetaInfo: React.FC<BlogMetaInfoProps> = ({ post }) => {
  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Techu Mayur";
  const authorAvatar = author?.avatar_urls?.['96'] || "/images/user-1.svg";
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const readTime = post.acf?.read_time || "8 min read";
  const viewsCount = post.acf?.views_count || "1.2K Views";
  const category = post._embedded?.['wp:term']?.[0]?.[0];

  return (
    <section id="blog-meta-info" className="section-spacing pt-0 pb-0" aria-label="Article meta information"
      itemScope itemType="https://schema.org/Article">

      {/* Hidden schema fields */}
      <meta itemProp="headline" content={post.title.rendered} />
      <meta itemProp="datePublished" content={post.date} />
      <meta itemProp="dateModified" content={post.modified} />
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <meta itemProp="image" content={post._embedded['wp:featuredmedia'][0].source_url} />
      )}

      <div className="container">
        <div className="bd-meta-bar">

          {/* Left: Author avatar + name + date */}
          <div className="bd-meta-bar__author" itemProp="author" itemScope itemType="https://schema.org/Person">
            <div className="bd-author-avatar">
              <picture>
                <img src={authorAvatar} alt={authorName} width="44" height="44" loading="lazy" className="img-fluid" itemProp="image" />
              </picture>
            </div>
            <div className="bd-author-info">
              <span className="bd-author-name" itemProp="name">{authorName}</span>
              <span className="bd-author-role">Frontend Developer &amp; Content Creator</span>
            </div>
          </div>

          {/* Divider */}
          <span className="bd-meta-bar__divider" aria-hidden="true"></span>

          {/* Right: Date · Reading time · Category */}
          <div className="bd-meta-bar__details">
            <span className="bd-meta-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <time dateTime={post.date} itemProp="datePublished">{date}</time>
            </span>

            <span className="bd-meta-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{readTime}</span>
            </span>

            {category && (
              <Link href={`/blog?category=${category.slug}`} className="bd-meta-pill bd-meta-pill--category" itemProp="articleSection">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                {category.name}
              </Link>
            )}

            <span className="bd-meta-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{viewsCount}</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogMetaInfo;
