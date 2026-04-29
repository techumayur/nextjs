'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/providers';
import { WPBlogPost } from '@/types/acf';
import './css/Sidebar.css';

interface BlogCategory {
    id: number;
    name: string;
    slug: string;
    count: number;
}


// --- Widget Search ---
const WidgetSearch = ({ posts }: { posts: WPBlogPost[] }) => {
    const [query, setQuery] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const router = useRouter();
    const searchRef = React.useRef<HTMLDivElement>(null);

    const suggestions = React.useMemo(() => {
        if (!query.trim()) return [];
        return posts.filter(post => 
            post.title.rendered.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }, [query, posts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const getThumb = (post: WPBlogPost) => {
        return post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    };

    // Close suggestions on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="sidebar-widget widget-search" ref={searchRef}>
            <div className="search-form-wrap">
                <form action="#" className="sidebar-search-form" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Search blog..." 
                        aria-label="Search articles"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    <button type="submit" aria-label="Submit search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </form>

                {isOpen && query.length > 1 && (
                <div className="search-suggestions-container">
                    {suggestions.length > 0 ? (
                        suggestions.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="suggestion-item"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="suggestion-thumb">
                                    {getThumb(post) ? (
                                        <Image src={getThumb(post)!} alt="" width={40} height={40} unoptimized />
                                    ) : (
                                        <div className="thumb-placeholder" />
                                    )}
                                </div>
                                <div className="suggestion-info">
                                    <h4 className="suggestion-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h4>
                                    <span className="suggestion-cat">Article</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-suggestions-found">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="12"></line>
                                <line x1="11" y1="16" x2="11.01" y2="16"></line>
                            </svg>
                            <span>No posts found for &quot;{query}&quot;</span>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

// --- Widget Categories ---
const WidgetCategories = ({ categories }: { categories: BlogCategory[] }) => (
    <div className="sidebar-widget widget-categories">
        <h3 className="widget-title">Categories</h3>
        <ul className="category-list">
            {categories.map((cat) => (
                <li key={cat.id}>
                    <Link href={`/blog?category=${cat.slug}`}>
                        <span className="cat-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> {cat.name}
                        </span>
                        <span className="cat-count">{cat.count}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

// --- Widget Tags ---
const WidgetTags = ({ tags }: { tags: string[] }) => (
    <div className="sidebar-widget widget-tags">
        <h3 className="widget-title">Tags Cloud</h3>
        <div className="sidebar-tags-cloud">
            {tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${tag}`} className="sidebar-tag">{tag}</Link>
            ))}
        </div>
    </div>
);

// --- Widget Author ---
const WidgetAuthor = () => {
    const { theme } = useTheme();

    return (
        <div className="sidebar-widget widget-author">
            <h3 className="widget-title">Project Creator</h3>
            <div className="author-card-sidebar">
                <div className="author-header-sidebar">
                    <div className="author-portrait-sidebar">
                        <picture>
                            <Image src="/images/Techu-Mayur.png" alt="Mayur Creator" width={100} height={100} loading="lazy" />
                        </picture>
                        <div className="author-badge-sidebar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    </div>
                    <div className="author-meta-sidebar">
                        <h4 className="author-name-sidebar">Techu <span>Mayur</span></h4>
                        <p className="author-role-sidebar">Full Stack Developer</p>
                    </div>
                </div>
                <p className="author-bio-sidebar">Passionate Web Developer and SEO Expert dedicated to crafting exceptional digital experiences that perform.</p>
                <div className="author-social-sidebar">
                    {theme?.social_items?.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="Social Link"
                        >
                            {social.icon && (
                                <Image
                                    src={social.icon}
                                    alt="Social"
                                    width={18}
                                    height={18}
                                    unoptimized
                                />
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Widget Recent Posts ---
const WidgetRecentPosts = ({ posts }: { posts: WPBlogPost[] }) => (
    <div className="sidebar-widget widget-popular-posts">
        <h3 className="widget-title">Recent Articles</h3>
        <div className="popular-posts-list">
            {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="mini-post-card">
                    <div className="mini-post-thumb">
                        <Image
                            src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/images/blogs/post-thumb-fallback.jpg"}
                            alt={post.title.rendered}
                            width={150}
                            height={150}
                            unoptimized
                        />
                    </div>
                    <div className="mini-post-content">
                        <h4 className="mini-post-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <span className="mini-post-date">{new Date(post.date).toLocaleDateString('en-US')}</span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

interface BlogSidebarProps {
    categories: BlogCategory[];
    tags: string[];
    recentPosts: WPBlogPost[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ categories, tags, recentPosts }) => {
    return (
        <aside className="bd-sidebar sticky-sidebar">
            <WidgetSearch posts={recentPosts} />
            <WidgetCategories categories={categories} />
            <WidgetTags tags={tags} />
            <WidgetAuthor />
            <WidgetRecentPosts posts={recentPosts} />
        </aside>
    );
};

export default BlogSidebar;
