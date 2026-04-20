"use client";

import React, { useEffect, useState } from 'react';
import { ACFTutorialsSection, WPTutorial, WPTutorialTaxonomy } from '@/types/acf';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

/**
 * Tutorials Component
 * Uses the EXACT HTML structure and Vanilla JS logic provided by the user.
 * Dynamically populates the templates with WordPress data.
 */



interface TutorialsProps {
    sectionData: ACFTutorialsSection | null;
    tutorials: WPTutorial[];
    taxonomies: WPTutorialTaxonomy[];
}

const Tutorials = ({ sectionData, tutorials, taxonomies }: TutorialsProps) => {
    const [mounted, setMounted] = useState(false);

    // Create a virtual "All Tutorials" taxonomy item
    const allTaxonomy: WPTutorialTaxonomy = {
        id: -1,
        name: "All Tutorials",
        slug: "all",
        acf: {
            icon: ""
        }
    };

    const combinedTaxonomies = [allTaxonomy, ...taxonomies];

    const getTaxonomyIcon = (tax: WPTutorialTaxonomy) => {
        const platformLower = tax.name.toLowerCase();

        // Use ACF icon if it exists
        const acfIcon = tax.acf?.icon;
        let iconUrl = "";

        if (acfIcon) {
            if (typeof acfIcon === 'string' && acfIcon !== "") iconUrl = acfIcon;
            else if (typeof acfIcon === 'object' && acfIcon !== null && 'url' in acfIcon) iconUrl = (acfIcon as { url: string }).url;
        }

        if (iconUrl) return iconUrl;

        // Fallbacks based on category name
        if (platformLower.includes('short')) return '/images/home/youtubeshorts.svg';
        if (platformLower.includes('reel')) return '/images/home/instagram.svg';
        if (platformLower.includes('youtube')) return '/images/home/youtube-icon.svg';

        return '/images/home/all-skill.svg'; // Default icon for "All Tutorials"
    };

    useEffect(() => {
        // Using requestAnimationFrame to set state avoids the "synchronous cascading render" error
        const handle = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(handle);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // --- Bootstrap Tab Manual Fallback (Fixes "Tabs not working") ---
        const initTabs = () => {
            const tabs = document.querySelectorAll('#videoTabs .nav-link');
            const panes = document.querySelectorAll('#videoTabsContent .tab-pane');

            tabs.forEach(tab => {
                (tab as HTMLElement).onclick = () => {
                    const targetId = tab.getAttribute('data-bs-target');
                    if (!targetId) return;

                    // Remove active from all
                    tabs.forEach(t => t.classList.remove('active'));
                    panes.forEach(p => p.classList.remove('show', 'active'));

                    // Add active to current
                    tab.classList.add('active');
                    const targetPane = document.querySelector(targetId);
                    if (targetPane) {
                        targetPane.classList.add('show', 'active');
                    }
                };
            });
        };

        initTabs();

        // @ts-expect-error - Fancybox v5 config differs from types but works as intended
        Fancybox.bind('[data-fancybox="gallery"]', {
            Thumbs: false,
            Carousel: {
                infinite: false,
                Navigation: false, // Hide next/prev arrows
            },
            Toolbar: {
                display: {
                    left: [],
                    middle: [],
                    right: ["close"]
                }
            },
            Html: {
                videoTpl: '<video class="f-video" controls playsinline controlslist="nodownload" poster="{poster}"><source src="{src}" type="{format}" />Your browser does not support the video tag.</source></video>'
            },
            Video: {
                youtube: {
                    enablejsapi: 1,
                    rel: 0,
                    fs: 1
                }
            },
            showClass: "f-fadeIn",
            hideClass: "f-fadeOut",
            Counter: false, // Hide 1/35 counter
        });

        /* ✅ Bootstrap Share Modal Logic */
        const shareButtons = document.querySelectorAll('.btn-share');
        const shareUrlInput = document.getElementById('shareUrl') as HTMLInputElement;
        const copyBtn = document.getElementById('copyBtn');
        let currentShareUrl = '';
        let currentShareTitle = '';

        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent Fancybox from opening
                currentShareUrl = btn.getAttribute('data-url') || '';
                currentShareTitle = btn.getAttribute('data-title') || '';
                if (shareUrlInput) shareUrlInput.value = currentShareUrl;
            });
        });

        /* ✅ Social Share Buttons */
        const fb = document.getElementById('facebookShare');
        const tw = document.getElementById('twitterShare');
        const li = document.getElementById('linkedinShare');
        const wa = document.getElementById('whatsappShare');
        const tg = document.getElementById('telegramShare');
        const em = document.getElementById('emailShare');

        if (fb) fb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`, '_blank');
        if (tw) tw.onclick = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`, '_blank');
        if (li) li.onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`, '_blank');
        if (wa) wa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(currentShareTitle + ' - ' + currentShareUrl)}`, '_blank');
        if (tg) tg.onclick = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`, '_blank');
        if (em) em.onclick = () => window.location.href = `mailto:?subject=${encodeURIComponent(currentShareTitle)}&body=${encodeURIComponent(currentShareUrl)}`;

        /* ✅ Copy Button */
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(currentShareUrl).then(() => {
                    const txt = copyBtn.querySelector('span');
                    const iconContainer = (copyBtn.querySelector('svg') || copyBtn) as HTMLElement;
                    const originalIcon = iconContainer.outerHTML;
                    const originalText = txt ? txt.textContent : 'Copy';

                    if (txt) txt.textContent = 'Copied!';

                    const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

                    if (iconContainer.tagName.toLowerCase() === 'svg') {
                        iconContainer.outerHTML = checkSVG;
                    } else {
                        iconContainer.innerHTML = checkSVG;
                    }

                    setTimeout(() => {
                        if (txt) txt.textContent = originalText;
                        const newIcon = copyBtn.querySelector('svg') || copyBtn;
                        if (newIcon) {
                            if (newIcon.tagName.toLowerCase() === 'svg') {
                                newIcon.outerHTML = originalIcon;
                            } else {
                                (newIcon as HTMLElement).innerHTML = originalIcon;
                            }
                        }
                    }, 2000);
                });
            });
        }

        // --- DOMContentLoaded Wrapper Body ---
        function disableTabJS() {
            document.querySelectorAll('#videoTabs .nav-link').forEach(tab => tab.removeAttribute("data-bs-toggle"));
        }
        function enableTabJS() {
            document.querySelectorAll('#videoTabs .nav-link').forEach(tab => tab.setAttribute("data-bs-toggle", "pill"));
        }

        function buildAccordion() {
            const accordion = document.getElementById("videoAccordion");
            const tabs = document.querySelectorAll("#videoTabs .nav-link");
            const panes = document.querySelectorAll("#videoTabsContent .tab-pane");
            if (!accordion) return;
            accordion.innerHTML = "";
            tabs.forEach((tab, index) => {
                const item = document.createElement("div");
                item.classList.add("accordion-item");
                const header = document.createElement("h2");
                header.classList.add("accordion-header");
                header.id = "heading-" + index;
                const btn = document.createElement("button");
                btn.className = "accordion-button collapsed";
                btn.setAttribute("type", "button");
                btn.setAttribute("data-bs-target", "#tutorial-collapse-" + index);
                btn.setAttribute("aria-expanded", "false");

                const left = document.createElement("div");
                left.className = "acc-left";
                left.innerHTML = tab.innerHTML;

                const icon = document.createElement("span");
                icon.className = "acc-icon";

                btn.appendChild(left);
                btn.appendChild(icon);

                // Manual toggle for mobile accordion
                btn.onclick = function () {
                    const targetId = btn.getAttribute("data-bs-target");
                    if (!targetId) return;
                    const target = document.querySelector(targetId);
                    const isCurrentlyOpen = !btn.classList.contains("collapsed");

                    // Close all
                    document.querySelectorAll("#videoAccordion .accordion-button").forEach(b => b.classList.add("collapsed"));
                    document.querySelectorAll("#videoAccordion .accordion-collapse").forEach(c => c.classList.remove("show"));

                    // Toggle selected
                    if (!isCurrentlyOpen) {
                        btn.classList.remove("collapsed");
                        if (target) target.classList.add("show");
                    }
                };

                header.appendChild(btn);

                const collapse = document.createElement("div");
                collapse.id = "tutorial-collapse-" + index;
                collapse.className = "accordion-collapse collapse";
                collapse.setAttribute("data-bs-parent", "#videoAccordion");

                const body = document.createElement("div");
                body.className = "accordion-body";

                const paneContent = panes[index].cloneNode(true) as HTMLElement;
                paneContent.classList.remove("tab-pane", "fade", "active", "show");

                const row = paneContent.querySelector(".row");
                if (row) {
                    row.classList.remove("row", "g-4");
                    row.classList.add("swiper", "accordionCardsSwiper");
                    const swiperWrapper = document.createElement("div");
                    swiperWrapper.className = "swiper-wrapper";
                    const cols = Array.from(row.children);
                    cols.forEach(col => {
                        const el = col as HTMLElement;
                        if (el.classList && (el.classList.contains("col-md-6") || el.classList.contains("col-lg-6") || el.classList.contains("col-12"))) {
                            el.className = "swiper-slide mb-5";
                            swiperWrapper.appendChild(el);
                        }
                    });
                    row.appendChild(swiperWrapper);
                    const pagination = document.createElement("div");
                    pagination.className = "swiper-pagination mt-4 position-relative bottom-0";
                    row.appendChild(pagination);
                }

                body.appendChild(paneContent);
                collapse.appendChild(body);
                item.appendChild(header);
                item.appendChild(collapse);
                accordion.appendChild(item);
            });

            setTimeout(() => {
                if (Swiper) {
                    new Swiper(".accordionCardsSwiper", {
                        modules: [Pagination],
                        slidesPerView: 1,
                        spaceBetween: 20,
                        observer: true,
                        observeParents: true,
                        pagination: { el: ".accordionCardsSwiper .swiper-pagination", clickable: true }
                    });
                }
            }, 100);
        }

        let currentMode: string | null = null;
        function checkMode() {
            const videoAccordion = document.getElementById("videoAccordion");
            const videoTabs = document.getElementById("videoTabs");
            const videoTabsContent = document.getElementById("videoTabsContent");
            if (window.innerWidth <= 991) {
                if (currentMode !== 'mobile') {
                    currentMode = 'mobile';
                    disableTabJS();
                    buildAccordion();
                    if (videoAccordion) videoAccordion.style.display = "block";
                    if (videoTabs) videoTabs.style.display = "none";
                    if (videoTabsContent) videoTabsContent.style.display = "none";
                }
            } else {
                if (currentMode !== 'desktop') {
                    currentMode = 'desktop';
                    enableTabJS();
                    if (videoAccordion) { videoAccordion.innerHTML = ""; videoAccordion.style.display = "none"; }
                    if (videoTabs) videoTabs.style.display = "";
                    if (videoTabsContent) videoTabsContent.style.display = "";
                }
            }
        }

        checkMode();
        window.addEventListener("resize", checkMode);

        const animateCounter = (element: HTMLElement, target: number, suffix = '') => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { element.textContent = Math.floor(target) + suffix; clearInterval(timer); }
                else { element.textContent = Math.floor(current) + suffix; }
            }, 20);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statValues = document.querySelectorAll('.stat-value');
                    statValues.forEach(stat => {
                        const t = stat.getAttribute('data-target');
                        if (t) animateCounter(stat as HTMLElement, parseInt(t), '+');
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const sbc = document.querySelectorAll('.sidebar-card');
        sbc.forEach(card => statsObserver.observe(card));

        // Entrance animation
        const cards = document.querySelectorAll('.video-item');
        cards.forEach((card, index) => {
            const el = card as HTMLElement;
            el.style.opacity = '0'; el.style.transform = 'translateY(50px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1'; el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        if (Swiper) {
            new Swiper('.tutorialsSidebarSwiper', {
                modules: [Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 30,
                grabCursor: true,
                loop: false,
                autoplay: { delay: 3000 },
                pagination: { el: '.tutorialsSidebarSwiper .swiper-pagination', clickable: true }
            });
        }

        return () => window.removeEventListener("resize", checkMode);
    }, [mounted]);

    // Helper for Relative Time
    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        // Final fallback for hydration safety
        if (!mounted) {
            return date.toISOString().split('T')[0];
        }
        return date.toLocaleDateString();
    };
    if (!sectionData || !mounted) return null;

    return (
        <section id="home-tutorials" className="tutorials-section section-spacing position-relative overflow-hidden">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img
                                            src={(typeof sectionData?.sub_heading_icon === 'string' && sectionData.sub_heading_icon !== "")
                                                ? sectionData.sub_heading_icon
                                                : (typeof sectionData?.sub_heading_image === 'string' && sectionData.sub_heading_image !== "")
                                                    ? sectionData.sub_heading_image
                                                    : "/images/user-1.svg"}
                                            alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid"
                                        />
                                    </picture>
                                </div>
                                <span dangerouslySetInnerHTML={{ __html: sectionData.sub_heading || "" }} />
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: sectionData.title || "" }} />
                            <div className="section-para-left">
                                <div className="section-description" dangerouslySetInnerHTML={{ __html: sectionData.description || '' }} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div id="videoAccordion" className="accordion"></div>
                                <div className="filter-tabs-container">
                                    <ul className="nav nav-pills justify-content-center mb-4" id="videoTabs" role="tablist">
                                        {combinedTaxonomies.map((tax, index) => {
                                            const icon = getTaxonomyIcon(tax);
                                            return (
                                                <li className="nav-item" role="presentation" key={tax.id}>
                                                    <button className={`nav-link ${index === 0 ? 'active' : ''}`} id={`pills-tab-${tax.id}`} data-bs-toggle="pill" data-bs-target={`#pills-pane-${tax.id}`} type="button" role="tab" aria-selected={index === 0}>
                                                        <picture>
                                                            <img src={icon} className="img-fluid" alt={tax.name} height="21" width="21" />
                                                        </picture>
                                                        <span dangerouslySetInnerHTML={{ __html: tax.name }} />
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="tab-content" id="videoTabsContent">
                                    {combinedTaxonomies.map((tax, index) => {
                                        const taxTutorials = tax.id === -1
                                            ? tutorials
                                            : tutorials.filter(t => (t['tutorials-taxonomy'] || []).includes(tax.id));
                                        return (
                                            <div className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} id={`pills-pane-${tax.id}`} role="tabpanel" key={tax.id} tabIndex={0}>
                                                <div className="row g-4">
                                                    {taxTutorials.map((tutorial: WPTutorial) => {
                                                        const tutorialCategory = taxonomies.find(t => (tutorial['tutorials-taxonomy'] || []).includes(t.id))?.name || "Tutorial";
                                                        const category = tutorial.acf.category || (tax.id === -1 ? tutorialCategory : tax.name);

                                                        const linksData = typeof tutorial.acf.links === 'object' && tutorial.acf.links !== null
                                                            ? tutorial.acf.links as { url: string; views?: string; likes?: string; time_ago?: string }
                                                            : null;

                                                        const videoUrl = tutorial.acf.tutorial?.links || tutorial.acf.home_page?.links || linksData?.url || (tutorial.acf.links as string | undefined) || tutorial.acf.video_url || "";

                                                        const viewsCount = tutorial.acf.tutorial?.views || tutorial.acf.home_page?.views || linksData?.views || tutorial.acf.views || "0";
                                                        const likesCount = tutorial.acf.tutorial?.likes || tutorial.acf.home_page?.likes || linksData?.likes || tutorial.acf.likes || "0";
                                                        const timeAgoStr = linksData?.time_ago || tutorial.acf.time_ago || getRelativeTime(tutorial.date);
                                                        const featuredImg = tutorial._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                                                        const acfThumb = typeof tutorial.acf.thumbnail === 'string' ? tutorial.acf.thumbnail : (typeof tutorial.acf.thumbnail === 'object' && tutorial.acf.thumbnail !== null && 'url' in tutorial.acf.thumbnail ? (tutorial.acf.thumbnail as { url: string }).url : "");
                                                        const thumb = (featuredImg || acfThumb || "") as string;

                                                        const platformIcon = category.toLowerCase().includes('short') ? "/images/home/youtubeshorts.svg" :
                                                            category.toLowerCase().includes('reel') ? "/images/home/instagram.svg" : "/images/home/youtube-icon.svg";

                                                        return (
                                                            <div className="col-md-6" key={tutorial.id}>
                                                                <div
                                                                    className="video-item"
                                                                    data-fancybox="gallery"
                                                                    data-src={videoUrl.includes('instagram.com') && !videoUrl.includes('/embed/') ? `${videoUrl.replace(/\/$/, '').replace('/reels/', '/reel/')}/embed/` : videoUrl}
                                                                    data-type={videoUrl.includes('instagram.com') ? 'iframe' : undefined}
                                                                    data-width={videoUrl.includes('instagram.com') ? "400" : undefined}
                                                                    data-height={videoUrl.includes('instagram.com') ? "720" : undefined}
                                                                >

                                                                    <div className="video-thumb-wrapper">
                                                                        <img src={thumb} alt={tutorial.title.rendered} />
                                                                        <div className="video-overlay">
                                                                            <div className="play-btn-large">
                                                                                <picture>
                                                                                    <img src="/images/home/play-btn.svg" className="img-fluid" alt="Play" height="16" width="16" />
                                                                                </picture>
                                                                            </div>
                                                                        </div>
                                                                        <span className={`platform-label ${category.toLowerCase().includes('short') ? 'shorts' : category.toLowerCase().includes('reel') ? 'reels' : 'youtube'}`}>
                                                                            <picture>
                                                                                <img src={platformIcon} className="img-fluid" alt={category} height="13" width="13" />
                                                                            </picture>
                                                                            {category}
                                                                        </span>
                                                                        {tutorial.acf.duration && <span className="time-badge">{tutorial.acf.duration}</span>}
                                                                    </div>
                                                                    <div className="video-info">
                                                                        <span className="video-category">{category}</span>
                                                                        <h3 className="video-heading" dangerouslySetInnerHTML={{ __html: tutorial.title.rendered }} />
                                                                        <div className="video-text" dangerouslySetInnerHTML={{ __html: (tutorial.acf.description || tutorial.excerpt?.rendered || tutorial.content?.rendered || '').replace(/<p>|<\/p>/g, '') }} />
                                                                        <div className="video-metrics">
                                                                            <span className="metric">
                                                                                <picture><img src="/images/home/view.svg" className="img-fluid" alt="Views" height="18" width="18" /></picture>
                                                                                {viewsCount}
                                                                            </span>
                                                                            <span className="metric">
                                                                                <picture><img src="/images/home/heart.svg" className="img-fluid" alt="Likes" height="18" width="18" /></picture>
                                                                                {likesCount}
                                                                            </span>
                                                                            <span className="metric">
                                                                                <picture><img src="/images/home/clock.svg" className="img-fluid" alt="Time" height="18" width="18" /></picture>
                                                                                {timeAgoStr}
                                                                            </span>
                                                                        </div>
                                                                        <div className="video-buttons">
                                                                            <div className="primary-btn">
                                                                                <span className="primary-btn-icon">
                                                                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                                                    </svg>
                                                                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                                                    </svg>
                                                                                </span>
                                                                                Watch Now
                                                                            </div>
                                                                            <button className="btn-share" aria-label="btn share" data-bs-toggle="modal" data-bs-target="#shareModal" data-url={videoUrl} data-title={tutorial.title.rendered} onClick={(e) => e.stopPropagation()} data-fancybox-ignore>
                                                                                <picture><img src="/images/home/share.svg" className="img-fluid" alt="Share" height="20" width="20" /></picture>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="sidebar-card-row d-none d-lg-flex">
                                    {(sectionData.sidebar_cards || []).map((card, index) => (
                                        <div className="sidebar-card" key={index}>
                                            <h4 className="sidebar-title">
                                                <picture><img src={(typeof card.icon === 'object' && card.icon !== null && 'url' in card.icon ? (card.icon as { url: string }).url : (typeof card.icon === 'string' ? card.icon : "/images/home/youtube-icon.svg"))} className="img-fluid" alt={card.title} height="25" width="25" /></picture>
                                                {card.title}
                                            </h4>
                                            <div className="stat-item">
                                                <div className="stat-icon">
                                                    <picture><img src={(typeof card.icon === 'object' && card.icon !== null && 'url' in card.icon ? (card.icon as { url: string }).url : (typeof card.icon === 'string' ? card.icon : ""))} className="img-fluid" alt={card.title} height="25" width="25" /></picture>
                                                </div>
                                                <div className="stat-content">
                                                    <div className="stat-value" data-target={parseInt(card.stat_value.replace(/\D/g, '')) || 0}>0+</div>
                                                    <div className="stat-label">{card.stat_label}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-block d-lg-none">
                                    <div className="swiper tutorialsSidebarSwiper">
                                        <div className="swiper-wrapper">
                                            {(sectionData.sidebar_cards || []).map((card, index) => (
                                                <div className="swiper-slide mb-5" key={index}>
                                                    <div className="sidebar-card m-0 h-100">
                                                        <h3 className="sidebar-title">
                                                            <picture><img src={(typeof card.icon === 'object' && card.icon !== null && 'url' in card.icon ? (card.icon as { url: string }).url : (typeof card.icon === 'string' ? card.icon : ""))} className="img-fluid" alt={card.title} height="25" width="25" /></picture>
                                                            {card.title}
                                                        </h3>
                                                        <div className="stat-item">
                                                            <div className="stat-icon">
                                                                <picture><img src={(typeof card.icon === 'object' && card.icon !== null && 'url' in card.icon ? (card.icon as { url: string }).url : (typeof card.icon === 'string' ? card.icon : ""))} className="img-fluid" alt={card.title} height="25" width="25" /></picture>
                                                            </div>
                                                            <div className="stat-content">
                                                                <div className="stat-value" data-target={parseInt(card.stat_value.replace(/\D/g, '')) || 0}>0+</div>
                                                                <div className="stat-label">{card.stat_label}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="swiper-pagination mt-4 position-relative bottom-0"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Share Modal */}
            <div className="modal fade" id="shareModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 9999 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <button type="button" className="btn-close share-close" data-bs-dismiss="modal"></button>
                        <div className="modal-body">
                            <div className="share-modal-content">
                                <h3 className="share-title">Share This Tutorial</h3>
                                <div className="social-buttons">
                                    <a href="#" className="social-btn facebook" id="facebookShare"><picture><img src="/images/social-media/facebook.svg" className="img-fluid" alt="Facebook" height="30" width="30" /></picture><span>Facebook</span></a>
                                    <a href="#" className="social-btn twitter" id="twitterShare"><picture><img src="/images/social-media/twitter.svg" className="img-fluid" alt="Twitter" height="30" width="30" /></picture><span>Twitter</span></a>
                                    <a href="#" className="social-btn linkedin" id="linkedinShare"><picture><img src="/images/social-media/linkedin.svg" className="img-fluid" alt="LinkedIn" height="30" width="30" /></picture><span>LinkedIn</span></a>
                                    <a href="#" className="social-btn whatsapp" id="whatsappShare"><picture><img src="/images/social-media/whatsapp.svg" className="img-fluid" alt="WhatsApp" height="30" width="30" /></picture><span>WhatsApp</span></a>
                                    <a href="#" className="social-btn telegram" id="telegramShare"><picture><img src="/images/social-media/telegram.svg" className="img-fluid" alt="Telegram" height="30" width="30" /></picture><span>Telegram</span></a>
                                    <a href="#" className="social-btn email" id="emailShare"><picture><img src="/images/social-media/gmail.svg" className="img-fluid" alt="Email" height="30" width="30" /></picture><span>Email</span></a>
                                </div>
                                <div className="copy-link-section">
                                    <div className="copy-link-wrapper">
                                        <input type="text" className="copy-link-input" id="shareUrl" readOnly />
                                        <button className="copy-link-btn" id="copyBtn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Tutorials;
