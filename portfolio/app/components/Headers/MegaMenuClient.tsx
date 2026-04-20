'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ──────────────────────────────────────────────────────────────────

interface MegaNavItem {
  id: string;
  icon: string;
  title: string;
  desc?: string;
  badge?: { text: string; variant: 'orange' | 'default' };
}

interface ContentPanel {
  id: string;
  image: string;
  badge: string;
  title: string;
  desc: string;
  features?: string[];
  link: string;
  linkText: string;
}

interface MegaMenuProps {
  label: string;
  href?: string;
  navItems: MegaNavItem[];
  contentPanels: ContentPanel[];
  /** Optional extra slot rendered below nav items (e.g. Popular AI Tools) */
  extraSlot?: React.ReactNode;
  /** CSS transforms like translateX(-60%) for positioning */
  menuClass?: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PrimaryBtnArrow() {
  return (
    <>
      <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
      </svg>
      <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
      </svg>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MegaMenuClient({
  label,
  href = '#',
  navItems,
  contentPanels,
  extraSlot,
  menuClass = '',
}: MegaMenuProps) {
  const [activePanel, setActivePanel] = useState<string>(navItems[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const currentPanel = contentPanels.find((p) => p.id === activePanel);

  return (
    <li
      className={`nav-item dropdown mega-dropdown ${menuClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger link */}
      <Link
        href={href}
        className="nav-link dropdown-toggle mega-menu-toggle"
        aria-expanded={open}
        onClick={(e) => href === '#' && e.preventDefault()}
      >
        {label}
      </Link>

      {/* Dropdown panel */}
      <ul className={`dropdown-menu${open ? ' show' : ''}`} style={{ display: open ? 'block' : 'none' }}>
        <div className="mega-menu-container">
          {/* ── Left: Category nav ── */}
          <div className="mega-nav" role="listbox" aria-label="Category navigation">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`mega-nav-item${activePanel === item.id ? ' active' : ''}`}
                onMouseEnter={() => setActivePanel(item.id)}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActivePanel(item.id)}
                aria-selected={activePanel === item.id}
              >
                <div className="mega-nav-icon">
                  <Image src={item.icon} alt={item.title} width={30} height={30} loading="lazy" />
                </div>
                <div className="mega-nav-content">
                  <div className="mega-nav-title">{item.title}</div>
                  {item.desc && <div className="mega-nav-desc">{item.desc}</div>}
                </div>
                {item.badge && (
                  <span className={`mega-nav-badge${item.badge.variant === 'orange' ? ' orange' : ''}`}>
                    {item.badge.text}
                  </span>
                )}
              </div>
            ))}

            {/* Slot for extra content like AI tools */}
            {extraSlot}
          </div>

          {/* ── Right: Content panel ── */}
          <div className="mega-content">
            {currentPanel && (
              <div className="content-panel active">
                <div className="content-details">
                  <div className="details-header">
                    <div className="details-title-row">
                      <h3 className="details-title">{currentPanel.title}</h3>
                      <span className="details-badge">{currentPanel.badge}</span>
                    </div>
                    <p className="details-desc">{currentPanel.desc}</p>
                  </div>

                  {currentPanel.features && (
                    <div className="details-features">
                      <h4 className="features-headline">Highlights & Features</h4>
                      <div className="features-grid">
                        {currentPanel.features.map((f) => (
                          <div key={f} className="feature-item">
                            <span className="feature-dot" />
                            <span className="feature-text">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="details-actions">
                    <Link href={currentPanel.link} className="primary-btn">
                      <span className="primary-btn-icon">
                        <PrimaryBtnArrow />
                      </span>
                      {currentPanel.linkText}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ul>
    </li>
  );
}
