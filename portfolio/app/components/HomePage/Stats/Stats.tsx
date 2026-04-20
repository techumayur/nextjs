"use client";

import React, { useEffect } from 'react';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Stats.css';

export interface StatsData {
    sub_heading: string;
    heading: string;
    description: string;
    stats_items: {
        icon: string;
        number: number;
        suffix: string;
        title: string;
        stat_description: string;
    }[];
}

export default function Stats({ data }: { data?: StatsData }) {
    useEffect(() => {
        // Add stagger animation to stat boxes
        const statBoxes = document.querySelectorAll('.stat-box');
        if (statBoxes.length) {
            statBoxes.forEach((box, index) => {
                const htmlBox = box as HTMLElement;
                htmlBox.style.opacity = '0';
                htmlBox.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    htmlBox.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    htmlBox.style.opacity = '1';
                    htmlBox.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        // Stats Section Counter Animation
        const statSection = document.getElementById('home-stats');
        const counters = statSection ? statSection.querySelectorAll('.stat-number') : [];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target as HTMLElement;
                    const target = +(counter.getAttribute('data-target') || 0);
                    const duration = 2000; // 2 seconds duration
                    const increment = target / (duration / 16); // ~ 60 frames per second
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toString();
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter); // Only animate once
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(counter => observer.observe(counter));

        const statsSwiper = new Swiper('.stats-swiper', {
            modules: [Pagination],
            loop: false,
            spaceBetween: 20,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1, // Mobile
                },
                768: {
                    slidesPerView: 3, // Tablet
                },
                1200: {
                    slidesPerView: 5, // Desktop
                }
            }
        });

        return () => {
            if (statsSwiper) statsSwiper.destroy();
        };
    }, [data]);

    // Fallback static items
    const renderItems = data?.stats_items || [];

    if (!data || renderItems.length === 0) return null;

    return (
        <section id="home-stats" className="stats-section section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <div className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src="/images/user-2.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                {data?.sub_heading}
                            </div>
                            {data?.heading && (
                                <h2 dangerouslySetInnerHTML={{ __html: data.heading }}></h2>
                            )}
                            <div className="section-para-center">
                                <p>{data?.description}</p>
                            </div>
                        </div>
                        <div className="stats-grids">
                            <div className="stats-swiper swiper">
                                <div className="swiper-wrapper">
                                    {renderItems.map((item, index) => (
                                        <div className="swiper-slide" key={index}>
                                            <div className="stat-box" itemScope itemType="https://schema.org/CreativeWork">
                                                <div className="icon-wrapper">
                                                    <div className="icon-bg"></div>
                                                    <div className="pulse-ring"></div>
                                                    <picture>
                                                        <img src={item.icon || ""} alt={item.title} width="40" height="40" className="img-fluid" loading="lazy" />
                                                    </picture>
                                                </div>
                                                <div className="stat-content">
                                                    <div className="stat-number-wrapper">
                                                        <span className="stat-number" data-target={item.number}>0</span>
                                                        <span className="stat-plus">{item.suffix}</span>
                                                    </div>
                                                    <p className="stat-title">{item.title}</p>
                                                    <p className="stat-description">{item.stat_description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Optional pagination */}
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}