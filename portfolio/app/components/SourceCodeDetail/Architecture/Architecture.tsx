import React from 'react';
import './Architecture.css';

// Explicitly define the item type to avoid 'any'
interface ArchitectureGridItem {
    title: string;
    subtitle: string;
    icon: string;
    size: 'small' | 'medium' | 'large';
}

interface ArchitectureProps {
    data?: {
        grid: ArchitectureGridItem[];
    };
}

const Architecture: React.FC<ArchitectureProps> = ({ data }) => {
    const gridItems = data?.grid || [];

    if (gridItems.length === 0) return null;

    return (
        <section id="sc-architecture" className="section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12 text-center">
                        <div className="sc-content-section">
                            <div className="section-title mb-4">
                                <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                    <div className="sub-heading-image">
                                        <picture><img src="/images/user-2.svg" alt="Arch Deep Dive" width="20" height="20" className="img-fluid" /></picture>
                                    </div>
                                    System Blueprint
                                </span>
                                <h3>Architecture <span className="highlight">Deep Dive</span></h3>
                                <p className="section-para-center text-muted">
                                    Engineered for infinite scalability through a decoupled service-oriented approach.
                                </p>
                            </div>
                            
                            {gridItems.length > 0 && (
                                <div className="sc-arch-bento-grid-dynamic text-start d-grid gap-4" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gridAutoRows: 'minmax(200px, auto)'
                                }}>
                                    {gridItems.map((item: ArchitectureGridItem, index: number) => (
                                        <div key={index} className={`bento-item-dynamic ${item.size || 'medium'} p-4 rounded-4`}
                                            style={{
                                                background: 'var(--white-color)',
                                                border: '2px solid var(--border-color)',
                                                gridColumn: item.size === 'large' ? 'span 2' : 'auto',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div className="bento-content">
                                                {item.icon && (
                                                    <div className="bento-icon theme-text mb-3" 
                                                        dangerouslySetInnerHTML={{ __html: item.icon }} 
                                                        style={{ width: '32px', height: '32px' }}
                                                    />
                                                )}
                                                <h4 className="fw-bold mb-2">{item.title}</h4>
                                                <p className="mb-0 text-muted">{item.subtitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Architecture;
