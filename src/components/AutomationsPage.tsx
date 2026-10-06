import React from 'react';

const automationProjects = [
  {
    title: 'PayloadPipe',
    category: 'Webhook automation',
    description:
      'A reliable webhook pipeline that validates Facebook leads and Stripe events, prevents duplicates, and forwards clean data into your CRM.',
    image: '/portfolio/payloadpipe/04-workflow-canvas.png',
    imageAlt: 'PayloadPipe workflow connecting webhook validation and delivery steps',
    tags: ['n8n', 'Supabase', 'Facebook Leads', 'Stripe'],
    page: 'payloadpipe' as const,
  },
];

export function AutomationsPage({
  navigate,
}: {
  navigate: (page: 'payloadpipe') => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] pt-24 sm:pt-32 pb-16 sm:pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <section className="max-w-3xl">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-3">
            Automation Projects
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#0B192C] dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Automations that keep work moving.
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
            Explore workflow integrations built to connect your tools, handle data reliably, and
            reduce repetitive work. New automation projects will be added here.
          </p>
        </section>

        <section className="mt-10 sm:mt-14" aria-label="Automation projects">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {automationProjects.map((project) => (
              <article
                key={project.title}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:shadow-lg hover:border-[#0B192C] dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <button
                  type="button"
                  onClick={() => navigate(project.page)}
                  className="block w-full text-left cursor-pointer"
                  aria-label={`View ${project.title} automation case study`}
                >
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs font-mono-tech uppercase tracking-wider font-semibold text-[#0B192C] dark:text-blue-400">
                      {project.category}
                    </span>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <h2
                        className="text-xl font-bold text-[#0B192C] dark:text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {project.title}
                      </h2>
                      <span className="text-lg text-[#0B192C] dark:text-blue-400 transition-transform group-hover:translate-x-1" aria-hidden="true">
                        →
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#475569] dark:text-slate-400">
                      {project.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies and integrations">
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
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
