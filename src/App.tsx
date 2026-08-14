import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
export type Page = 'home' | 'work' | 'project' | 'services' | 'about' | 'pricing' | 'contact';

export interface ProjectResult {
  label: string;
  before: string;
  after: string;
}

export interface Project {
  id: number;
  title: string;
  tagline: string;
  result: string;
  category: 'Web App' | 'E-commerce' | 'Landing Page' | 'Web Design';
  tags: string[];
  image: string;
  challenge: string;
  solution: string;
  results: ProjectResult[];
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
}

export interface TechStackItem {
  name: string;
  textColorClass: string;
  icon: React.ReactNode;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  items: string[];
  icon: 'monitor' | 'document' | 'grid' | 'radial' | 'arrows';
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  subtitle: string;
  badge?: string | null;
  highlighted: boolean;
  features: string[];
  cta: string;
}

export interface CodeSnippet {
  filename: string;
  lines: { text: string; type: 'keyword' | 'string' | 'comment' | 'normal' }[][];
}

// ==========================================
// 2. HARDCODED REALISTIC DATA
// ==========================================
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Orbit Analytics",
    tagline: "Real-time SaaS dashboard",
    result: "Reduced churn 34% with better UX",
    category: "Web App",
    tags: ["Next.js", "TypeScript", "Recharts"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format",
    challenge: "Legacy dashboard suffered from 12s initial load times, 72% mobile drop-off rate, and clunky data visualizations servicing 50k daily active users.",
    solution: "Rebuilt with Next.js App Router, streaming server-side rendering, and WebSocket live metric streaming without performance bottlenecks.",
    results: [
      { label: "Page Load Time", before: "12.4s", after: "1.1s" },
      { label: "Mobile Retention", before: "28%", after: "61%" },
      { label: "User Satisfaction", before: "3.2/5", after: "4.7/5" }
    ],
    quote: "Web Soul transformed our slow legacy app into a blazingly fast interface that our users actually enjoy using every single day. Load times dropped by 90%.",
    quoteAuthor: "Maya Patel",
    quoteRole: "Head of Product"
  },
  {
    id: 2,
    title: "Bloom Botanics",
    tagline: "Premium e-commerce plant brand",
    result: "Conversion rate up 58% post-launch",
    category: "E-commerce",
    tags: ["Next.js", "Stripe", "Sanity"],
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format",
    challenge: "Outgrew generic Etsy store templates, needing a custom brand identity with subscription plant care management and high-converting checkout.",
    solution: "Moving from Etsy, built custom Sanity storefront with Stripe subscriptions, localized currency, and tailored care recommendations.",
    results: [
      { label: "Average Order Value", before: "$48", after: "$94" },
      { label: "Conversion Rate", before: "1.8%", after: "2.9%" },
      { label: "Monthly Revenue", before: "$12k/mo", after: "$38k/mo" }
    ],
    quote: "Our new storefront feels elevated, luxury, and smooth. Sales nearly tripled within two months of our digital relaunch.",
    quoteAuthor: "Cleo Harrington",
    quoteRole: "Founder"
  },
  {
    id: 3,
    title: "Meridian Law",
    tagline: "Authority site for boutique law firm",
    result: "Qualified leads up 220% in 3 months",
    category: "Landing Page",
    tags: ["Next.js", "Tailwind", "Resend"],
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=500&fit=crop&auto=format",
    challenge: "Outdated legal site lacked SEO structured data, failed Core Web Vitals, and failed to filter low-intent prospective legal clients.",
    solution: "Engineered high-converting landing pages built with structured data markup, Core Web Vitals optimization, and an interactive lead-qualification funnel.",
    results: [
      { label: "Google Ranking", before: "Page 6", after: "Page 1" },
      { label: "Organic Traffic", before: "340/mo", after: "2,100/mo" },
      { label: "Qualified Leads", before: "4/mo", after: "27/mo" }
    ],
    quote: "The return on investment was immediate. We went from chasing leads to receiving inquiries from ideal high-value corporate clients.",
    quoteAuthor: "James Okonkwo",
    quoteRole: "Managing Partner"
  },
  {
    id: 4,
    title: "Pulse Fitness",
    tagline: "Booking & membership platform",
    result: "Eliminated $2k/mo in software fees",
    category: "Web App",
    tags: ["React", "Node.js", "Postgres"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&auto=format",
    challenge: "Juggling 4 separate third-party SaaS subscriptions for class scheduling, payment processing, membership tracking, and SMS alerts.",
    solution: "Replaced 4 SaaS tools with a unified custom member portal, class booking schedule, and automated billing engine built on React & Postgres.",
    results: [
      { label: "Software Costs", before: "$2,200/mo", after: "$0/mo" },
      { label: "Class No-Shows", before: "23%", after: "8%" },
      { label: "New Signups", before: "12/mo", after: "34/mo" }
    ],
    quote: "Not only did we save over twenty-four thousand dollars a year in software fees, but member attendance and satisfaction skyrocketed.",
    quoteAuthor: "Dana Ruiz",
    quoteRole: "Operations Director"
  },
  {
    id: 5,
    title: "Volta EV",
    tagline: "Lead gen site for EV charging startup",
    result: "Raised $1.2M with site as investor demo",
    category: "Web Design",
    tags: ["Next.js", "GSAP", "HubSpot"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop&auto=format",
    challenge: "Emerging clean-tech startup needed a compelling visual showcase to present commercial charging infrastructure to investors and prospective host venues.",
    solution: "Built an interactive map showcase, scroll-triggered vector animations, and automated HubSpot CRM integration for prospective hosts.",
    results: [
      { label: "Enterprise Inquiries", before: "0/mo", after: "18/mo" },
      { label: "Investor Meetings", before: "2", after: "14" },
      { label: "Series A Funding", before: "$0", after: "$1.2M" }
    ],
    quote: "Our pitch deck opened doors, but the website Web Soul built closed our seed round. Investors were blown away by the clarity and execution.",
    quoteAuthor: "Nico Vance",
    quoteRole: "CEO"
  },
  {
    id: 6,
    title: "Knack Agency",
    tagline: "Creative consultancy rebrand",
    result: "Won an Awwwards SOTD nomination",
    category: "Web Design",
    tags: ["Webflow", "Figma", "Lottie"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop&auto=format",
    challenge: "Elite creative consultancy had an uninspiring digital footprint that failed to reflect their high-tier client roster and editorial capabilities.",
    solution: "Crafted a bespoke digital experience with editorial typography, bespoke SVG & Lottie animations, and interactive case study layouts.",
    results: [
      { label: "Inbound Leads", before: "2/mo", after: "19/mo" },
      { label: "Avg Project Size", before: "$8k", after: "$28k" },
      { label: "Awwwards Status", before: "None", after: "SOTD Nominee" }
    ],
    quote: "Web Soul gave our agency the digital presence we deserved. It immediately elevated our brand perception and tripled our average deal size.",
    quoteAuthor: "Priya Nair",
    quoteRole: "Creative Director"
  }
];

export const TECH_STACK: TechStackItem[] = [
  {
    name: "Next.js",
    textColorClass: "text-[#0B192C] dark:text-slate-100",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM14.536 7.5H16.25V16.5H14.536V10.223L8.85 16.5H7.5V7.5H9.214V13.777L14.536 7.5Z" className="fill-[#0B192C] dark:fill-white"/>
      </svg>
    )
  },
  {
    name: "React",
    textColorClass: "text-[#0284C7] dark:text-[#61DAFB]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    )
  },
  {
    name: "TypeScript",
    textColorClass: "text-[#1D4ED8] dark:text-[#60A5FA]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0 rounded-xs" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#3178C6"/>
        <path d="M11.5 16.2H10.1V10H8.3V8.8H13.3V10H11.5V16.2ZM14.4 16.2V15.1C14.7 15.6 15.3 16.3 16.5 16.3C17.7 16.3 18.4 15.5 18.4 14.5C18.4 13.3 17.5 12.8 16.5 12.4L16 12.2C15.4 12 15.1 11.7 15.1 11.2C15.1 10.7 15.6 10.3 16.3 10.3C17 10.3 17.5 10.6 17.7 11.1L18.7 10.5C18.3 9.7 17.5 9.1 16.3 9.1C15 9.1 13.9 10 13.9 11.3C13.9 12.6 14.7 13.1 15.7 13.5L16.2 13.7C16.8 13.9 17.2 14.2 17.2 14.7C17.2 15.3 16.6 15.7 15.7 15.7C14.9 15.7 14.3 15.1 14.1 14.6L13.1 15.2C13.4 16.1 14.3 16.7 15.7 16.7" fill="white"/>
      </svg>
    )
  },
  {
    name: "Tailwind",
    textColorClass: "text-[#0284C7] dark:text-[#38BDF8]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#06B6D4"/>
      </svg>
    )
  },
  {
    name: "Node.js",
    textColorClass: "text-[#16A34A] dark:text-[#5FA04E]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2.5 7.5v9L12 22l9.5-5.5v-9L12 2zm7.5 13.62L12 19.96l-7.5-4.34V8.38L12 4.04l7.5 4.34v7.24z" fill="#5FA04E"/>
        <path d="M12 7.5L6.5 10.68v4.64L12 18.5l5.5-3.18v-4.64L12 7.5z" fill="#5FA04E" opacity="0.4"/>
      </svg>
    )
  },
  {
    name: "PostgreSQL",
    textColorClass: "text-[#2563EB] dark:text-[#60A5FA]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.49 0-4.5-2.01-4.5-4.5S10.51 7.5 13 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" fill="#336791"/>
      </svg>
    )
  },
  {
    name: "MongoDB",
    textColorClass: "text-[#16A34A] dark:text-[#47A248]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.5c-.3 0-.5.2-.6.5C9.6 7.2 5 10.3 5 15c0 3.9 3.1 7 7 7s7-3.1 7-7c0-4.7-4.6-7.8-6.4-13-.1-.3-.3-.5-.6-.5zm0 3.2c1.8 3.8 5 6.6 5 10.3 0 2.8-2.2 5-5 5v-15.3z" fill="#47A248"/>
      </svg>
    )
  },
  {
    name: "Stripe",
    textColorClass: "text-[#4F46E5] dark:text-[#818CF8]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.712.748 15.223.23 12.607.23 6.945.23 3.02 3.195 3.02 8.01c0 7.377 10.158 6.208 10.158 9.388 0 1.054-.925 1.547-2.28 1.547-2.613 0-5.385-1.163-7.25-2.164l-.946 5.602c1.942.923 4.887 1.488 7.77 1.488 5.864 0 9.948-2.868 9.948-7.854 0-7.85-10.444-6.529-10.444-9.367Z" fill="#635BFF"/>
      </svg>
    )
  },
  {
    name: "Vercel",
    textColorClass: "text-[#0B192C] dark:text-slate-100",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L24 22H0L12 1Z" className="fill-[#0B192C] dark:fill-white"/>
      </svg>
    )
  },
  {
    name: "Sanity",
    textColorClass: "text-[#DC2626] dark:text-[#F87171]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.64 3.75H7.36C5.36 3.75 3.75 5.36 3.75 7.36V16.64C3.75 18.64 5.36 20.25 7.36 20.25H16.64C18.64 20.25 20.25 18.64 20.25 16.64V7.36C20.25 5.36 18.64 3.75 16.64 3.75ZM15.8 8.8L12.4 12.2L15.8 15.6H13.4L11.2 13.4L9 15.6H6.6L10 12.2L6.6 8.8H9L11.2 11L13.4 8.8H15.8Z" fill="#F03E2F"/>
      </svg>
    )
  },
  {
    name: "Firebase",
    textColorClass: "text-[#D97706] dark:text-[#FFCA28]",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.89 15.672L6.16 3.428c.067-.36.544-.454.747-.156l2.973 4.364L3.89 15.672z" fill="#FFA000"/>
        <path d="M13.435 8.784l-2.457-4.664a.434.434 0 00-.776 0L3.84 15.68l9.595-6.896z" fill="#F57C00"/>
        <path d="M20.16 15.672l-2.585-13.43c-.073-.38-.58-.456-.757-.113l-3.383 6.643 6.725 6.9z" fill="#FFCA28"/>
        <path d="M3.84 15.68l7.632 4.4a1.87 1.87 0 001.888 0l7.632-4.4-8.576 5.07a.936.936 0 01-.952 0L3.84 15.68z" fill="#FFCA28"/>
      </svg>
    )
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "web-design",
    title: "Website Design & Development",
    description: "Custom UI/UX design and engineering built from scratch. Blazing speed, flawless mobile responsiveness, and pixel-perfect design system implementation.",
    items: [
      "Custom UI/UX design",
      "Figma to code pixel-perfect",
      "Mobile-first responsive",
      "CMS integration"
    ],
    icon: "monitor"
  },
  {
    id: "ecommerce",
    title: "E-commerce Development",
    description: "High-converting online stores built with modern headless architectures. Seamless checkout flows, custom subscriptions, and sub-second catalog navigation.",
    items: [
      "Custom Next.js",
      "Stripe & payment integration",
      "Inventory management",
      "Subscription flows"
    ],
    icon: "document"
  },
  {
    id: "webapp",
    title: "Web App Development",
    description: "Scalable full-stack SaaS applications, internal business tools, and client portals built with clean code and robust APIs.",
    items: [
      "React/Next.js/Node.js/Django",
      "Database design & APIs",
      "Auth & user management",
      "Deployment & DevOps"
    ],
    icon: "grid"
  },
  // SEO & Performance
  // {
  //   id: "seo",
  //   title: "SEO & Performance",
  //   description: "Rank higher and load under 1 second. Comprehensive performance audits, automated schema markup, image compression, and Core Web Vitals optimization.",
  //   items: [
  //     "Core Web Vitals audit",
  //     "Structured data markup",
  //     "Image & bundle optimization",
  //     "Monthly SEO reports"
  //   ],
  //   icon: "radial"
  // },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    description: "Keep your web products secure, updated, and lightning fast. Dedicated monthly maintenance, security patches, and priority hotfixes.",
    items: [
      "Monthly content updates",
      "Security monitoring",
      "Uptime monitoring",
      "Priority support"
    ],
    icon: "arrows"
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Deep-dive into your goals, users, and competitive landscape."
  },
  {
    number: "02",
    title: "Design",
    description: "Wireframes and high-fidelity Figma prototypes with your feedback."
  },
  {
    number: "03",
    title: "Build",
    description: "Clean, performant code — tested on every browser and device."
  },
  {
    number: "04",
    title: "Launch",
    description: "Staged deployment with load testing and rollback safety net."
  },
  {
    number: "05",
    title: "Grow",
    description: "Analytics, A/B testing, and continuous improvement post-launch."
  }
];

export const FILTER_CATEGORIES = ['All', 'Web Design', 'Web App', 'E-commerce', 'Landing Page'];

export const PRICING_TIERS: PricingTier[] = [
  // {
  //   id: "starter",
  //   name: "Starter",
  //   price: "$2,500",
  //   period: "one-time",
  //   subtitle: "Ideal for small businesses & targeted landing pages.",
  //   badge: null,
  //   highlighted: false,
  //   features: [
  //     "Up to 5 pages",
  //     "Mobile-responsive design",
  //     "Contact form integration",
  //     "Basic SEO setup",
  //     "1 revision round",
  //     "2 weeks delivery"
  //   ],
  //   cta: "Get Started"
  // },
  {
    id: "growth",
    name: "Growth",
    price: "$2,500",
    period: "one-time",
    subtitle: "Complete digital overhaul for growing brands & startups.",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Up to 12 pages",
      "Custom UI/UX design",
      "CMS integration",
      "Performance audit",
      "Analytics dashboard",
      "3 revision rounds",
      "3 weeks delivery",
      "30 days post-launch support"
    ],
    cta: "Get Started"
  },
  {
    id: "custom",
    name: "Custom",
    price: "Let's talk",
    period: "scoped to project",
    subtitle: "Bespoke SaaS apps, full-stack tools & ongoing retainers.",
    badge: null,
    highlighted: false,
    features: [
      "Unlimited pages & features",
      "Full-stack development",
      "Custom integrations & APIs",
      "Ongoing retainer options",
      "Dedicated project manager",
      "Priority support SLA"
    ],
    cta: "Get a Custom Quote"
  }
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    filename: "orbit-analytics.ts",
    lines: [
      [
        { text: "// Real-time metric streaming hook", type: "comment" }
      ],
      [
        { text: "export ", type: "keyword" },
        { text: "async ", type: "keyword" },
        { text: "function ", type: "keyword" },
        { text: "streamMetrics(id: ", type: "normal" },
        { text: "string", type: "keyword" },
        { text: ") {", type: "normal" }
      ],
      [
        { text: "  const ", type: "keyword" },
        { text: "socket = ", type: "normal" },
        { text: "await ", type: "keyword" },
        { text: "connectSocket(", type: "normal" },
        { text: '"wss://orbit.api"', type: "string" },
        { text: ");", type: "normal" }
      ],
      [
        { text: "  const ", type: "keyword" },
        { text: "metrics = ", type: "normal" },
        { text: "await ", type: "keyword" },
        { text: "socket.subscribe(", type: "normal" },
        { text: '`dash:${id}`', type: "string" },
        { text: ");", type: "normal" }
      ],
      [
        { text: "  return ", type: "keyword" },
        { text: "{ fps: ", type: "normal" },
        { text: "60", type: "string" },
        { text: ", latency: ", type: "normal" },
        { text: '"12ms"', type: "string" },
        { text: ", activeUsers: ", type: "normal" },
        { text: "50420", type: "string" },
        { text: " };", type: "normal" }
      ],
      [
        { text: "}", type: "normal" }
      ]
    ]
  },
  {
    filename: "bloom-botanics.ts",
    lines: [
      [
        { text: "// Headless cart & checkout pipeline", type: "comment" }
      ],
      [
        { text: "export ", type: "keyword" },
        { text: "async ", type: "keyword" },
        { text: "function ", type: "keyword" },
        { text: "checkoutCart(cartId: ", type: "normal" },
        { text: "string", type: "keyword" },
        { text: ") {", type: "normal" }
      ],
      [
        { text: "  const ", type: "keyword" },
        { text: "cart = ", type: "normal" },
        { text: "await ", type: "keyword" },
        { text: "SanityClient.fetchCart(cartId);", type: "normal" }
      ],
      [
        { text: "  const ", type: "keyword" },
        { text: "session = ", type: "normal" },
        { text: "await ", type: "keyword" },
        { text: "Stripe.checkout.create({", type: "normal" }
      ],
      [
        { text: "    items: cart.items, mode: ", type: "normal" },
        { text: '"subscription"', type: "string" }
      ],
      [
        { text: "  });", type: "normal" }
      ],
      [
        { text: "  return ", type: "keyword" },
        { text: "session.url;", type: "normal" }
      ],
      [
        { text: "}", type: "normal" }
      ]
    ]
  },
  {
    filename: "meridian-law.ts",
    lines: [
      [
        { text: "// SEO Structured Schema Generator", type: "comment" }
      ],
      [
        { text: "export ", type: "keyword" },
        { text: "function ", type: "keyword" },
        { text: "generateSchema(firmData: ", type: "normal" },
        { text: "LawFirm", type: "keyword" },
        { text: ") {", type: "normal" }
      ],
      [
        { text: "  const ", type: "keyword" },
        { text: "schema = {", type: "normal" }
      ],
      [
        { text: "    ", type: "normal" },
        { text: '"@type"', type: "string" },
        { text: ": ", type: "normal" },
        { text: '"LegalService"', type: "string" },
        { text: ",", type: "normal" }
      ],
      [
        { text: "    name: firmData.name, vitals: ", type: "normal" },
        { text: '"Sub-1s LCP"', type: "string" }
      ],
      [
        { text: "  };", type: "normal" }
      ],
      [
        { text: "  return ", type: "keyword" },
        { text: "JSON.stringify(schema);", type: "normal" }
      ],
      [
        { text: "}", type: "normal" }
      ]
    ]
  }
];

// ==========================================
// 3. SCROLL REVEAL SYSTEM
// ==========================================
export function useScrollReveal(threshold = 0.05) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal(0.05);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ==========================================
// 4. REUSABLE BUTTON & TOGGLE COMPONENTS
// ==========================================
export function ThemeToggle({
  darkMode,
  toggleDarkMode,
  className = '',
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        darkMode
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-slate-600 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
      } ${className}`}
      aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? (
        <img src="/websoul_logo/favicondark.png" alt="Dark Mode" className="w-5 h-5 object-cover" />
      ) : (
        <img src="/websoul_logo/favicon.png" alt="Light Mode" className="w-5 h-5 object-cover" />
      )}
    </button>
  );
}

export function ButtonPrimary({
  children,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium text-sm text-white bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${className}`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({
  children,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium text-sm text-[#0B192C] dark:text-slate-100 bg-white dark:bg-slate-800 border border-[#0B192C]/20 dark:border-slate-700 hover:border-[#0B192C] dark:hover:border-slate-500 hover:bg-[#0B192C]/5 dark:hover:bg-slate-700/80 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${className}`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </button>
  );
}

// Service Icons SVG Helper
function ServiceIcon({ type }: { type: ServiceItem['icon'] }) {
  if (type === 'monitor') {
    return (
      <svg className="w-6 h-6 text-[#0B192C] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M7 8l3 3-3 3" />
        <line x1="13" y1="14" x2="17" y2="14" />
      </svg>
    );
  }
  if (type === 'document') {
    return (
      <svg className="w-6 h-6 text-[#0B192C] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="12" cy="15" r="3" />
        <line x1="12" y1="13.5" x2="12" y2="16.5" />
        <line x1="10.5" y1="15" x2="13.5" y2="15" />
      </svg>
    );
  }
  if (type === 'grid') {
    return (
      <svg className="w-6 h-6 text-[#0B192C] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
  }
  if (type === 'radial') {
    return (
      <svg className="w-6 h-6 text-[#0B192C] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6 text-[#0B192C] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

// ==========================================
// 5. NAVIGATION COMPONENT
// ==========================================
// ==========================================
// LOGO COMPONENTS WITH MATCHED DIMENSIONS & CROSS-FADE
// ==========================================
export function HeaderLogo({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className="relative h-5 sm:h-6 flex items-center justify-center">
      <img
        src="/websoul_logo/header_logo-removebg-preview.png"
        alt="Web Soul Logo"
        className={`h-5 sm:h-6 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}
      />
      <img
        src="/websoul_logo/dark_mode/header_logo.png"
        alt="Web Soul Logo"
        className={`h-5 sm:h-6 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute'
        }`}
      />
    </div>
  );
}

export function MobileHeaderLogo({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className="relative h-6 sm:h-7 flex items-center justify-center">
      <img
        src="/websoul_logo/header_logo-removebg-preview.png"
        alt="Web Soul Logo"
        className={`h-6 sm:h-7 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}
      />
      <img
        src="/websoul_logo/dark_mode/header_logo.png"
        alt="Web Soul Logo"
        className={`h-6 sm:h-7 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute'
        }`}
      />
    </div>
  );
}

export function FooterLogo({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className="relative h-16 flex items-center justify-center">
      <img
        src="/websoul_logo/footer_logo-removebg-preview.png"
        alt="Web Soul Logo"
        className={`h-16 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}
      />
      <img
        src="/websoul_logo/dark_mode/footer_logo.png"
        alt="Web Soul Logo"
        className={`h-16 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute'
        }`}
      />
    </div>
  );
}

export function IntroLogo({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className="relative h-12 sm:h-16 md:h-20 flex items-center justify-center">
      <img
        src="/websoul_logo/header_logo-removebg-preview.png"
        alt="Web Soul Logo"
        className={`h-12 sm:h-16 md:h-20 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}
      />
      <img
        src="/websoul_logo/dark_mode/header_logo.png"
        alt="Web Soul Logo"
        className={`h-12 sm:h-16 md:h-20 w-auto object-contain transition-opacity duration-300 ease-in-out ${
          darkMode ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute'
        }`}
      />
    </div>
  );
}

// ==========================================
// 5. NAVIGATION COMPONENT
// ==========================================
export function Nav({
  currentPage,
  navigate,
  darkMode,
  toggleDarkMode,
}: {
  currentPage: Page;
  navigate: (page: Page, id?: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Automatically close mobile menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks: { page: Page; label: string }[] = [
    { page: 'work', label: 'Work' },
    { page: 'services', label: 'Services' },
    { page: 'about', label: 'About' },
    { page: 'pricing', label: 'Pricing' },
    { page: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 nav-blur transition-all duration-300 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12"
        style={{
          backgroundColor: darkMode
            ? scrolled || mobileMenuOpen
              ? 'rgba(15, 23, 42, 0.96)'
              : 'rgba(15, 23, 42, 0.85)'
            : scrolled || mobileMenuOpen
              ? 'rgba(255, 255, 255, 0.96)'
              : 'rgba(255, 255, 255, 0.8)',
          borderBottom: darkMode
            ? scrolled || mobileMenuOpen
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid transparent'
            : scrolled || mobileMenuOpen
              ? '1px solid rgba(15, 23, 42, 0.08)'
              : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Header Logo */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('home');
            }}
            className="flex items-center gap-3 cursor-pointer group text-left"
            aria-label="Web Soul Home"
          >
            <div className="h-8 sm:h-9 px-2.5 sm:px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl flex items-center shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_4px_20px_rgba(11,25,44,0.1)]">
              <HeaderLogo darkMode={darkMode} />
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  className={`text-sm transition-colors cursor-pointer link-underline ${
                    isActive
                      ? 'text-[#0B192C] dark:text-white font-semibold'
                      : 'text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <ButtonPrimary onClick={() => navigate('contact')}>
              Get a Quote
            </ButtonPrimary>
          </nav>

          {/* Mobile Hamburger & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#0B192C] dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-6 h-6 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden flex flex-col justify-between overflow-y-auto ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
        style={{
          boxShadow: mobileMenuOpen ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none',
        }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between h-full min-h-max">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(link.page);
                  }}
                  className={`text-lg sm:text-xl font-medium text-left px-4 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-[#0B192C] dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#0B192C] dark:hover:text-white'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B192C] dark:bg-sky-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-6 pb-4 border-t border-slate-100 dark:border-slate-800/80 mt-6">
            <ButtonPrimary
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('contact');
              }}
              className="w-full text-center py-3.5 text-base shadow-md justify-center"
            >
              Get a Quote
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// 6. FOOTER COMPONENT
// ==========================================
export function Footer({ navigate, darkMode }: { navigate: (page: Page, id?: number) => void; darkMode?: boolean }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-20 py-10 sm:py-12 bg-[#F8FAFC] dark:bg-slate-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-12">
          {/* Left: Logo & Tagline */}
          <div className="max-w-sm">
            <div
              onClick={() => navigate('home')}
              className="cursor-pointer mb-4 inline-block group"
            >
              <div className="p-3 sm:p-3.5 bg-white dark:bg-slate-800 rounded-2xl inline-flex items-center shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_30px_rgba(11,25,44,0.12)]">
                <FooterLogo darkMode={darkMode} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
              Building ultra-performant, high-converting digital products for startups and growing businesses. Hand-crafted code, zero bloat.
            </p>
          </div>

          {/* Right: Navigate & Connect columns */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16 md:gap-20">
            {/* Column 1: Navigate */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-mono-tech text-[#0B192C] dark:text-slate-200 font-semibold mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {(['work', 'services', 'about', 'pricing', 'contact'] as Page[]).map((p) => (
                  <li key={p}>
                    <button
                      onClick={() => navigate(p)}
                      className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white link-underline capitalize cursor-pointer font-medium"
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Connect */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-mono-tech text-[#0B192C] dark:text-slate-200 font-semibold mb-4">
                Connect
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white link-underline cursor-pointer font-medium"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white link-underline cursor-pointer font-medium"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://upwork.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white link-underline cursor-pointer font-medium"
                  >
                    Upwork
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@websoul.tech"
                    className="text-xs sm:text-sm text-[#0B192C] dark:text-blue-400 font-semibold hover:underline font-mono-tech cursor-pointer"
                  >
                    hello@websoul.tech
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-xs font-mono-tech text-[#64748B] dark:text-slate-500">
            copyright © 2026 Web Soul. All rights reserved.
          </p>
          <p className="text-xs font-mono-tech text-[#64748B] dark:text-slate-500">
            Designed & built by Web Soul
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// 7. HOME PAGE
// ==========================================
export function HomePage({ navigate }: { navigate: (page: Page, id?: number) => void }) {
  const [snippetIndex, setSnippetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentSnippet = CODE_SNIPPETS[snippetIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center overflow-hidden relative pt-16">
        {/* Backgrounds */}
        <div className="hero-mesh absolute inset-0 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(11, 25, 44, 0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            backgroundImage:
              'linear-gradient(rgba(11, 25, 44, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(11, 25, 44, 0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-tech bg-[#0B192C]/5 dark:bg-blue-950/50 border border-[#0B192C]/15 dark:border-blue-500/30 text-[#0B192C] dark:text-blue-300 font-semibold mb-5 sm:mb-6 max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#0B192C] dark:bg-blue-400 animate-pulse shrink-0" />
                <span className="truncate">Available for new projects</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 text-[#0B192C] dark:text-slate-100"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                We build fast, modern websites that turn{' '}
                <span className="gradient-text">visitors into customers.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#475569] dark:text-slate-400 max-w-lg mb-6 sm:mb-8 leading-relaxed font-normal">
                Web development and design for startups and businesses that want to grow. No templates, no shortcuts — just hand-crafted code that performs.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <ButtonPrimary onClick={() => navigate('work')} className="w-full sm:w-auto justify-center text-center">
                  View My Work →
                </ButtonPrimary>
                <ButtonSecondary onClick={() => navigate('contact')} className="w-full sm:w-auto justify-center text-center">
                  Start a Project
                </ButtonSecondary>
              </div>

              {/* Stat Mini Cards for Mobile & Tablet (below lg) */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-8 lg:hidden">
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-[#64748B] dark:text-slate-400 mb-0.5 font-mono-tech">Avg. load</div>
                  <div className="text-base sm:text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>0.9s</div>
                </div>
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-[#64748B] dark:text-slate-400 mb-0.5 font-mono-tech">Shipped</div>
                  <div className="text-base sm:text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>47+</div>
                </div>
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-[#64748B] dark:text-slate-400 mb-0.5 font-mono-tech">Rating</div>
                  <div className="text-base sm:text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>4.9/5</div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor Mockup (Desktop lg+) */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-[#0B192C] dark:bg-[#09101E] rounded-xl border border-[#0B192C]/20 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono-tech text-slate-300">
                    {currentSnippet.filename}
                  </span>
                </div>

                {/* Code Area */}
                <div className="p-5 min-h-[220px] font-mono-tech text-xs leading-relaxed overflow-x-auto bg-[#07111E]">
                  {currentSnippet.lines.map((line, lIdx) => (
                    <div key={lIdx} className="whitespace-pre">
                      {line.map((token, tIdx) => {
                        let colorClass = 'text-slate-200';
                        if (token.type === 'keyword') colorClass = 'text-[#60A5FA] font-semibold';
                        if (token.type === 'string') colorClass = 'text-[#38BDF8]';
                        if (token.type === 'comment') colorClass = 'text-slate-400 italic';
                        return (
                          <span key={tIdx} className={colorClass}>
                            {token.text}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Bottom Indicators */}
                <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-center gap-2 bg-[#0B192C] dark:bg-[#09101E]">
                  {CODE_SNIPPETS.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === snippetIndex ? 'bg-[#38BDF8] w-5' : 'bg-slate-400 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stat Mini Cards for Desktop */}
              <div className="flex items-center justify-between gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-3 flex-1 text-center">
                  <div className="text-xs text-[#64748B] dark:text-slate-400 mb-1 font-mono-tech">Avg. load time</div>
                  <div className="text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>0.9s</div>
                </div>
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-3 flex-1 text-center">
                  <div className="text-xs text-[#64748B] dark:text-slate-400 mb-1 font-mono-tech">Projects shipped</div>
                  <div className="text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>47+</div>
                </div>
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-3 flex-1 text-center">
                  <div className="text-xs text-[#64748B] dark:text-slate-400 mb-1 font-mono-tech">Client satisfaction</div>
                  <div className="text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>4.9/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR / TECH STACK */}
      <section className="py-8 sm:py-12 border-y border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <h3 className="text-xs uppercase tracking-widest mb-5 sm:mb-7 font-mono-tech text-[#0B192C] dark:text-slate-300 font-semibold text-center">
              Tech stack I work with
            </h3>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-3.5">
            {TECH_STACK.map((tech, idx) => (
              <Reveal key={tech.name} delay={idx * 60}>
                <div
                  className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/90 text-xs sm:text-sm font-mono-tech bg-white/90 dark:bg-[#131C2D] hover:bg-white dark:hover:bg-[#1E293B] shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center gap-2 sm:gap-2.5 group shrink-0"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110 shrink-0">
                    {tech.icon}
                  </span>
                  <span className={`font-medium whitespace-nowrap ${tech.textColorClass}`}>
                    {tech.name}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
                Selected Work
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Projects that moved the needle.
              </h2>
            </div>
            <button
              onClick={() => navigate('work')}
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[#0B192C] dark:text-blue-400 hover:underline font-mono-tech font-semibold link-underline cursor-pointer shrink-0"
            >
              View all work →
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROJECTS.slice(0, 3).map((project, idx) => (
            <Reveal key={project.id} delay={idx * 100}>
              <div
                onClick={() => navigate('project', project.id)}
                className="card-hover glimmer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm cursor-pointer flex flex-col justify-between group h-full"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-xs font-mono-tech text-[#0B192C] dark:text-blue-400 font-semibold uppercase tracking-wider block mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mb-4 leading-relaxed">
                      {project.result}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] sm:text-xs font-mono-tech px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-[#475569] dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile button */}
        <div className="mt-8 text-center sm:hidden">
          <ButtonSecondary onClick={() => navigate('work')} className="w-full justify-center text-center">
            View All Work →
          </ButtonSecondary>
        </div>
      </section>

      {/* SERVICES SNAPSHOT */}
      <section className="py-14 sm:py-20 bg-[#F8FAFC] dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
                Services
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] dark:text-white mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                End-to-end web engineering.
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                Everything you need to build, launch, and scale modern web platforms. Hand-crafted code designed to convert.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {SERVICES.slice(0, 4).map((service, idx) => (
              <Reveal key={service.id} delay={idx * 80}>
                <div className="card-hover rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#0B192C]/5 dark:bg-blue-950/40 border border-[#0B192C]/10 dark:border-blue-500/20 flex items-center justify-center mb-4 sm:mb-5">
                      <ServiceIcon type={service.icon} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0B192C] dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <button
              onClick={() => navigate('services')}
              className="text-xs sm:text-sm text-[#0B192C] dark:text-blue-400 hover:underline font-mono-tech font-semibold link-underline cursor-pointer"
            >
              See all services →
            </button>
          </div>
        </div>
      </section>

      {/* PROCESS PREVIEW */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
              Process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              From idea to live site.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
          <div className="hidden md:block absolute process-line opacity-20 top-14 left-[10%] right-[10%] h-px z-0 pointer-events-none" />

          {PROCESS_STEPS.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 80} className="relative z-10 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#0B192C] dark:border-blue-400 bg-white dark:bg-slate-800 flex items-center justify-center text-base sm:text-lg font-bold font-mono-tech text-[#0B192C] dark:text-slate-100 mx-auto mb-3 sm:mb-4 shadow-sm">
                {step.number}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0B192C] dark:text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {step.title}
              </h3>
              <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-14 sm:py-20 bg-[#F8FAFC] dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-300">
        <Reveal>
          <div className="max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 md:p-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md relative overflow-hidden">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6 opacity-90 text-[#0B192C] dark:text-blue-400" viewBox="0 0 40 40" fill="currentColor">
              <path d="M12 22H6C6 16.5 9.5 12 15 11V15C12 16 11 18 11 20H15V28H7V22H12Z" />
              <path d="M30 22H24C24 16.5 27.5 12 33 11V15C30 16 29 18 29 20H33V28H25V22H30Z" />
            </svg>

            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0B192C] dark:text-slate-100 leading-snug mb-6 sm:mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              "Web Soul transformed our slow legacy app into a blazingly fast interface that our users actually enjoy using every single day. Load times dropped by 90%."
            </blockquote>

            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format"
                alt="Maya Patel"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
              />
              <div>
                <div className="text-sm sm:text-base font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Maya Patel
                </div>
                <div className="text-xs font-mono-tech text-[#1E3A8A] dark:text-blue-400 font-semibold">
                  Head of Product at Orbit Analytics
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <Reveal>
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-3 sm:mb-4">
            Ready to build?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B192C] dark:text-white mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Have a project in mind? <span className="gradient-text">Let's talk.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-slate-400 max-w-xl mb-6 sm:mb-8 leading-relaxed">
            Get in touch to discuss your goals, timeline, and budget. No pressure, just a friendly chat about how we can help.
          </p>
          <ButtonPrimary onClick={() => navigate('contact')} className="px-8 py-4 text-base">
            Contact Us →
          </ButtonPrimary>
        </Reveal>
      </section>
    </div>
  );
}

// ==========================================
// 8. WORK PAGE
// ==========================================
export function WorkPage({ navigate }: { navigate: (page: Page, id?: number) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <Reveal>
        <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
          Portfolio
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Our Work
        </h1>
        <p className="text-base sm:text-lg text-[#475569] dark:text-slate-400 max-w-xl">
          47 projects shipped. Here are the ones that mattered most.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 my-6 sm:my-8">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-mono-tech transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B192C] dark:bg-blue-600 text-white border border-[#0B192C] dark:border-blue-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0B192C] dark:hover:border-slate-500 hover:text-[#0B192C] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((project, idx) => (
          <Reveal key={project.id} delay={idx * 80}>
            <div
              onClick={() => navigate('project', project.id)}
              className="card-hover glimmer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs cursor-pointer group flex flex-col justify-between h-full"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0B192C]/80 dark:bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-bold font-mono-tech text-white bg-white/20 dark:bg-slate-800/40 px-4 py-2 rounded-full border border-white/30 backdrop-blur-xs">
                    View Case Study →
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-xs font-mono-tech text-[#0B192C] dark:text-blue-400 font-semibold uppercase tracking-wider block mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mb-4 leading-relaxed">
                    {project.result}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] sm:text-xs font-mono-tech px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-[#475569] dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 9. PROJECT DETAIL PAGE
// ==========================================
export function ProjectDetailPage({
  projectId,
  navigate,
}: {
  projectId: number;
  navigate: (page: Page, id?: number) => void;
}) {
  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];

  const prevProjectId = project.id === 1 ? PROJECTS[PROJECTS.length - 1].id : project.id - 1;
  const nextProjectId = project.id === PROJECTS.length ? 1 : project.id + 1;

  return (
    <div className="max-w-4xl mx-auto pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <Reveal>
        <button
          onClick={() => navigate('work')}
          className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#0B192C] dark:text-blue-400 font-semibold hover:underline mb-5 sm:mb-6 cursor-pointer"
        >
          ← Back to Work
        </button>

        <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
          {project.category}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-2 sm:mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {project.title}
        </h1>
        <p className="text-lg sm:text-xl text-[#475569] dark:text-slate-400 mb-6 sm:mb-8">
          {project.tagline}
        </p>

        {/* Featured Image */}
        <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8 sm:mb-12 shadow-lg">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white mb-2.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The Challenge
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-300 leading-relaxed">
              {project.challenge}
            </p>
          </div>
          <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white mb-2.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The Solution
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-300 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Tech Stack Used */}
        <div className="mb-8 sm:mb-12">
          <h4 className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-slate-300 font-semibold mb-3 sm:mb-4">
            Tech Stack Used
          </h4>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg px-3 py-1.5 font-mono-tech text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[#0B192C] dark:text-slate-200 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Results Row */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Key Impact & Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {project.results.map((res, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs flex flex-col justify-between"
              >
                <span className="text-xs font-mono-tech text-[#64748B] dark:text-slate-400 mb-2 sm:mb-3 uppercase tracking-wider block font-semibold">
                  {res.label}
                </span>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm text-[#94A3B8] line-through decoration-[#0B192C] dark:decoration-blue-400">
                    {res.before}
                  </span>
                  <span className="text-[#0B192C] dark:text-blue-400 font-bold">→</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {res.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Quote */}
        <div className="rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700 border-l-4 border-l-[#0B192C] dark:border-l-blue-500 bg-[#F8FAFC] dark:bg-slate-800/60 mb-12 sm:mb-16">
          <p className="text-base sm:text-lg italic text-[#0B192C] dark:text-slate-100 mb-3 sm:mb-4 leading-relaxed">
            "{project.quote}"
          </p>
          <div className="text-xs sm:text-sm font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {project.quoteAuthor}{' '}
            <span className="font-normal font-mono-tech text-[#475569] dark:text-slate-400 text-xs">
              — {project.quoteRole}
            </span>
          </div>
        </div>

        {/* Prev / Next Pagination */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <button
            onClick={() => navigate('project', prevProjectId)}
            className="w-full sm:w-auto text-center sm:text-left text-xs sm:text-sm font-mono-tech text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white font-medium transition-colors cursor-pointer py-2 sm:py-0"
          >
            ← Previous Project
          </button>
          <button
            onClick={() => navigate('project', nextProjectId)}
            className="w-full sm:w-auto text-center sm:text-right text-xs sm:text-sm font-mono-tech text-[#475569] dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white font-medium transition-colors cursor-pointer py-2 sm:py-0"
          >
            Next Project →
          </button>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <ButtonPrimary onClick={() => navigate('contact')} className="px-8 py-4 text-base mx-auto">
            Start a Project →
          </ButtonPrimary>
        </div>
      </Reveal>
    </div>
  );
}

// ==========================================
// 10. SERVICES PAGE
// ==========================================
export function ServicesPage({ navigate }: { navigate: (page: Page, id?: number) => void }) {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
            What We Do
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Services engineered for digital growth.
          </h1>
          <p className="text-xs sm:text-base text-[#475569] dark:text-slate-400">
            From bespoke custom design to complex full-stack web applications.
          </p>
        </div>
      </Reveal>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
        {SERVICES.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 80}>
            <div className="rounded-xl p-5 sm:p-7 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs card-hover flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#0B192C]/5 dark:bg-blue-950/40 border border-[#0B192C]/10 dark:border-blue-500/20 flex items-center justify-center mb-4 sm:mb-5">
                  <ServiceIcon type={service.icon} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white mb-2 sm:mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed mb-5 sm:mb-6">
                  {service.description}
                </p>
              </div>
              <ul className="space-y-2 sm:space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-700">
                {service.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-2.5 text-xs text-[#334155] dark:text-slate-300 font-mono-tech font-medium">
                    <span className="text-[#0B192C] dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Process Vertical Timeline */}
      <Reveal>
        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white text-center mb-10 sm:mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Our 5-Step Execution Method
          </h2>

          <div className="space-y-8 sm:space-y-10 relative">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.number} className="flex gap-4 sm:gap-6 relative">
                {/* Timeline connector line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute top-10 sm:top-12 left-5 sm:left-6 bottom-[-32px] sm:bottom-[-40px] w-0.5 bg-slate-200 dark:bg-slate-700 transform -translate-x-1/2" />
                )}

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0B192C] dark:border-blue-400 bg-white dark:bg-slate-800 text-[#0B192C] dark:text-slate-100 font-mono-tech font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 z-10 shadow-xs">
                  {step.number}
                </div>

                <div className="pt-0.5 sm:pt-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#0B192C] dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Final CTA */}
      <Reveal className="text-center mt-16 sm:mt-20">
        <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto shadow-xs">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white mb-2 sm:mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Need a tailored service package?
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mb-6">
            We offer custom retainers, dedicated engineering hours, and project-based quotes tailored to your exact roadmap.
          </p>
          <ButtonPrimary onClick={() => navigate('contact')} className="mx-auto">
            Get a Custom Quote
          </ButtonPrimary>
        </div>
      </Reveal>
    </div>
  );
}

// ==========================================
// 11. ABOUT PAGE
// ==========================================
export function AboutPage({ navigate }: { navigate: (page: Page, id?: number) => void }) {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column */}
        <Reveal>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&auto=format"
              alt="Web Soul Engineering Team"
              className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] object-cover rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl mb-4 sm:mb-6"
            />
            <div className="rounded-xl p-4 sm:p-6 border-l-4 border-l-[#0B192C] dark:border-l-blue-500 bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="italic text-xs sm:text-sm text-[#0B192C] dark:text-slate-200 font-medium mb-1.5 leading-relaxed">
                "Every line of code is a design decision. I care about both."
              </p>
              <span className="text-[11px] sm:text-xs font-mono-tech text-[#64748B] dark:text-slate-400 block">
                — Web Soul Engineering Philosophy
              </span>
            </div>
          </div>
        </Reveal>

        {/* Right Column */}
        <Reveal delay={100}>
          <div>
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
              About Web Soul
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              I build for performance <span className="gradient-text">and people.</span>
            </h1>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed mb-6 sm:mb-8">
              <p>
                Web Soul is an independent web design and engineering studio founded with a single mission: to craft custom digital experiences that bridge high-end visual aesthetics with uncompromising technical performance.
              </p>
              <p>
                We believe that modern websites shouldn't require trade-offs between speed and visual impact. By avoiding bloated site builders and template shortcuts, every project is custom-engineered using modern web standards to load instantly, convert visitors, and scale effortlessly.
              </p>
              <p>
                Whether you're a venture-backed startup launching a new product or an established business seeking to overhaul your digital presence, Web Soul provides direct senior-level craftsmanship from first mockup to final production deployment.
              </p>
            </div>

            {/* Core Tech Stack Chips */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-slate-300 font-semibold mb-3">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {TECH_STACK.map((t) => (
                  <span
                    key={t.name}
                    className="rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-mono-tech text-xs bg-white dark:bg-[#131C2D] border border-slate-200 dark:border-slate-800/90 font-medium flex items-center gap-2 shadow-xs hover:scale-105 transition-transform duration-200 cursor-default"
                  >
                    {t.icon}
                    <span className={t.textColorClass}>
                      {t.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <ButtonPrimary onClick={() => navigate('contact')} className="w-full sm:w-auto text-center justify-center">
                Start a Project
              </ButtonPrimary>
              <ButtonSecondary onClick={() => navigate('work')} className="w-full sm:w-auto text-center justify-center">
                View My Work
              </ButtonSecondary>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ==========================================
// 12. PRICING PAGE
// ==========================================
export function PricingPage({ navigate }: { navigate: (page: Page, id?: number) => void }) {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple, predictable investments.
          </h1>
          <p className="text-xs sm:text-base text-[#475569] dark:text-slate-400">
            No surprise invoices, hidden fees, or recurring license traps. Just clear scope and fixed delivery.
          </p>
        </div>
      </Reveal>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto my-12 sm:my-16 items-stretch">
        {PRICING_TIERS.map((tier, idx) => (
          <Reveal key={tier.id} delay={idx * 100} className="h-full flex">
            <div
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between w-full relative transition-all duration-300 ${
                tier.highlighted
                  ? 'border-2 border-[#0B192C] dark:border-blue-500 bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-800 dark:to-slate-900 shadow-xl dark:shadow-blue-950/20 lg:-translate-y-2'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 card-hover shadow-xs'
              }`}
            >
              {/* Badge for highlighted card */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#0B192C] dark:bg-blue-600 text-xs font-mono-tech font-bold text-white shadow-md whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {tier.name}
                </h3>
                <div className="mb-2">
                  <span
                    className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-xs font-normal font-mono-tech text-[#64748B] dark:text-slate-400 ml-2">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#475569] dark:text-slate-400 mb-6">
                  {tier.subtitle}
                </p>

                <ul className="space-y-2.5 sm:space-y-3 pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-700 mb-6 sm:mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 sm:gap-3 text-xs text-[#334155] dark:text-slate-300 font-mono-tech font-medium">
                      <span className="text-[#0B192C] dark:text-blue-400 font-bold shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {tier.highlighted ? (
                  <ButtonPrimary onClick={() => navigate('contact')} className="w-full text-center py-3.5 justify-center">
                    {tier.cta}
                  </ButtonPrimary>
                ) : (
                  <ButtonSecondary onClick={() => navigate('contact')} className="w-full text-center py-3.5 justify-center">
                    {tier.cta}
                  </ButtonSecondary>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Info Card */}
      <Reveal>
        <div className="max-w-3xl mx-auto bg-[#F8FAFC] dark:bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 text-center flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="text-left">
            <h4 className="text-base sm:text-lg font-bold text-[#0B192C] dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Not sure which plan fits your project?
            </h4>
            <p className="text-xs text-[#475569] dark:text-slate-400">
              We can customize a scope that aligns perfectly with your timeline and budget goals.
            </p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="text-xs sm:text-sm font-mono-tech text-[#0B192C] dark:text-blue-400 font-semibold hover:underline shrink-0 cursor-pointer"
          >
            Schedule a Consultation →
          </button>
        </div>
      </Reveal>
    </div>
  );
}

// ==========================================
// 13. CONTACT PAGE
// ==========================================
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: 'Under $2,500',
    projectType: 'Website',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column */}
        <Reveal>
          <div>
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Let's build something <span className="gradient-text">great.</span>
            </h1>
            <p className="text-xs sm:text-base text-[#475569] dark:text-slate-400 leading-relaxed mb-6 sm:mb-8">
              Have a project idea, refactor need, or strategic inquiry? Fill out the form or reach out directly via email or socials.
            </p>

            {/* Contact details list */}
            <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm font-mono-tech mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-[#64748B] dark:text-slate-400 sm:w-24 shrink-0 font-semibold">EMAIL</span>
                <a
                  href="mailto:hello@websoul.tech"
                  className="text-[#0B192C] dark:text-blue-400 font-semibold hover:underline link-underline cursor-pointer break-all"
                >
                  hello@websoul.tech
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-[#64748B] dark:text-slate-400 sm:w-24 shrink-0 font-semibold">LOCATION</span>
                <span className="text-[#334155] dark:text-slate-300 font-medium">San Francisco, CA (Remote)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-[#64748B] dark:text-slate-400 sm:w-24 shrink-0 font-semibold">SOCIAL</span>
                <div className="flex gap-3 text-[#0B192C] dark:text-slate-200 font-semibold">
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <a href="https://upwork.com" target="_blank" rel="noreferrer" className="hover:underline">Upwork</a>
                </div>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-[#0B192C]/5 dark:bg-blue-950/50 border-[#0B192C]/15 dark:border-blue-500/30 max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B192C] dark:bg-blue-400 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono-tech text-[#0B192C] dark:text-blue-300 font-semibold leading-tight">
                Response time: I usually reply within 24 hours
              </span>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Form Card */}
        <Reveal delay={100}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
            {submitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B192C]/10 dark:bg-blue-950/40 border border-[#0B192C] dark:border-blue-400 text-[#0B192C] dark:text-blue-400 flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 font-bold">
                  ✓
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Message sent!
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mb-6">
                  I'll get back to you within 24 hours.
                </p>
                <ButtonSecondary
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      budget: 'Under $2,500',
                      projectType: 'Website',
                      message: '',
                    });
                  }}
                  className="mx-auto"
                >
                  Send Another Message
                </ButtonSecondary>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs font-mono-tech text-[#0B192C] dark:text-slate-300 uppercase tracking-wider mb-2 font-semibold">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-[#0B192C] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#0B192C] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-colors text-xs sm:text-sm min-h-[44px]"
                  />
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs font-mono-tech text-[#0B192C] dark:text-slate-300 uppercase tracking-wider mb-2 font-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-[#0B192C] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#0B192C] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-colors text-xs sm:text-sm min-h-[44px]"
                  />
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs font-mono-tech text-[#0B192C] dark:text-slate-300 uppercase tracking-wider mb-2 font-semibold">
                    Budget Range *
                  </label>
                  <select
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-[#0B192C] dark:text-white focus:outline-none focus:border-[#0B192C] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-colors text-xs sm:text-sm cursor-pointer min-h-[44px]"
                  >
                    <option value="Under $2,500">Under $2,500</option>
                    <option value="$2,500–$6,500">$2,500–$6,500</option>
                    <option value="$6,500–$15,000">$6,500–$15,000</option>
                    <option value="$15,000+">$15,000+</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs font-mono-tech text-[#0B192C] dark:text-slate-300 uppercase tracking-wider mb-2 font-semibold">
                    Project Type *
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-[#0B192C] dark:text-white focus:outline-none focus:border-[#0B192C] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-colors text-xs sm:text-sm cursor-pointer min-h-[44px]"
                  >
                    <option value="Website">Website</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="E-commerce Store">E-commerce Store</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Redesign & Rebuild">Redesign & Rebuild</option>
                    <option value="Maintenance & Support">Maintenance & Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-5 sm:mb-6">
                  <label className="block text-xs font-mono-tech text-[#0B192C] dark:text-slate-300 uppercase tracking-wider mb-2 font-semibold">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project goals, timelines, or requirements..."
                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-[#0B192C] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#0B192C] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-colors text-xs sm:text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 cursor-pointer shadow-md min-h-[44px]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ==========================================
// 14. LOGO INTRO COMPONENT
// ==========================================
export function LogoIntro({ onComplete, darkMode }: { onComplete: () => void; darkMode?: boolean }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Prevent scrolling while intro animation plays
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Start overlay fade-out after 1050ms
    const fadeTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1050);

    // Complete transition and unmount component at 1400ms total
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white dark:bg-[#0F172A] flex flex-col items-center justify-center pointer-events-none select-none transition-all ${
        isExiting ? 'animate-intro-exit' : ''
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Brand Logo Container */}
        <div className="relative animate-logo-intro animate-logo-sheen px-8 py-5 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_12px_40px_rgba(11,25,44,0.08)] border border-slate-100 dark:border-slate-700 flex items-center justify-center">
          <IntroLogo darkMode={darkMode} />
        </div>

        {/* Subtle accent line below logo */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#0B192C] dark:via-blue-400 to-transparent mt-6 rounded-full opacity-60 animate-pulse" />
      </div>
    </div>
  );
}

// ==========================================
// 15. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [projectId, setProjectId] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('websoul_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('websoul_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('websoul_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const navigate = (page: Page, id?: number) => {
    setCurrentPage(page);
    if (id !== undefined) {
      setProjectId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#334155] dark:text-slate-300 flex flex-col justify-between selection:bg-[#0B192C] selection:text-white transition-colors duration-300">
      {showIntro && <LogoIntro onComplete={() => setShowIntro(false)} darkMode={darkMode} />}

      <div>
        <Nav
          currentPage={currentPage}
          navigate={navigate}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main>
          {currentPage === 'home' && <HomePage navigate={navigate} />}
          {currentPage === 'work' && <WorkPage navigate={navigate} />}
          {currentPage === 'project' && <ProjectDetailPage projectId={projectId} navigate={navigate} />}
          {currentPage === 'services' && <ServicesPage navigate={navigate} />}
          {currentPage === 'about' && <AboutPage navigate={navigate} />}
          {currentPage === 'pricing' && <PricingPage navigate={navigate} />}
          {currentPage === 'contact' && <ContactPage />}
        </main>
      </div>

      <Footer navigate={navigate} darkMode={darkMode} />
    </div>
  );
}


