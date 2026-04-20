import { WPSkill, WPSkillTaxonomy } from '@/types/acf';

const API_BASE = process.env.NEXT_PUBLIC_WP_API_URL;
if (!API_BASE) throw new Error("WP API URL not defined in .env");

interface WPMedia {
  id: number;
  source_url: string;
}

export async function getSkills(): Promise<WPSkill[]> {
    const res = await fetch(`${API_BASE}/wp-json/wp/v2/my-skill?per_page=100&_embed`, {
        next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
        console.error("Failed to fetch skills", res.status);
        return [];
    }
    
    const skills: WPSkill[] = await res.json();
    
    // Resolve ACF Image IDs if they are numeric
    const mediaIds: number[] = [];
    skills.forEach(skill => {
        if (typeof skill.acf?.icon === 'number') mediaIds.push(skill.acf.icon);
    });
    
    if (mediaIds.length > 0) {
        const uniqueIds = [...new Set(mediaIds)];
        const mediaRes = await fetch(`${API_BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
            next: { revalidate: 3600 }
        });
        
        if (mediaRes.ok) {
            const mediaData: WPMedia[] = await mediaRes.json();
            const mediaMap: Record<number, string> = {};
            mediaData.forEach(m => mediaMap[m.id] = m.source_url);
            
            skills.forEach(skill => {
                if (typeof skill.acf?.icon === 'number' && mediaMap[skill.acf.icon]) {
                    skill.acf.icon = mediaMap[skill.acf.icon];
                }
            });
        }
    }
    
    return skills;
}

export async function getSkillTaxonomies(): Promise<WPSkillTaxonomy[]> {
    const res = await fetch(`${API_BASE}/wp-json/wp/v2/my-skill-taxonomy?per_page=100`, {
        next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
        console.error("Failed to fetch skills categories", res.status);
        return [];
    }
    
    const taxonomies: WPSkillTaxonomy[] = await res.json();
    
    // Resolve Taxonomy Icon IDs if needed
    const mediaIds: number[] = [];
    taxonomies.forEach(tax => {
        if (typeof tax.acf?.icon === 'number') mediaIds.push(tax.acf.icon);
    });
    
    if (mediaIds.length > 0) {
        const uniqueIds = [...new Set(mediaIds)];
        const mediaRes = await fetch(`${API_BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
            next: { revalidate: 3600 }
        });
        
        if (mediaRes.ok) {
            const mediaData: WPMedia[] = await mediaRes.json();
            const mediaMap: Record<number, string> = {};
            mediaData.forEach(m => mediaMap[m.id] = m.source_url);
            
            taxonomies.forEach(tax => {
                if (tax.acf && typeof tax.acf.icon === 'number' && mediaMap[tax.acf.icon]) {
                    tax.acf.icon = mediaMap[tax.acf.icon];
                }
            });
        }
    }
    
    return taxonomies;
}
