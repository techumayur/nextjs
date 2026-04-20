import React from 'react';
import './css/FeaturedImage.css';

interface BlogFeaturedImageProps {
  title: string;
  image: string;
}

const BlogFeaturedImage: React.FC<BlogFeaturedImageProps> = ({ title, image }) => {
  return (
    <section className="section-spacing featured-image-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title mb-5">
              <h2 dangerouslySetInnerHTML={{ __html: title }} />
            </div>
          </div>
          <div className="col-lg-10">
            {/* Blog Featured Image */}
            <div className="blog-featured-image-wrapper">
              <picture>
                <img src={image} alt={title.replace(/<[^>]*>?/gm, '').trim()} className="img-fluid blog-featured-image" />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFeaturedImage;
