import React from 'react';

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <section id="breadcrumb" className="section-spacing">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb-modern" itemScope itemType="https://schema.org/BreadcrumbList">
                {items.map((item, index) => {
                  const isLast = index === items.length - 1;
                  return (
                    <li
                      key={index}
                      className={`breadcrumb-item-modern ${item.active || isLast ? 'active' : ''}`}
                      aria-current={item.active || isLast ? 'page' : undefined}
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      {item.url && !isLast && !item.active ? (
                        <>
                          <Link href={item.url} itemProp="item">
                            {index === 0 && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home me-1">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            )}
                            <span itemProp="name">{item.label}</span>
                          </Link>
                          <meta itemProp="position" content={(index + 1).toString()} />
                          <span className="separator">/</span>
                        </>
                      ) : (
                        <>
                          <span itemProp="name">{item.label}</span>
                          <meta itemProp="position" content={(index + 1).toString()} />
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
