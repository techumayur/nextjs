"use client";

import React from "react";
import Image from "next/image";
import './SocialShare.css';

const SocialShare = () => {
    // Use SyncExternalStore to avoid hydration mismatch when accessing window
    const mounted = React.useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    if (!mounted) return null;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : "";
    const pageTitle = typeof window !== 'undefined' ? document.title : "";

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(pageTitle);

    const shareLinks = [
        {
            name: "Facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: "/images/social-media/facebook.svg",
            className: "facebook"
        },
        {
            name: "X (Twitter)",
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            icon: "/images/social-media/twitter.svg",
            className: "x-twitter"
        },
        {
            name: "LinkedIn",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: "/images/social-media/linkedin.svg",
            className: "linkedin"
        },
        {
            name: "WhatsApp",
            url: `https://api.whatsapp.com/send?text=Check out this project: ${encodedUrl}`,
            icon: "/images/social-media/whatsapp.svg",
            className: "whatsapp"
        },
        {
            name: "Email",
            url: `mailto:?subject=Project Inquiry&body=Check out this project: ${encodedUrl}`,
            icon: "/images/social-media/gmail.svg",
            className: "email"
        }
    ];

    return (
        <section className="pd-social-share-section section-spacing mt-5" id="pd-social-share-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <div className="social-share-wrapper">
                            <span className="share-label">Share this Project</span>
                            <div className="share-buttons">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target={link.name === "Email" ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className={`share-btn ${link.className}`}
                                        title={`Share on ${link.name}`}
                                    >
                                        <Image
                                            src={link.icon}
                                            alt={link.name}
                                            width={20}
                                            height={20}
                                            style={{ transition: 'all 0.3s ease' }}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialShare;
