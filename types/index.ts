export interface BulletSection {
  id: string;
  title: string;
  icon?: string; // Path to icon or icon name
  points: string[];
}

export interface CountryData {
  id: string;
  name: string;
  landmark: string;
  images: string[];
  bulletSections: BulletSection[];
}
