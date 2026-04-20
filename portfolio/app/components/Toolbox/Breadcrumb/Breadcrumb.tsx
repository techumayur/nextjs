import React from 'react';
import Link from 'next/link';
import './Breadcrumb.css';

const Breadcrumb = () => {
    return (
        <section id="breadcrumb" className="section-spacing py-4">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb-modern" itemScope itemType="https://schema.org/BreadcrumbList">
                                <li className="breadcrumb-item-modern" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                    <Link href="/" itemProp="item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                        <span itemProp="name">Home</span>
                                    </Link>
                                    <meta itemProp="position" content="1" />
                                    <span className="separator">/</span>
                                </li>
                                <li className="breadcrumb-item-modern active" aria-current="page" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                    <span itemProp="name">Toolbox</span>
                                    <meta itemProp="position" content="2" />
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumb;
