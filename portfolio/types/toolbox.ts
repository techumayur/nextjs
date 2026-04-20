import { ACFImage } from "./acf";

export interface ToolboxPageData {
    id: number;
    title: {
        rendered: string;
    };
    acf: {
        banner: {
            sub_heading: string;
            sub_heading_icon?: ACFImage;
            title: string;
            description: string;
            background_image: ACFImage;
        };
        development_stack: {
            title: string;
            description: string;
            tools: {
                icon: ACFImage;
                name: string;
                visibility: 'visible' | 'mobile_hidden' | 'expanded';
            }[];
        };
        design_creativity: {
            title: string;
            description: string;
            tools: {
                icon: ACFImage;
                name: string;
                description: string;
                visibility: 'visible' | 'mobile_hidden' | 'expanded';
            }[];
        };
        productivity_collaboration: {
            title: string;
            description: string;
            tools: {
                icon: ACFImage;
                name: string;
                description: string;
                visibility: 'visible' | 'mobile_hidden' | 'expanded';
            }[];
        };
        hosting_deployment: {
            title: string;
            description: string;
            platforms: {
                icon: ACFImage;
                name: string;
                description: string;
                status: 'operational' | 'active';
            }[];
        };
        bonus_tools: {
            title: string;
            description: string;
            tools: {
                icon: ACFImage;
                name: string;
                description: string;
                info: string;
                is_large: boolean;
            }[];
        };
        cta?: {
            badge_icon?: ACFImage;
            badge_text: string;
            title: string;
            description: string;
            stats: {
                value: string;
                label: string;
            }[];
            primary_button: {
                title: string;
                url: string;
            };
            secondary_button: {
                title: string;
                url: string;
            };
            visual_cards?: {
                icon: ACFImage;
                title: string;
                subtitle: string;
                bg_color?: string; // Optional for custom background like rgba(...)
            }[];
        };
    };
}
