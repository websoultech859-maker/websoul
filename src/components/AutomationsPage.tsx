import React from 'react';

const automationProjects = [
  {
    title: 'AI Hiring Agent',
    category: 'AI VOICE & PROCTORING',
    description:
      'Autonomous recruitment engine that conducts dynamic voice interviews, enforces real-time MediaPipe anti-cheat proctoring, and automatically syncs Google Calendar invites.',
    image: '/ai-hiring-agent/Screenshot 2026-10-22 132405.png',
    imageAlt: 'Autonomous AI Hiring Agent recruiter dashboard and screening metrics',
    tags: ['Gemini AI', 'MediaPipe', 'Web Speech API', 'Google Calendar', 'MySQL', 'Next.js'],
    page: 'ai-hiring-agent' as const,
    route: '/automations/ai-hiring-agent',
  },
  {
    title: 'PayloadPipe',
    category: 'Webhook automation',
    description:
      'A reliable webhook pipeline that validates Facebook leads and Stripe events, prevents duplicates, and forwards clean data into your CRM.',
    image: '/portfolio/payloadpipe/04-workflow-canvas.png',
    imageAlt: 'PayloadPipe workflow connecting webhook validation and delivery steps',
    tags: ['n8n', 'Supabase', 'Facebook Leads', 'Stripe'],
    page: 'payloadpipe' as const,
    route: '/payloadpipe',
  },
];

export function AutomationsPage({
  navigate,
}: {
  navigate: (page: any, id?: number) => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] pt-24 sm:pt-32 pb-16 sm:pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Page Hero Header */}
        <section className="max-w-3xl">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-3">
            Automation &amp; AI Solutions
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#0B192C] dark:text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Automations that keep work moving.
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
            Explore autonomous AI pipelines and workflow integrations built to connect your tools,
            eliminate manual bottlenecks, and execute operations reliably without human intervention.
          </p>
        </section>

        {/* Workflow & Data Automations Grid */}
        <section className="mt-12 sm:mt-16" aria-label="Workflow automation projects">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                Integration Pipelines
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white mt-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Workflow &amp; Data Automations
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {automationProjects.map((project) => (
              <article
                key={project.title}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:shadow-lg hover:border-[#0B192C] dark:hover:border-blue-500 transition-all duration-200 group flex flex-col justify-between"
              >
                <a
                  href={project.route}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(project.page);
                  }}
                  className="block w-full text-left cursor-pointer flex-1 flex flex-col justify-between"
                  aria-label={`View ${project.title} automation case study`}
                >
                  <div>
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/60">
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <span className="text-xs font-mono-tech uppercase tracking-wider font-semibold text-[#0B192C] dark:text-blue-400">
                        {project.category}
                      </span>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <h3
                          className="text-xl font-bold text-[#0B192C] dark:text-white group-hover:text-[#1E3A8A] dark:group-hover:text-blue-300 transition-colors"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {project.title}
                        </h3>
                        <span className="text-lg text-[#0B192C] dark:text-blue-400 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                          →
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#475569] dark:text-slate-400">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies and integrations">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 text-xs font-mono-tech text-[#475569] dark:text-slate-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
