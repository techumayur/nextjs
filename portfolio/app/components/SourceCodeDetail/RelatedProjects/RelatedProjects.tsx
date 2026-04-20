import React from 'react';
import { WPSourceCodeItem } from '@/types/acf';
import ProjectCard from '../../SourceCode/ProjectCard/ProjectCard';
import './RelatedProjects.css';

interface RelatedProjectsProps {
    projects: WPSourceCodeItem[];
}

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section id="pd-related-projects" className="section-spacing bg-light-alt">
            <div className="container">
                <div className="section-title text-center mb-5">
                    <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                        <div className="sub-heading-image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-code theme-text" style={{ fontSize: '0.9rem' }}>
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                        DISCOVER MORE
                    </span>
                    <h2>Related <span className="highlight">Source Codes</span></h2>
                </div>
                <div className="row g-4 justify-content-center">
                    {projects.map((project) => (
                        <div className="col-lg-4 col-md-6" key={project.id}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
