'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/providers';
import { normalizeUrl } from '@/app/lib/normalizeUrl';

// ─── Arrow SVG used in primary buttons ───────────────────────────────────────

function ArrowSVG() {
  return (
    <span className="primary-btn-icon">
      <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
      </svg>
      <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
      </svg>
    </span>
  );
}

// ─── Secondary button arrow SVG ───────────────────────────────────────────────

function SecondaryArrow() {
  return (
    <svg width="15px" height="10px" viewBox="0 0 13 10" aria-hidden="true">
      <path d="M1,5 L11,5" />
      <polyline points="8 1 12 5 8 9" />
    </svg>
  );
}
interface MenuItem {
  id: string | number;
  title: string;
  url: string;
  mobile_icon?: string | { url: string };
  description?: string;
  attr_title?: string;
  title_attribute?: string;
  acf?: { description?: string };
  post_content?: string;
  badge?: string | number;
  badge_orange?: boolean | string;
  badge_new?: boolean | string;
  parent?: string | number | null;
  classes?: string[] | string;
  [key: string]: unknown;
}

interface MenuTreeNode extends MenuItem {
  children: MenuTreeNode[];
}

function buildMenuTree(items: MenuItem[]) {
  if (!items || !Array.isArray(items)) return [];
  const map: Record<string | number, MenuTreeNode> = {};
  const roots: MenuTreeNode[] = [];

  items.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  items.forEach(item => {
    if (item.parent && map[item.parent]) {
      (map[item.parent].children as MenuTreeNode[]).push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}

// ─── Hire Me animated button ──────────────────────────────────────────────────

function HireMeBtn({ href, title }: { href?: string; title?: string }) {
  return (
    <Link href={href || "#"} className="hire-btn">
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
      <span>{title}</span>
    </Link>
  );
}

// ─── Desktop Mega Menu ────────────────────────────────────────────────────────



interface DesktopMegaMenuProps {
  label: string;
  href?: string;
  items: MenuTreeNode[];
  liClassName?: string;
  classes?: string[] | string;
}

function DesktopMegaMenu({
  label,
  href = '#',
  items,
  liClassName = '',
  classes = '',
}: DesktopMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const onLeave = useCallback(() => {
    timer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const isMenuLinkActive = liClassName.includes('active');

  const getIcon = (item: MenuTreeNode) => {
    return typeof item.mobile_icon === 'string'
      ? item.mobile_icon
      : item.mobile_icon?.url;
  };

  return (
    <li
      className={`nav-item dropdown mega-dropdown ${liClassName}${open ? ' show' : ''} ${Array.isArray(classes) ? classes.filter(c => typeof c === 'string' && c.trim() !== '').join(' ') : (classes || '')}`}
      data-debug-classes={JSON.stringify(classes)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link
        href={href}
        className={`nav-link dropdown-toggle mega-menu-toggle${isMenuLinkActive ? ' active' : ''}`}
        role="button"
        aria-expanded={open}
        onClick={(e) => { if (href === '#') e.preventDefault(); }}
      >
        {label}
      </Link>

      <ul className={`dropdown-menu${open ? ' show' : ''}`}>
        <div className="mega-menu-container">
          <div className="mega-menu-grid">
            {items.map((item) => {
              const icon = getIcon(item);
              return (
                <Link key={item.id} href={normalizeUrl(item.url)} className={`mega-grid-item ${Array.isArray(item.classes) ? item.classes.join(' ') : (item.classes || '')}`}>
                  <div className="mega-grid-icon">
                    <picture>
                      {icon && (
                        <Image src={icon} alt={item.title} width={35} height={35} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                      )}
                    </picture>
                  </div>
                  <div className="mega-grid-content">
                    <div className="mega-grid-title-row">
                      <div className="mega-grid-title" dangerouslySetInnerHTML={{ __html: item.title }} />
                      {item.badge && (
                        <span className={`mega-grid-badge${item.badge_orange ? ' orange' : ''}`}>
                          {item.badge as string}
                        </span>
                      )}
                    </div>
                      { (item.description || item.attr_title || item.title_attribute || item.acf?.description || item.post_content) && (
                        <div
                          className="mega-grid-desc"
                          dangerouslySetInnerHTML={{ __html: (item.description || item.attr_title || item.title_attribute || item.acf?.description || item.post_content) as string }}
                        />
                      )}
                    </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ul>
    </li>
  );
}

// ─── Mobile Accordion ─────────────────────────────────────────────────────────

interface MobileAccItem {
  href: string;
  icon: string;
  title: string;
  desc?: string;
  badge?: string;
  badgeNew?: boolean;
}

interface MobileAccordionProps {
  id: string;
  icon: string;
  label: string;
  parentId: string;
  items: MenuTreeNode[];
  normalizeUrl: (url: string) => string;
  active?: boolean;
  onClose?: () => void;
  classes?: string[] | string;
}

function MobileAccordion({ id, icon, label, parentId, items, normalizeUrl, active, onClose, classes = '' }: MobileAccordionProps) {
  const [open, setOpen] = useState(false);

  const getIcon = (item: MenuTreeNode) => {
    return typeof item.mobile_icon === 'string'
      ? item.mobile_icon
      : item.mobile_icon?.url;
  };

  return (
    <li className={`accordion ${Array.isArray(classes) ? classes.join(' ') : classes}`} id={parentId}>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={`accordion-button${open ? '' : ' collapsed'}${active ? ' active' : ''}`}
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((p) => !p)}
          >
            <span className="mobile-nav-icon">
              <picture>
                {icon && (
                  <Image src={icon} alt={label} width={20} height={20} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                )}
              </picture>
            </span>
            {label}
          </button>
        </h2>
        <div id={id} className={`accordion-collapse${open ? ' show' : ' collapse'}`}>
          <div className="accordion-body">
            <ul className="mega-menu-list">
              {items.map((item) => {
                const icon = getIcon(item);
                return (
                  <li key={item.id} className="mega-menu-item">
                    <Link href={normalizeUrl(item.url)} className="mega-menu-link" onClick={onClose}>
                      <div className="mega-menu-icon">
                        <picture>
                          {icon && (
                            <Image src={icon} alt={item.title} width={30} height={30} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                          )}
                        </picture>
                      </div>
                      <div className="mega-menu-content">
                        <span className="mega-menu-title" dangerouslySetInnerHTML={{ __html: item.title }} />
                        {(item.description || item.attr_title || item.title_attribute || item.acf?.description || item.post_content) && (
                          <span className="mega-menu-desc" dangerouslySetInnerHTML={{ __html: (item.description || item.attr_title || item.title_attribute || item.acf?.description || item.post_content) as string }} />
                        )}
                      </div>
                      {item.badge && (
                        <span className={`mega-menu-badge${item.badge_new || item.badge_orange ? ' new' : ''}`}>{item.badge as string}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────



// Popular AI Tools shared between Resources and Tech





// ─── Main Header ──────────────────────────────────────────────────────────────


export default function Header({ menuData = [] }: { menuData?: MenuItem[] }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState<'nav-down' | 'nav-up'>('nav-down');
  const lastScrollTop = useRef(0);
  const delta = 5;

  // Build the menu tree from flat WordPress data
  const menuTree = buildMenuTree(menuData);

  const isActive = (path: string) => {
    const relativePath = normalizeUrl(path);
    if (relativePath === '/' && pathname === '/') return true;
    if (relativePath !== '/' && pathname.startsWith(relativePath)) return true;
    return false;
  };

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const st = window.pageYOffset || document.documentElement.scrollTop;
          const header = headerRef.current;
          if (!header) {
            ticking = false;
            return;
          }
          const navbarHeight = header.offsetHeight;

          if (Math.abs(lastScrollTop.current - st) > delta) {
            if (st > lastScrollTop.current && st > navbarHeight) {
              setScrollDir('nav-up');
            } else {
              if (st + window.innerHeight < document.documentElement.scrollHeight) {
                setScrollDir('nav-down');
              }
            }
            lastScrollTop.current = st <= 0 ? 0 : st;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape key closes offcanvas
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOffcanvasOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when offcanvas open
  useEffect(() => {
    const documentBody = document.body;
    documentBody.style.overflow = offcanvasOpen ? 'hidden' : '';
    return () => { documentBody.style.overflow = ''; };
  }, [offcanvasOpen]);

  return (
    <header id="navigation_bar" className={scrollDir} ref={headerRef}>
      <nav className="navbar navbar-expand-xl">
        <div className="container p-md-0">

          {/* ── Logo ── */}
          <Link className="navbar-brand" href="/">
            <picture>
              {(typeof theme?.header_logo === 'string' ? theme.header_logo : theme?.header_logo?.url) && (
                <Image
                  src={typeof theme?.header_logo === 'string' ? theme.header_logo : theme?.header_logo?.url || ""}
                  alt={theme?.header_logo_alt || ""}
                  width={200}
                  height={67}
                  priority
                  loading="eager"
                  unoptimized
                  className="img-fluid"
                  style={{ height: 'auto' }}
                />
              )}
            </picture>
          </Link>

          {/* ── Hamburger toggle ── */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
            aria-expanded={offcanvasOpen}
            onClick={() => setOffcanvasOpen(true)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* ── Offcanvas backdrop ── */}
          {offcanvasOpen && (
            <div
              className="offcanvas-backdrop fade show"
              onClick={() => setOffcanvasOpen(false)}
            />
          )}

          {/* ── Offcanvas panel ── */}
          <div
            className={`offcanvas offcanvas-end${offcanvasOpen ? ' show' : ''}`}
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            style={{ visibility: offcanvasOpen ? 'visible' : 'hidden' }}
          >
            {/* Offcanvas Header */}
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <picture>
                  {(theme?.header_logo_white || theme?.header_logo) && (
                    <Image
                      src={
                        (typeof theme?.header_logo_white === 'string' ? theme.header_logo_white : theme?.header_logo_white?.url) || 
                        (typeof theme?.header_logo === 'string' ? theme.header_logo : theme?.header_logo?.url) || 
                        ""
                      }
                      alt={theme?.header_logo_alt || ""}
                      width={200}
                      height={67}
                      unoptimized
                      className="img-fluid white-image"
                      style={{ height: 'auto' }}
                    />
                  )}
                </picture>
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setOffcanvasOpen(false)}
              >
                <picture>
                  <Image src="/images/menu/close.svg" alt="Close" width={40} height={40} className="img-fluid" style={{ height: 'auto' }} />
                </picture>
              </button>
            </div>

            {/* Offcanvas Body */}
            <div className="offcanvas-body">

              {/* ════════════════════════════════════════════════════════
                  DESKTOP NAV  (hidden on mobile, visible ≥xl)
              ════════════════════════════════════════════════════════ */}
              <div className="d-none d-xl-flex w-100">
                <ul className="navbar-nav justify-content-end flex-grow-1">
                  {menuTree.map((item: MenuTreeNode) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <DesktopMegaMenu
                          key={item.id}
                          label={item.title}
                          href={normalizeUrl(item.url)}
                          items={item.children}
                          liClassName={isActive(item.url) ? 'active' : ''}
                          classes={item.classes || ''}
                        />
                      );
                    }

                    return (
                      <li key={item.id} className={`nav-item ${item.classes ? (Array.isArray(item.classes) ? item.classes.filter(c => typeof c === 'string' && c.trim() !== '').join(' ') : item.classes) : ''}`} data-debug-classes={JSON.stringify(item.classes)}>
                        <Link className={`nav-link${isActive(item.url) ? ' active' : ''}`} href={normalizeUrl(item.url)} dangerouslySetInnerHTML={{ __html: item.title }} />
                      </li>
                    );
                  })}

                  <li className="nav-item">
                    {theme?.hire_me_text && (
                      <HireMeBtn
                        title={theme.hire_me_text}
                        href={normalizeUrl(theme.hire_me_button_url || "")}
                      />
                    )}
                  </li>
                </ul>
              </div>

              {/* ════════════════════════════════════════════════════════
                  MOBILE NAV  (hidden on desktop, visible <xl)
              ════════════════════════════════════════════════════════ */}
              <div className="d-block d-xl-none">
                <ul className="mobile-nav-list">
                  {menuTree.map((item: MenuTreeNode) => {
                    const icon = typeof item.mobile_icon === 'string' ? item.mobile_icon : item.mobile_icon?.url || '';

                    if (item.children && item.children.length > 0) {
                      return (
                        <MobileAccordion
                          key={item.id}
                          id={`menu-${item.id}`}
                          parentId="mainAccordion"
                          icon={icon}
                          label={item.title}
                          items={item.children}
                          normalizeUrl={normalizeUrl}
                          active={isActive(item.url)}
                          onClose={() => setOffcanvasOpen(false)}
                          classes={item.classes || ''}
                        />
                      );
                    }

                    return (
                      <li key={item.id} className={`mobile-nav-item ${item.classes ? (Array.isArray(item.classes) ? item.classes.filter(c => typeof c === 'string' && c.trim() !== '').join(' ') : item.classes) : ''}`}>
                        <Link
                          href={normalizeUrl(item.url)}
                          className={`mobile-nav-link${isActive(item.url) ? ' active' : ''}`}
                          onClick={() => setOffcanvasOpen(false)}
                        >
                          <span className="mobile-nav-icon">
                            <picture>
                              {(typeof item.mobile_icon === 'string' ? item.mobile_icon : item.mobile_icon?.url) && (
                                <Image
                                  src={typeof item.mobile_icon === 'string' ? item.mobile_icon : item.mobile_icon?.url || ''}
                                  alt={item.title}
                                  width={20}
                                  height={20}
                                  loading="lazy"
                                  className="img-fluid"
                                  style={{ height: 'auto' }}
                                />
                              )}
                            </picture>
                          </span>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Hire Me */}
                <div className="text-center">
                  {theme?.hire_me_text && (
                    <HireMeBtn
                      title={theme.hire_me_text}
                      href={normalizeUrl(theme.hire_me_button_url || "")}
                    />
                  )}
                </div>

                {/* Social Links */}
                <div className="social-links">
                  {theme?.social_items?.map(({ icon, link }: { icon?: string; link?: string }, idx: number) => (
                    icon && link && (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label={link}
                      >
                        <Image src={icon} alt={link} width={30} height={30} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                      </a>
                    )
                  ))}
                </div>
              </div>
              {/* End mobile nav */}

            </div>
            {/* End offcanvas body */}
          </div>
          {/* End offcanvas */}

        </div>
      </nav>
    </header>
  );
}