import React from 'react';
import './Overview.css';
import { WPSourceCodeItem } from '@/types/acf';

interface OverviewProps {
    data?: NonNullable<WPSourceCodeItem['acf']>['overview_section'];
    fallbackContent: string;
}

const Overview: React.FC<OverviewProps> = ({ data, fallbackContent }) => {
    return (
        <section id="pd-overview" className="section-spacing pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="sc-premium-flat-card">
                            <div className="sc-flat-header">
                                <span className="premium-badge-flat">Featured Case Study</span>
                                <div className="flat-dots">
                                    <span className="brand-teal"></span>
                                    <span className="brand-orange"></span>
                                    <span className="brand-teal"></span>
                                </div>
                            </div>
                            <div className="sc-glass-body">
                                <h2 className="ultra-heading">
                                    {data?.title || "Project <span class='text-glow'>Overview</span>"}
                                </h2>
                                <div
                                    className="sc-overview-text entry-content"
                                    dangerouslySetInnerHTML={{ 
                                        __html: (() => {
                                            const content = data?.content || data?.detailed_content || fallbackContent;
                                            if (!content) return "";
                                            
                                            // Split by double line breaks and wrap in <p> tags
                                            return content
                                                .split(/\n\s*\n/)
                                                .map((para: string) => `<p>${para.replace(/\n/g, '<br />')}</p>`)
                                                .join('');
                                        })() 
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Overview;
