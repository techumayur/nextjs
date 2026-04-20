"use client";
import React, { useState } from 'react';
import './DevStack.css';
import { ToolboxPageData } from '@/types/toolbox';

interface DevStackProps {
    data: ToolboxPageData['acf']['development_stack'];
}

const DevStack = ({ data }: DevStackProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data) return null;

    return (
        <section id="development-stack" className="section-spacing toolbox-section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center mb-5">
                            <h2 dangerouslySetInnerHTML={{ __html: data.title || 'Development <span className="highlight">Stack</span>' }} />
                            <div className="section-para-center">
                                <p dangerouslySetInnerHTML={{ __html: data.description || 'Technologies and tools I use to build modern digital products.' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`floating-matrix ${isExpanded ? 'is-expanded' : ''}`} id="techGrid">
                    {data.tools?.map((tool, index) => (
                        <div 
                            key={index} 
                            className={`matrix-tile reveal-item ${tool.visibility === 'mobile_hidden' || tool.visibility === 'expanded' ? 'mobile-hidden' : ''}`}
                            style={tool.visibility === 'expanded' && !isExpanded ? { display: 'none' } : {}}
                        >
                            <picture>
                                {((typeof tool.icon === 'string' && tool.icon) || (typeof tool.icon === 'object' && (tool.icon as {url: string})?.url)) ? (
                                    <img src={typeof tool.icon === 'string' ? tool.icon : (tool.icon as {url: string})?.url} alt={tool.name} className="matrix-logo" width="28" height="28" loading="lazy" />
                                ) : (
                                    <img src="/images/home/clean-code.svg" alt={tool.name} className="matrix-logo" width="28" height="28" loading="lazy" />
                                )}
                            </picture>
                            <h3 className="matrix-name">{tool.name}</h3>
                        </div>
                    ))}
                </div>

                {data.tools?.some(tool => tool.visibility === 'expanded') && (
                    <div className="stack-btn-wrapper">
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

export default DevStack;
