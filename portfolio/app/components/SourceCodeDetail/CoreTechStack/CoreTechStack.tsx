import React from 'react';
import './CoreTechStack.css';

interface TechItem {
    name: string;
    icon: string;
    glowClass: string;
    isDarkIcon?: boolean;
}

const techItems: TechItem[] = [
    {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        glowClass: "react-glow"
    },
    {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
        glowClass: "nextjs-glow",
        isDarkIcon: true
    },
    {
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        glowClass: "php-glow"
    },
    {
        name: "WordPress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        glowClass: "wp-glow"
    }
];

const CoreTechStack = () => {
    return (
        <section className="pd-technology-used section-spacing" id="sc-technology">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="section-title">
                            <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-cpu theme-text" style={{ fontSize: '0.9rem' }}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
                                </div>
                                CORE TECH STACK
                            </span>
                            <h2>Technology <span className="highlight">Used</span></h2>
                            <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                <p>The project is built using a modern, high-performance tech stack designed for speed, security, and scalability.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 g-4 justify-content-center">
                    {techItems.map((tech, index) => (
                        <div className="col" key={index}>
                            <div className="tech-pill-grid">
                                <div className={`tech-icon-box ${tech.glowClass}`}>
                                    <img 
                                        src={tech.icon} 
                                        alt={`${tech.name} Logo`} 
                                        width="40" 
                                        height="40" 
                                        className={tech.isDarkIcon ? 'nextjs-icon' : ''}
                                    />
                                </div>
                                <h3 className="tech-name-sm">{tech.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreTechStack;
