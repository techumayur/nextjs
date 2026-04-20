"use client";
import React, { useState } from 'react';
import './BonusTools.css';
import { ToolboxPageData } from '@/types/toolbox';

interface BonusToolsProps {
    data: ToolboxPageData['acf']['bonus_tools'];
}

const BonusTools = ({ data }: BonusToolsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data) return null;

    return (
        <section id="bonus-tools" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center mb-5">
                            <h2 dangerouslySetInnerHTML={{ __html: data.title || 'Bonus <span className="highlight">Tools</span>' }} />
                            <div className="section-para-center">
                                <p dangerouslySetInnerHTML={{ __html: data.description || 'Specialized utilities I leverage to optimize performance, enhance SEO, and streamline my development workflow.' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bonus-dashboard" id="bonusGrid">
                    {data.tools?.map((tool, index) => (
                        <div 
                            key={index} 
                            className={`bonus-widget ${tool.is_large ? 'bonus-widget--large' : ''} reveal-item ${index > 4 && !isExpanded ? 'd-none' : 'is-visible'}`}
                        >
                            <div className="widget-inner">
                                {tool.is_large ? (
                                    <>
                                        <div className="widget-top">
                                            <div className="widget-icon-bg">
                                                {((typeof tool.icon === 'string' && tool.icon) || (typeof tool.icon === 'object' && (tool.icon as { url: string })?.url)) && (
                                                    <img src={typeof tool.icon === 'string' ? tool.icon : (tool.icon as { url: string })?.url} alt={tool.name} width="40" height="40" />
                                                )}
                                            </div>
                                            <span className="widget-tag">{tool.info}</span>
                                        </div>
                                        <div className="widget-content">
                                            <h3 className="widget-title">{tool.name}</h3>
                                            <p className="widget-text" dangerouslySetInnerHTML={{ __html: tool.description }} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="widget-icon">
                                            {((typeof tool.icon === 'string' && tool.icon) || (typeof tool.icon === 'object' && (tool.icon as { url: string })?.url)) && (
                                                <img src={typeof tool.icon === 'string' ? tool.icon : (tool.icon as { url: string })?.url} alt={tool.name} width="32" height="32" />
                                            )}
                                        </div>
                                        <h3 className="widget-name">{tool.name}</h3>
                                        <span className="widget-info">{tool.info}</span>
                                        {tool.description && (
                                            <p className="widget-text mt-2" dangerouslySetInnerHTML={{ __html: tool.description }} />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {data.tools?.length > 5 && (
                    <div className="stack-btn-wrapper mt-5 pb-5">
                        <button type="button" className="primary-btn toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                            <span className="primary-btn-icon">
                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                            </span>
                            <span className="btn-text">{isExpanded ? "Show Less Tools" : "Show More Tools"}</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BonusTools;
