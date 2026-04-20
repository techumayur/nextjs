import React from 'react';
import './Map.css';

interface ContactMapProps {
    map_iframe?: string;
}

const ContactMap = ({ map_iframe }: ContactMapProps) => {
    if (!map_iframe) return null;

    return (
        <section id="google-map" className="map-section section-spacing pt-0">
            <div className="container-fluid p-0">
                <div className="map-wrapper" dangerouslySetInnerHTML={{ __html: map_iframe }}>
                </div>
            </div>
        </section>
    );
};

export default ContactMap;
