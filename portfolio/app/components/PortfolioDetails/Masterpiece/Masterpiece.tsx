import React from 'react';
import Image from 'next/image';
import './Masterpiece.css';

interface MasterpieceProps {
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  subHeadingIcon?: string;
}

const Masterpiece: React.FC<MasterpieceProps> = ({
  subHeading,
  heading,
  highlightText,
  description,
  subHeadingIcon = "/images/user-1.svg"
}) => {
  if (!heading && !subHeading) return null;

  return (
    <section className="pd-masterpiece-container section-spacing pb-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title section-title-center">
              <span className="sub-heading-tag-1">
                <div className="sub-heading-image">
                  <picture>
                    <Image
                      src={subHeadingIcon}
                      alt="Techu Mayur"
                      width={20}
                      height={20}
                      loading="lazy"
                      fetchPriority="high"
                      className="img-fluid"
                    />
                  </picture>
                </div>
                {subHeading}
              </span>
              <h2>
                {heading}
                <span className="highlight">{highlightText}</span>
              </h2>
              <div className="section-para-center">
                <div dangerouslySetInnerHTML={{ __html: description || "" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Masterpiece;
