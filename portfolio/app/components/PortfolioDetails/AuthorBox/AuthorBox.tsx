import React from "react";
import Image from "next/image";

const AuthorBox = () => {
    const socialLinks = [
        { name: "Facebook", href: "https://facebook.com/techumayur", icon: "/images/social-media/facebook.svg" },
        { name: "Instagram", href: "https://instagram.com/techumayur", icon: "/images/social-media/instagram.svg" },
        { name: "LinkedIn", href: "https://linkedin.com/in/techumayur", icon: "/images/social-media/linkedin.svg" },
        { name: "Twitter", href: "https://twitter.com/techumayur", icon: "/images/social-media/twitter.svg" },
        { name: "GitHub", href: "https://github.com/techumayur", icon: "/images/social-media/github.svg" },
        { name: "Youtube", href: "https://youtube.com/@techumayur", icon: "/images/social-media/youtube.svg" },
        { name: "Telegram", href: "https://t.me/techumayur", icon: "/images/social-media/telegram.svg" },
    ];

    return (
        <section id="pd-author-box" className="section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="author-card-modern">
                            <div className="author-content-flex">
                                <div className="author-portrait-wrapper">
                                    <div className="author-portrait-shape">
                                        <Image
                                            src="/images/Techu-Mayur.png"
                                            alt="Techu Mayur"
                                            width={180}
                                            height={180}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="author-portrait-badge">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                <div className="author-info-modern">
                                    <span className="author-subtitle">MEET THE PROJECT CREATOR</span>
                                    <h2 className="author-name">Techu <span className="highlight">Mayur</span></h2>
                                    <p className="author-role">Full Stack Developer & SEO Expert</p>
                                    <p className="author-bio">
                                        Passionate Web Developer and SEO Expert dedicated to crafting exceptional digital experiences that not only look stunning but also perform exceptionally well. I blend technical precision with creative strategy to build web solutions that resonate with users and drive real business growth.
                                    </p>
                                    <div className="author-social-modern">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.name}
                                                href={social.href}
                                                className="social-icon"
                                                aria-label={social.name}
                                                title={social.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src={social.icon}
                                                    alt={social.name}
                                                    width={20}
                                                    height={20}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthorBox;
