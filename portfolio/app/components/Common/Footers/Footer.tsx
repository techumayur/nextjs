'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from "@/app/providers";
import { normalizeUrl } from '@/app/lib/normalizeUrl';
// ─── Newsletter counter animation ─────────────────────────────────────────────

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * target);
      setCount(currentCount);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target]);

  return <span ref={countRef}>{count}{suffix}</span>;
}

// ─── Footer Components ──────────────────────────────────────────────────────────

interface MenuItem {
  id: string | number;
  title: string;
  url: string;
  parent?: string | number | null;
  classes?: string[] | string;
}

export default function Footer({
  menuData = [],
  bottomMenuData = []
}: {
  menuData?: MenuItem[];
  bottomMenuData?: MenuItem[];
}) {
  const { theme } = useTheme(); // 🔥 GET CMS DATA
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <>
      {/* ── Newsletter Section ── */}
      <section id="newsletter" className="newsletter section-spacing">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="newsletter-wrapper">
                <div className="newsletter-container">
                  <div className="newsletter-decorative" />
                  <div className="newsletter-decorative-2" />
                  <div className="newsletter-content">
                    <div className="newsletter-badge">
                      {theme?.newsletter_sub_icon && (
                        <Image
                          src={theme.newsletter_sub_icon}
                          alt="Email"
                          width={20}
                          height={20}
                          unoptimized
                          className="img-fluid"
                          style={{ height: 'auto' }}
                        />
                      )}
                      <span>{theme?.newsletter_sub_text}</span>
                    </div>
                    <h2
                      className="newsletter-title"
                      dangerouslySetInnerHTML={{ __html: theme?.newsletter_heading || "" }}
                    />
                    <p className="newsletter-description">
                      {theme?.newsletter_content}
                    </p>
                    <div className="newsletter-form-wrapper">
                      <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <input
                          type="email"
                          className="newsletter-input"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <button type="submit" className="primary-btn">
                          <span className="primary-btn-icon">
                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
                            </svg>
                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" />
                            </svg>
                          </span>
                          Subscribe Now
                        </button>
                      </form>
                      <div
                        className="newsletter-privacy"
                        dangerouslySetInnerHTML={{ __html: theme?.newsletter_form_bottom_text || "" }}
                      />
                      {submitted && (
                        <div className="success-message show">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-check-circle">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg> Thank you for subscribing! Check your email for confirmation.
                        </div>
                      )}
                    </div>
                    <div className="newsletter-features">
                      {theme?.newsletter_features?.map((item, idx) => (
                        <div key={idx} className="feature-item">
                          {item.feature_icon && (
                            <Image
                              src={item.feature_icon}
                              alt="Feature"
                              width={18}
                              height={18}
                              unoptimized
                              className="img-fluid"
                              style={{ height: 'auto' }}
                            />
                          )}
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="newsletter-stats">
                      {theme?.newsletter_counter?.map((stat, idx) => (
                        <div key={idx} className="stat-item">
                          <span className="stat-number">
                            {stat.counter_number?.includes('K') || stat.counter_number?.includes('%') ? (
                              <Counter
                                target={parseInt(stat.counter_number.replace(/\D/g, ''))}
                                suffix={stat.counter_number.replace(/\d/g, '')}
                              />
                            ) : (
                              stat.counter_number
                            )}
                          </span>
                          <span className="stat-label">{stat.counter_heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Section ── */}
      <footer id="footer" className="footer section-spacing">
        <div className="decorative-shape shape-1" />
        <div className="decorative-shape shape-2" />
        <div className="container footer-main">
          <div className="row g-4">
            {/* Brand */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-brand">
                <Link href="/" className="footer-logo">
                  { (typeof theme?.footer_logo === 'string' ? theme.footer_logo : theme?.footer_logo?.url) && (
                    <Image
                      src={typeof theme?.footer_logo === 'string' ? theme.footer_logo : theme?.footer_logo?.url || ""}
                      alt={theme?.footer_logo_alt || "Techu Mayur"}
                      width={200}
                      height={50}
                      unoptimized
                      className="img-fluid"
                    />
                  )}
                </Link>
                <p className="footer-description">
                  {theme?.footer_content}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-3 col-md-6">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {menuData.map((item) => (
                    <li key={item.id} className={Array.isArray(item.classes) ? item.classes.join(' ') : item.classes || ''}>
                      <Link href={normalizeUrl(item.url)} dangerouslySetInnerHTML={{ __html: item.title }} />
                    </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6">
              <h3 className="footer-title">Contact Info</h3>
              {theme?.contact_address && (
                <div className="contact-item">
                  <div className="contact-icon">
                    <Image
                      src={theme?.address_icon || ""}
                      alt="Location"
                      width={20}
                      height={20}
                      unoptimized
                      className="img-fluid"
                      style={{ height: "auto" }}
                    />
                  </div>
                  <p className="contact-text">{theme.contact_address}</p>
                </div>
              )}
              {theme?.contact_email && (
                <div className="contact-item">
                  <div className="contact-icon">
                    <Image
                      src={theme?.email_icon || ""}
                      alt="Email"
                      width={20}
                      height={20}
                      unoptimized
                      className="img-fluid"
                      style={{ height: "auto" }}
                    />
                  </div>
                  <p className="contact-text">
                    <a href={`mailto:${theme.contact_email}`}>
                      {theme.contact_email}
                    </a>
                  </p>
                </div>
              )}
              {theme?.contact_phone && (
                <div className="contact-item">
                  <div className="contact-icon">
                    <Image
                      src={theme?.phone_number_icon || ""}
                      alt="Mobile"
                      width={20}
                      height={20}
                      unoptimized
                      className="img-fluid"
                      style={{ height: "auto" }}
                    />
                  </div>
                  <p className="contact-text">
                    <a href={`tel:${theme.contact_phone}`}>
                      {theme.contact_phone}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="col-lg-3 col-md-6">
              <h3 className="footer-title">Follow Us</h3>
              <div className="social-links">
                {theme?.social_items?.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Social Link"
                    title="Social Link"
                  >
                    {social.icon && (
                      <Image
                        src={social.icon}
                        alt="Social Icon"
                        width={20}
                        height={20}
                        unoptimized
                        className="img-fluid"
                        style={{ height: "auto" }}
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row align-items-center g-3">
              <div className="col-lg-3 col-md-12 text-center text-lg-start">
                <p className="copyright-text" suppressHydrationWarning>© {new Date().getFullYear()} {theme?.copyright}</p>
              </div>
              <div className="col-lg-6 col-md-12 text-center">
                <ul className="footer-bottom-links">
                  {bottomMenuData.map((item) => (
                      <li key={item.id} className={Array.isArray(item.classes) ? item.classes.join(' ') : item.classes || ''}>
                        <Link href={normalizeUrl(item.url)} dangerouslySetInnerHTML={{ __html: item.title }} />
                      </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-3 col-md-12 text-center text-lg-end">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-end gap-3">
                  <div
                    className="designer-credit"
                    dangerouslySetInnerHTML={{ __html: theme?.credit || "" }}
                  />
                  {theme?.back_to_top && <BackToTop />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scroll / limit;
      setIsVisible(scroll > 300);
      if (rectRef.current) {
        const totalLength = 192;
        rectRef.current.style.strokeDasharray = `${totalLength}`;
        rectRef.current.style.strokeDashoffset = `${totalLength - progress * totalLength}`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const button = backToTopRef.current;
    if (!button) return;
    const magneticStrength = 14;
    const tiltStrength = 10;
    const onMouseMove = (e: MouseEvent) => {
      const bounds = button.getBoundingClientRect();
      const relX = e.clientX - bounds.left;
      const relY = e.clientY - bounds.top;
      const moveX = (relX - bounds.width / 2) / bounds.width;
      const moveY = (relY - bounds.height / 2) / bounds.height;
      gsap.to(button, {
        x: moveX * magneticStrength,
        y: moveY * magneticStrength,
        rotateY: moveX * tiltStrength,
        rotateX: -moveY * tiltStrength,
        scale: 1.06,
        duration: 0.35,
        ease: 'power3.out'
      });
    };
    const onMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };
    button.addEventListener('mousemove', onMouseMove);
    button.addEventListener('mouseleave', onMouseLeave);
    return () => {
      button.removeEventListener('mousemove', onMouseMove);
      button.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      ref={backToTopRef}
      id="backToTop"
      className={`back-to-top${isVisible ? ' show' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg className="progress-box" viewBox="0 0 52 52">
        <rect
          ref={rectRef}
          className="progress-box__rect"
          x="2"
          y="2"
          width="48"
          height="48"
          rx="12"
          ry="12"
        />
      </svg>
      <svg ref={arrowRef} className="arrow-icon" viewBox="0 0 24 24">
        <path d="M12 18V6" />
        <path d="M7 11l5-5 5 5" />
      </svg>
    </button>
  );
}
