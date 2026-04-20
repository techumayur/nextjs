import React from 'react';
import './css/SocialShare.css';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <section className="pd-social-share-section section-spacing pt-0">
      <div className="container">
        <div className="row justify-content-start">
          <div className="col-lg-12 text-start">
            <div className="social-share-wrapper">
              <span className="share-label">Share this Project</span>
              <div className="share-buttons">
                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook" title="Share on Facebook">
                  <picture>
                    <img src="/images/social-media/facebook.svg" alt="Facebook" width="20" height="20" loading="lazy" />
                  </picture>
                </a>
                {/* Twitter (X) */}
                <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="share-btn x-twitter" title="Share on X">
                  <picture>
                    <img src="/images/social-media/twitter.svg" alt="Twitter" width="20" height="20" loading="lazy" />
                  </picture>
                </a>
                {/* LinkedIn */}
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-btn linkedin" title="Share on LinkedIn">
                  <picture>
                    <img src="/images/social-media/linkedin.svg" alt="LinkedIn" width="20" height="20" loading="lazy" />
                  </picture>
                </a>
                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-btn whatsapp" title="Share on WhatsApp">
                  <picture>
                    <img src="/images/social-media/whatsapp.svg" alt="WhatsApp" width="20" height="20" loading="lazy" />
                  </picture>
                </a>
                {/* Email */}
                <a href={`mailto:?subject=${encodedTitle}&body=Check out this project: ${encodedUrl}`} className="share-btn email" title="Share via Email">
                  <picture>
                    <img src="/images/social-media/gmail.svg" alt="Email" width="20" height="20" loading="lazy" />
                  </picture>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialShare;
