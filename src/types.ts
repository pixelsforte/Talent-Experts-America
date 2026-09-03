export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceCard {
  number: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface IndustryItem {
  number: string;
  title: string;
  description: string;
}

export interface TechCard {
  title: string;
  description: string;
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role?: string;
  title: string;
  image?: string;
  roleDescription?: string;
}

export interface AccountabilityItem {
  stat: string;
  description: string;
}
