import React from 'react';
import './ShareModal.css';

const ShareModal: React.FC = () => {
    return (
        <div className="modal fade" id="shareModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <button type="button" className="btn-close share-close" data-bs-dismiss="modal"></button>
                    <div className="modal-body">
                        <div className="share-modal-content">
                            <h3 className="share-title">Share This Tutorial</h3>
                            <div className="social-buttons">
                                <a href="#" className="social-btn facebook" id="facebookShare">
                                    <picture>
                                        <img src="/images/social-media/facebook.svg" className="img-fluid" alt="Facebook" height="30" width="30" />
                                    </picture>
                                    <span>Facebook</span>
                                </a>
                                <a href="#" className="social-btn twitter" id="twitterShare">
                                    <picture>
                                        <img src="/images/social-media/twitter.svg" className="img-fluid" alt="Twitter" height="30" width="30" />
                                    </picture>
                                    <span>Twitter</span>
                                </a>
                                <a href="#" className="social-btn linkedin" id="linkedinShare">
                                    <picture>
                                        <img src="/images/social-media/linkedin.svg" className="img-fluid" alt="LinkedIn" height="30" width="30" />
                                    </picture>
                                    <span>LinkedIn</span>
                                </a>
                                <a href="#" className="social-btn whatsapp" id="whatsappShare">
                                    <picture>
                                        <img src="/images/social-media/whatsapp.svg" className="img-fluid" alt="WhatsApp" height="30" width="30" />
                                    </picture>
                                    <span>WhatsApp</span>
                                </a>
                                <a href="#" className="social-btn telegram" id="telegramShare">
                                    <picture>
                                        <img src="/images/social-media/telegram.svg" className="img-fluid" alt="Telegram" height="30" width="30" />
                                    </picture>
                                    <span>Telegram</span>
                                </a>
                                <a href="#" className="social-btn email" id="emailShare">
                                    <picture>
                                        <img src="/images/social-media/gmail.svg" className="img-fluid" alt="Email" height="30" width="30" />
                                    </picture>
                                    <span>Email</span>
                                </a>
                            </div>
                            <div className="copy-link-section">
                                <div className="copy-link-wrapper">
                                    <input type="text" className="copy-link-input" id="shareUrl" readOnly />
                                    <button className="copy-link-btn" id="copyBtn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
