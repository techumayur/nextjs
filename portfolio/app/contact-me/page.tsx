import { getContactPage } from '@/app/lib/getContactPage';
import React from 'react';
import ContactBanner from '@/app/components/Contact/Banner/Banner';
import Breadcrumb from '@/app/components/Common/Breadcrumb';
import ContactHero from '@/app/components/Contact/Hero/Hero';
import ContactForm from '@/app/components/Contact/Form/Form';
import ContactCTA from '@/app/components/Contact/CTA/CTA';
import ContactMap from '@/app/components/Contact/Map/Map';
import SocialBuzz from '@/app/components/Contact/SocialBuzz/SocialBuzz';


export const metadata = {
    title: 'Contact Me',
    description: 'Get in touch with Techu Mayur. Let’s discuss your next project.',
};

const ContactPage = async () => {
    const data = await getContactPage();

    if (!data) return <main className="main-content"></main>;

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Contact Me", active: true }
    ];

    return (
        <>
            
            <main className="main-content">
                <ContactBanner
                    sub_heading={data.contact_banner?.sub_heading}
                    heading={data.contact_banner?.heading}
                    description={data.contact_banner?.description}
                    background_image={data.contact_banner?.background_image}
                />
                <Breadcrumb items={breadcrumbItems} />
                <ContactHero
                    badge_text={data.contact_hero?.badge_text}
                    badge_icon={data.contact_hero?.badge_icon}
                    title={data.contact_hero?.title}
                    description={data.contact_hero?.description}
                    feature_pills={data.contact_hero?.feature_pills}
                    info_cards={data.contact_hero?.info_cards}
                />
                <ContactForm
                    sub_heading={data.contact_form?.sub_heading}
                    title={data.contact_form?.title}
                    description={data.contact_form?.description}
                />
                <ContactCTA data={data.cta} />
                <ContactMap
                    map_iframe={data.contact_map?.map_iframe}
                />
                <SocialBuzz
                    sub_heading={data.social_buzz?.sub_heading}
                    sub_heading_icon={data.social_buzz?.sub_heading_icon}
                    title={data.social_buzz?.title}
                    description={data.social_buzz?.description}
                    social_links={data.social_buzz?.social_links}
                />
            </main>
        </>
    );
};

export default ContactPage;

