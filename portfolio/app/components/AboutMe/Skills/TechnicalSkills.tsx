'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './TechnicalSkills.css';
import { ACFAboutPage } from "@/types/acf";

interface TechnicalSkillsProps {
    data: ACFAboutPage['technical_skills'];
}

const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({ data }) => {
    const skillsListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const skillItems = skillsListRef.current?.querySelectorAll('.skill-item');
        skillItems?.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    if (!data) return null;

    return (
        <section id="skills-section" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <Image 
                                        src={(data.sub_heading_icon as string) || "/images/user-2.svg"} 
                                        alt={data.sub_heading || "Skills Icon"} 
                                        width={20} 
                                        height={20} 
                                        className="img-fluid" 
                                        unoptimized
                                    />
                                </div>
                                {data.sub_heading}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
                        </div>
                    </div>
                </div>

                <div className="skills-wrapper">
                    <div className="skills-row">
                        {/* Frontend Development Card */}
                        <div className="skill-card">
                            <div className="card-header">
                                <div className="card-title-group">
                                    <div className="card-icon-wrapper">
                                        <Image src="/images/about-me/mordern-design.svg" alt="Frontend" width={40} height={40} unoptimized />
                                    </div>
                                    <h3 className="card-title">Frontend Development</h3>
                                </div>
                                <span className="card-count">{data.frontend_skills?.length || 0}+ Tools</span>
                            </div>
                            <div className="tech-stack">
                                {data.frontend_skills && data.frontend_skills.map((tech, i) => (
                                    <div key={i} className="tech-item">
                                        <div className="tech-icon" style={{ color: tech.color }}>
                                            {tech.icon ? (
                                                <Image 
                                                    src={tech.icon as string} 
                                                    alt={tech.name} 
                                                    width={24} 
                                                    height={24} 
                                                    unoptimized
                                                />
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="tech-name">{tech.name}</div>
                                        <div className="tech-level">{tech.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Backend Development Card */}
                        <div className="skill-card">
                            <div className="card-header">
                                <div className="card-title-group">
                                    <div className="card-icon-wrapper">
                                        <Image src="/images/about-me/backend.svg" alt="Backend" width={40} height={40} unoptimized />
                                    </div>
                                    <h3 className="card-title">Backend Development</h3>
                                </div>
                                <span className="card-count">{data.backend_skills?.length || 0}+ Tools</span>
                            </div>
                            <div className="tech-stack">
                                {data.backend_skills && data.backend_skills.map((tech, i) => (
                                    <div key={i} className="tech-item">
                                        <div className="tech-icon" style={{ color: tech.color }}>
                                            {tech.icon ? (
                                                <Image 
                                                    src={tech.icon as string} 
                                                    alt={tech.name} 
                                                    width={24} 
                                                    height={24} 
                                                    unoptimized
                                                />
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="tech-name">{tech.name}</div>
                                        <div className="tech-level">{tech.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="skills-row">
                        {/* SEO & Analytics Card */}
                        <div className="skill-card" ref={skillsListRef}>
                            <div className="card-header">
                                <div className="card-title-group">
                                    <div className="card-icon-wrapper">
                                        <Image src="/images/home/seo.svg" alt="SEO" width={40} height={40} unoptimized />
                                    </div>
                                    <h3 className="card-title">SEO & Analytics</h3>
                                </div>
                                <span className="card-count">Expert Level</span>
                            </div>
                            <div className="skills-list">
                                {data.seo_skills && data.seo_skills.map((skill, i) => (
                                    <div key={i} className="skill-item">
                                        <div className="skill-item-header">
                                            <div className="skill-item-name">
                                                <div className="skill-item-icon" style={{ background: skill.bg, color: skill.color }}>
                                                    {skill.icon ? (
                                                        <Image 
                                                            src={skill.icon as string} 
                                                            alt={skill.name} 
                                                            width={16} 
                                                            height={16} 
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {skill.name}
                                            </div>
                                            <span className="skill-percentage">{skill.percentage}%</span>
                                        </div>
                                        <div className="skill-progress">
                                            <div 
                                                className="skill-progress-bar" 
                                                style={{ '--progress-width': `${skill.percentage}%` } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Creation Card */}
                        <div className="skill-card">
                            <div className="card-header">
                                <div className="card-title-group">
                                    <div className="card-icon-wrapper">
                                        <Image src="/images/about-me/content-creation.svg" alt="Content" width={40} height={40} unoptimized />
                                    </div>
                                    <h3 className="card-title">Content Creation</h3>
                                </div>
                                <span className="card-count">{data.content_skills?.length || 0}+ Skills</span>
                            </div>
                            <div className="tech-stack">
                                {data.content_skills && data.content_skills.map((tech, i) => (
                                    <div key={i} className="tech-item">
                                        <div className="tech-icon" style={{ color: tech.color }}>
                                            {tech.icon ? (
                                                <Image 
                                                    src={tech.icon as string} 
                                                    alt={tech.name} 
                                                    width={24} 
                                                    height={24} 
                                                    unoptimized
                                                />
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="tech-name">{tech.name}</div>
                                        <div className="tech-level">{tech.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="skills-stats">
                        {data.stats && data.stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnicalSkills;
