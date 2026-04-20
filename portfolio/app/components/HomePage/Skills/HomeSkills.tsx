"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import './home-skills.css';
import { ACFSkill } from "@/types/acf";

interface SkillsSectionProps {
    skillsData?: ACFSkill[];
}

export default function SkillsSection({ skillsData }: SkillsSectionProps) {
    if (!skillsData || skillsData.length === 0) return null;

    const activeSkills = skillsData.map(s => ({
            name: s.name,
            icon: typeof s.icon === 'string' ? s.icon : (typeof s.icon === 'object' ? s.icon.url : "")
          }));

    return (
        <section id="home-skills" className="skills-section section-spacing">
            <div className="container-fluid skills-bg">
                <div className="row">
                    <div className="col-12">
                        <div className="skills-slider">
                            <Swiper
                                modules={[Autoplay]}
                                slidesPerView={5}
                                spaceBetween={40}
                                loop={activeSkills.length >= 5}
                                freeMode={true}
                                speed={4000}
                                autoplay={{
                                    delay: 0,
                                    disableOnInteraction: false,
                                }}
                                allowTouchMove={false}
                                breakpoints={{
                                    320: { slidesPerView: 2, spaceBetween: 20 },
                                    768: { slidesPerView: 3, spaceBetween: 30 },
                                    1024: { slidesPerView: 6, spaceBetween: 40 },
                                }}
                            >
                                {activeSkills.map((skill, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="text-center d-flex align-items-center gap-2">
                                            {skill.icon && (
                                                <Image
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                    width={30}
                                                    height={30}
                                                    className="img-fluid"
                                                    unoptimized={skill.icon.toLowerCase().endsWith('.svg') || skill.icon.includes('.svg?')}
                                                />
                                            )}
                                            <span>{skill.name}</span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
