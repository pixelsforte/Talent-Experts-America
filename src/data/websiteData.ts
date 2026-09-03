import {
  NavItem,
  ServiceCard,
  IndustryItem,
  TechCard,
  WhyChooseItem,
  ProcessStep,
  TeamMember,
  AccountabilityItem,
} from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Veterans', href: '#veterans' },
  { label: 'Our Process', href: '#process' },
  { label: 'Our Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export const HIGHLIGHTS_BAR = [
  {
    title: 'U.S.-BASED TALENT',
    description: 'Professionals residing in the United States.',
  },
  {
    title: 'END-TO-END STAFFING',
    description: 'From recruitment through onboarding.',
  },
  {
    title: 'VETERAN WORKFORCE',
    description: 'Supporting veterans transitioning into civilian careers.',
  },
  {
    title: 'INDUSTRY EXPERTISE',
    description: 'Staffing solutions across diverse industries.',
  },
];

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    number: '01',
    title: 'U.S.-BASED TALENT',
    description:
      'Focus on skilled professionals residing in the United States, helping businesses access qualified local workforce resources.',
  },
  {
    number: '02',
    title: 'VETERAN WORKFORCE INTEGRATION',
    description:
      'Help U.S. veterans transition into civilian careers by recognizing their transferable skills, leadership and experience.',
  },
  {
    number: '03',
    title: 'INDUSTRY-SPECIFIC EXPERTISE',
    description:
      'Provide staffing solutions across technology, healthcare, manufacturing, finance, education and other industries.',
  },
  {
    number: '04',
    title: 'PERSONALIZED RECRUITMENT',
    description:
      'Understand individual client requirements and candidate capabilities to create stronger, more appropriate matches.',
  },
];

export const SERVICES: ServiceCard[] = [
  {
    number: '01',
    title: 'Recruitment & Talent Hunt',
    description:
      'Identifying, screening and placing top-tier talent to fulfill workforce requirements.',
    linkText: 'Explore Recruitment →',
    linkHref: '#contact',
  },
  {
    number: '02',
    title: 'Third-Party Payroll Management',
    description:
      'Simplifying payroll processes by supporting payroll administration, compliance and related workforce requirements.',
    linkText: 'Explore Payroll →',
    linkHref: '#contact',
  },
  {
    number: '03',
    title: 'Manpower Management',
    description:
      'Helping organizations streamline workforce operations and improve efficiency and productivity.',
    linkText: 'Explore Manpower Solutions →',
    linkHref: '#contact',
  },
  {
    number: '04',
    title: 'Contractual Manpower Solutions',
    description:
      'Providing skilled professionals on a contractual basis for short-term, project-based and evolving workforce requirements.',
    linkText: 'Explore Contract Staffing →',
    linkHref: '#contact',
  },
  {
    number: '05',
    title: 'Training & Organizational Development',
    description:
      'Helping organizations strengthen their workforce through customized training and organizational development programs.',
    linkText: 'Explore Development →',
    linkHref: '#contact',
  },
];

export const TECH_CARDS: TechCard[] = [
  {
    title: 'ARTIFICIAL INTELLIGENCE',
    description:
      'Talent supporting organizations working across AI-driven technologies and innovation.',
  },
  {
    title: 'QUANTUM TECHNOLOGY',
    description:
      'Specialized workforce opportunities within the emerging quantum technology ecosystem.',
  },
  {
    title: 'BLOCKCHAIN',
    description:
      'Talent supporting organizations exploring blockchain technologies and applications.',
  },
];

export const TECH_BADGES = [
  'Semiconductors',
  'Advanced Manufacturing',
  'Pharmaceuticals',
  'Healthcare',
];

export const INDUSTRIES: IndustryItem[] = [
  {
    number: '01',
    title: 'Healthcare & Pharmaceutical',
    description:
      'Talent supporting healthcare services, pharmaceuticals and biotechnology.',
  },
  {
    number: '02',
    title: 'Manufacturing & Production',
    description:
      'Professionals supporting manufacturing, production and supply chain operations.',
  },
  {
    number: '03',
    title: 'Energy & Utilities',
    description:
      'Workforce solutions across energy, utilities and related operations.',
  },
  {
    number: '04',
    title: 'Retail & E-Commerce',
    description:
      'Professionals supporting consumer businesses, logistics and digital commerce.',
  },
  {
    number: '05',
    title: 'Finance & Insurance',
    description:
      'Talent across financial management and insurance operations.',
  },
  {
    number: '06',
    title: 'Real Estate & Construction',
    description:
      'Professionals supporting development, construction and project management.',
  },
  {
    number: '07',
    title: 'Education & Training',
    description: 'Educators, trainers and workforce professionals.',
  },
  {
    number: '08',
    title: 'Media & Entertainment',
    description:
      'Creative and technical professionals across media and digital production.',
  },
  {
    number: '09',
    title: 'Agriculture & Food',
    description:
      'Workforce solutions across agriculture, food processing and distribution.',
  },
  {
    number: '10',
    title: 'Hospitality & Tourism',
    description:
      'Professionals focused on hospitality operations and customer experience.',
  },
];

export const VETERAN_STEPS = [
  {
    number: '01',
    title: 'RECOGNIZE',
    description:
      'Identify transferable military skills, experience and leadership qualities.',
  },
  {
    number: '02',
    title: 'CONNECT',
    description:
      'Match veteran talent with organizations where their capabilities can create value.',
  },
  {
    number: '03',
    title: 'TRANSITION',
    description:
      'Support the move from military service into meaningful civilian employment.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'UNDERSTAND',
    description:
      "Understand the client's workforce requirements and objectives.",
  },
  {
    number: '02',
    title: 'SOURCE',
    description: 'Identify qualified U.S.-based professionals.',
  },
  {
    number: '03',
    title: 'SCREEN',
    description: 'Evaluate candidates against role requirements.',
  },
  {
    number: '04',
    title: 'MATCH',
    description: 'Connect qualified candidates with suitable opportunities.',
  },
  {
    number: '05',
    title: 'ONBOARD',
    description: 'Support a smooth transition into the organization.',
  },
  {
    number: '06',
    title: 'SUPPORT',
    description: 'Continue supporting long-term workforce success.',
  },
];

export const ACCOUNTABILITY_ITEMS: AccountabilityItem[] = [
  {
    stat: '24 Hours',
    description: 'Initial response to staffing requests.',
  },
  {
    stat: '5 Business Days',
    description: 'Candidate profiles shared, unless otherwise agreed.',
  },
  {
    stat: 'Quality Focused',
    description: 'Candidates aligned with defined job requirements.',
  },
  {
    stat: 'End-to-End Support',
    description: 'Recruitment, placement and onboarding support.',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  /*
  {
    initials: 'AR',
    name: 'Ahsan Rizvi',
    role: 'Director',
    title: 'THE Talent Experts of America',
  },
  {
    initials: 'JR',
    name: 'Joseph Ross',
    role: 'Director',
    title: 'THE Talent Experts of America',
  },
  */
  {
    initials: 'AR',
    name: 'Ahmed Rizvi',
    role: 'Director',
    title: 'THE Talent Experts of America',
    // image: '/director.jpeg',
  },
  {
    initials: 'AW',
    name: 'Arbab Wasi',
    role: 'Director',
    title: 'THE Talent Experts of America',
    // image: '/Ceo.jpeg',
  },
];

export const CONTACT_INFO = {
  phone: '',
  email: 'info@theamerciandreamstaffing.com',
  website: 'theamericandreamstaffing.com',
  footnote: 'Serving organizations and professionals across the United States.',
};

