import React from 'react';
import './Grid.css';
import { WPSourceCodeItem, WPSourceCodeTaxonomy, ACFSourceCodePage } from '@/types/acf';
import ProjectCard from '../ProjectCard/ProjectCard';

interface GridProps {
    projects: WPSourceCodeItem[];
    taxonomies: WPSourceCodeTaxonomy[];
    tags: WPSourceCodeTaxonomy[];
    data?: ACFSourceCodePage['grid_section'];
}

const Grid: React.FC<GridProps> = ({ projects, taxonomies, tags, data }) => {

    return (
        <section id="sc-grid" className="section-spacing" aria-label="Source code projects">
            <div className="container">
                {/* Results Meta */}
                <div className="sc-meta" id="sc-results-meta">
                    <div className="sc-meta__count">
                        <span><span id="sc-count">{projects.length}</span> {data?.sub_heading || "TOTAL PROJECTS"}</span>
                        {data?.title || "CURATED SOURCE CODE"}
                    </div>
                </div>

                {/* Grid */}
                <div className="sc-grid" id="sc-projects-grid">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            taxonomies={taxonomies} 
                            tags={tags} 
                        />
                    ))}
                </div>

                {/* No Results State */}
                <div className="sc-no-results" id="sc-no-results" hidden>
                    <div className="sc-no-results__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <h3 className="sc-no-results__title">No Matches Found</h3>
                    <p className="sc-no-results__text">We couldn&apos;t find any projects matching your criteria. Try resetting the filters to explore everything.</p>
                    <button className="primary-btn" id="sc-no-results-reset">Reset All Filters</button>
                </div>
            </div>
        </section>
    );
};

export default Grid;
