"use client";
import React, { useState } from 'react';
import './DesignTools.css';
import { ToolboxPageData } from '@/types/toolbox';

interface DesignToolsProps {
    data: ToolboxPageData['acf']['design_creativity'];
}

const DesignTools = ({ data }: DesignToolsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data) return null;

    return (
        <section id="design-tools" className="section-spacing pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center mb-5">
                            <h2 dangerouslySetInnerHTML={{ __html: data.title || 'Design & Creativity <span className="highlight">Tools</span>' }} />
                            <div className="section-para-center">
                                <p dangerouslySetInnerHTML={{ __html: data.description || 'Tools I use for UI/UX design, graphics, and creative workflows.' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`design-grid ${isExpanded ? 'is-expanded' : ''}`}>
                    {data.tools?.map((tool, index) => (
                        <div 
                            key={index} 
                            className={`design-card reveal-item ${tool.visibility === 'mobile_hidden' || tool.visibility === 'expanded' ? 'mobile-hidden' : ''}`}
                            style={tool.visibility === 'expanded' && !isExpanded ? { display: 'none' } : {}}
                        >
                            <div className="design-icon-wrapper">
                                {((typeof tool.icon === 'string' && tool.icon) || (typeof tool.icon === 'object' && (tool.icon as {url: string})?.url)) ? (
                                    <img src={typeof tool.icon === 'string' ? tool.icon : (tool.icon as {url: string})?.url} alt={tool.name} className="design-logo" loading="lazy" />
                                ) : (
                                    <img src="/images/home/clean-code.svg" alt={tool.name} className="design-logo" loading="lazy" />
                                )}
                            </div>
                            <h3 className="design-name">{tool.name}</h3>
                            <div className="design-desc" dangerouslySetInnerHTML={{ __html: tool.description }} />
                        </div>
                    ))}
                </div>

                {data.tools?.some(tool => tool.visibility === 'expanded') && (
                    <div className="stack-btn-wrapper text-center mt-4">
                        <button type="button" className="primary-btn toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                            <span className="primary-btn-icon">
                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                            </span>
                            <span className="btn-text">{isExpanded ? "Show Less" : "Show More"}</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignTools;
