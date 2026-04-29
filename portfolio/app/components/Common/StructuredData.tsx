import React from 'react';

interface StructuredDataProps {
  theme?: any;
}

const StructuredData = ({ theme }: StructuredDataProps) => {
  const socialLinks = theme?.social_items?.map((item: any) => item.link) || [
    "https://github.com/techumayur",
    "https://twitter.com/techumayur",
    "https://linkedin.com/in/techumayur",
    "https://instagram.com/techumayur"
  ];

  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Techu Mayur",
    "url": "https://www.techumayur.in",
    "image": "https://www.techumayur.in/og-image.jpg",
    "sameAs": socialLinks,
    "jobTitle": "Frontend Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Techu Mayur Portfolio"
    },
    "description": theme?.footer_content || "Techu Mayur is a Frontend Developer with 6+ years of expertise in building modern web applications using React, Next.js, and advanced CSS techniques."
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Techu Mayur Portfolio",
    "url": "https://www.techumayur.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.techumayur.in/blogs?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Techu Mayur - Frontend Engineering Services",
    "image": "https://www.techumayur.in/og-image.jpg",
    "@id": "https://www.techumayur.in",
    "url": "https://www.techumayur.in",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5204,
      "longitude": 73.8567
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
};

export default StructuredData;
