import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ArchitectMetaProps {
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    date: string;
    readingTime?: string;
    level?: string;
    category?: {
        name: string;
        slug: string;
    };
}

const ArchitectMeta: React.FC<ArchitectMetaProps> = ({
    author,
    date,
    readingTime,
    level,
    category
}) => {
    return (
        <section id="tips-meta-architect" className="section-spacing pt-4 pb-0">
            <div className="container">
                <div className="td-meta-arch-wrap">
                    <div className="td-arch-author">
                        <div className="td-arch-avatar-box">
                            <Image src={"/images/Techu-Mayur.png"} alt={author.name} width={65} height={65} />
                            <span className="td-arch-status"></span>
                        </div>
                        <div className="td-arch-author-text">
                            <span className="td-arch-label">WRITTEN BY</span>
                            <h4 className="td-arch-name">{author.name} <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></h4>
                            <span className="td-arch-sub">{author.role}</span>
                        </div>
                    </div>

                    <div className="td-arch-data">
                        <div className="td-arch-mod">
                            <span className="td-arch-label">PUBLISHED</span>
                            <span className="td-arch-val">{date}</span>
                        </div>

                        <div className="td-arch-mod">
                            <span className="td-arch-label">INSIGHTS</span>
                            <div className="td-arch-pills">
                                {level && <span className="td-pill-solid">{level}</span>}
                                {readingTime && <span className="td-pill-outline">{readingTime}</span>}
                            </div>
                        </div>

                        {category && (
                            <div className="td-arch-mod border-0 pe-0">
                                <span className="td-arch-label">TOPIC</span>
                                <Link href="/tips-and-tricks" className="td-arch-cat">
                                    {category.name} <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArchitectMeta;

