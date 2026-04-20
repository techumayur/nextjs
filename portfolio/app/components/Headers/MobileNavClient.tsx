'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Accordion item for mobile mega-menus ────────────────────────────────────

interface MobileAccordionItem {
  href: string;
  icon: string;
  title: string;
  desc?: string;
  badge?: string;
}

interface MobileAccordionProps {
  id: string;
  icon: string;
  label: string;
  items: MobileAccordionItem[];
}

function MobileAccordion({ id, icon, label, items }: MobileAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="accordion" id={`${id}Accordion`}>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={`accordion-button${expanded ? '' : ' collapsed'}`}
            type="button"
            aria-expanded={expanded}
            aria-controls={`${id}Menu`}
            onClick={() => setExpanded((p) => !p)}
          >
            <span className="mobile-nav-icon">
              <Image src={icon} alt={label} width={20} height={20} loading="lazy" />
            </span>
            {label}
          </button>
        </h2>

        {/* Pure CSS-height animate collapse — no Bootstrap JS needed */}
        <div
          id={`${id}Menu`}
          className={`accordion-collapse${expanded ? ' show' : ' collapse'}`}
        >
          <div className="accordion-body">
            <ul className="mega-menu-list">
              {items.map((item) => (
                <li key={item.href} className="mega-menu-item">
                  <Link href={item.href} className="mega-menu-link">
                    <div className="mega-menu-icon">
                      <Image src={item.icon} alt={item.title} width={30} height={30} loading="lazy" />
                    </div>
                    <div className="mega-menu-content">
                      <span className="mega-menu-title">{item.title}</span>
                      {item.desc && <span className="mega-menu-desc">{item.desc}</span>}
                    </div>
                    {item.badge && <span className="mega-menu-badge">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── HireMe animated button ──────────────────────────────────────────────────

function HireMeBtn({ className = '' }: { className?: string }) {
  return (
    <Link href="/contact-me" className={`hire-btn ${className}`}>
      <div>
        <div className="pencil" />
        <div className="folder">
          <div className="top">
            <svg viewBox="0 0 24 27" aria-hidden="true">
              <path d="M1,0 L23,0 C23.55,0 24,0.45 24,1 L24,8.17 C24,8.7 23.79,9.21 23.41,9.59 L20.59,12.41 C20.21,12.79 20,13.3 20,13.83 L20,26 C20,26.55 19.55,27 19,27 L1,27 C0.45,27 0,26.55 0,26 L0,1 C0,0.45 0.45,0 1,0 Z" />
            </svg>
          </div>
          <div className="paper" />
        </div>
      </div>
      <span>Hire Me</span>
    </Link>
  );
}

// ─── Social links data ───────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/techumayur', label: 'Facebook', icon: '/images/social-media/facebook.svg' },
  { href: 'https://www.instagram.com/techumayur', label: 'Instagram', icon: '/images/social-media/instagram.svg' },
  { href: 'https://x.com/techumayur', label: 'Twitter (X)', icon: '/images/social-media/twitter.svg' },
  { href: 'https://www.linkedin.com/in/techumayur', label: 'LinkedIn', icon: '/images/social-media/linkedin.svg' },
  { href: 'https://www.youtube.com/@techumayur', label: 'YouTube', icon: '/images/social-media/youtube.svg' },
  { href: 'https://github.com/techumayur', label: 'GitHub', icon: '/images/social-media/github.svg' },
] as const;

// ─── Portfolio accordion items ───────────────────────────────────────────────

const PORTFOLIO_ITEMS: MobileAccordionItem[] = [
  { href: '/portfolio/html-css-js', icon: '/images/menu/html-css-js.svg', title: 'HTML / CSS / JS', desc: 'Static websites & styling projects', badge: 'Popular' },
  { href: '/portfolio/bootstrap', icon: '/images/menu/bootstrap.svg', title: 'Bootstrap', desc: 'Responsive framework projects' },
  { href: '/portfolio/php-codeigniter', icon: '/images/menu/php.svg', title: 'PHP / CodeIgniter', desc: 'Dynamic web applications' },
  { href: '/portfolio/wordpress', icon: '/images/menu/wordpress.svg', title: 'WordPress', desc: 'CMS & theme development', badge: 'New' },
  { href: '/portfolio/reactjs', icon: '/images/menu/reactjs.svg', title: 'React JS', desc: 'Modern JavaScript applications' },
  { href: '/portfolio/nextjs', icon: '/images/menu/nextjs.svg', title: 'Next JS', desc: 'Server-side React framework' },
  { href: '/portfolio/angularjs', icon: '/images/menu/angularjs.svg', title: 'Angular JS', desc: 'Enterprise web applications' },
];

const RESOURCES_ITEMS: MobileAccordionItem[] = [
  { href: '/blogs', icon: '/images/menu/blog.svg', title: 'Blog' },
  { href: '/toolbox', icon: '/images/menu/toolbox.svg', title: 'Toolbox' },
  { href: '/faq', icon: '/images/menu/faq.svg', title: 'FAQ' },
];

const TECH_ITEMS: MobileAccordionItem[] = [
  { href: '/tips-tricks', icon: '/images/menu/tips.svg', title: 'Tips & Tricks' },
  { href: '/tutorials', icon: '/images/menu/tutorials.svg', title: 'Tutorials' },
  { href: '/source-code', icon: '/images/menu/source-code.svg', title: 'Source Code' },
];

// ─── Main export ─────────────────────────────────────────────────────────────

export default function MobileNavClient() {
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  // Close offcanvas on route change (escape key)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOffcanvasOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when offcanvas is open
  useEffect(() => {
    document.body.style.overflow = offcanvasOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [offcanvasOpen]);

  return (
    <>
      {/* ── Hamburger toggle (visible <xl) ── */}
      <button
        className="navbar-toggler d-xl-none"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={offcanvasOpen}
        onClick={() => setOffcanvasOpen(true)}
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* ── Backdrop ── */}
      {offcanvasOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOffcanvasOpen(false)}
        />
      )}

      {/* ── Offcanvas drawer ── */}
      <div
        className={`offcanvas offcanvas-end${offcanvasOpen ? ' show' : ''}`}
        tabIndex={-1}
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        style={{ visibility: offcanvasOpen ? 'visible' : 'hidden' }}
      >
        {/* Header */}
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            <Image
              src="/images/logo-white.svg"
              alt="Techu Mayur"
              width={160}
              height={54}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setOffcanvasOpen(false)}
          >
            <Image src="/images/menu/close.svg" alt="Close" width={40} height={40} loading="lazy" />
          </button>
        </div>

        {/* Body */}
        <div className="offcanvas-body">
          <ul className="mobile-nav-list">
            {/* Home */}
            <li className="mobile-nav-item">
              <Link href="/" className="mobile-nav-link" onClick={() => setOffcanvasOpen(false)}>
                <span className="mobile-nav-icon">
                  <Image src="/images/menu/home.svg" alt="Home" width={20} height={20} loading="lazy" />
                </span>
                Home
              </Link>
            </li>

            {/* About Me */}
            <li className="mobile-nav-item">
              <Link href="/about-me" className="mobile-nav-link" onClick={() => setOffcanvasOpen(false)}>
                <span className="mobile-nav-icon">
                  <Image src="/images/menu/about-me.svg" alt="About Me" width={20} height={20} loading="lazy" />
                </span>
                About Me
              </Link>
            </li>

            {/* Portfolio accordion */}
            <MobileAccordion
              id="portfolio"
              icon="/images/menu/portfolio.svg"
              label="Portfolio"
              items={PORTFOLIO_ITEMS}
            />

            {/* Resume */}
            <li className="mobile-nav-item">
              <Link href="/resume" className="mobile-nav-link" onClick={() => setOffcanvasOpen(false)}>
                <span className="mobile-nav-icon">
                  <Image src="/images/menu/resume.svg" alt="Resume" width={20} height={20} loading="lazy" />
                </span>
                Resume
              </Link>
            </li>

            {/* Resources accordion */}
            <MobileAccordion
              id="resources"
              icon="/images/menu/resources.svg"
              label="Resources"
              items={RESOURCES_ITEMS}
            />

            {/* Tech accordion */}
            <MobileAccordion
              id="tech"
              icon="/images/menu/tech.svg"
              label="Tech"
              items={TECH_ITEMS}
            />

            {/* Contact Me */}
            <li className="mobile-nav-item">
              <Link href="/contact-me" className="mobile-nav-link" onClick={() => setOffcanvasOpen(false)}>
                <span className="mobile-nav-icon">
                  <Image src="/images/menu/contact-me.svg" alt="Contact Me" width={20} height={20} loading="lazy" />
                </span>
                Contact Me
              </Link>
            </li>
          </ul>

          {/* Hire Me */}
          <div className="text-center">
            <HireMeBtn />
          </div>

          {/* Social links */}
          <div className="social-links">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={label}
              >
                <Image src={icon} alt={label} width={30} height={30} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
