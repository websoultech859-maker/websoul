import React, { useEffect, useRef, useState } from 'react';

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 transition-all cursor-pointer"
    >
      {children}
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white mb-8 sm:mb-10"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </h2>
  );
}

function ImageFigure({
  src,
  alt,
  caption,
  className = '',
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </div>
      <figcaption className="mt-3 text-sm text-[#475569] dark:text-slate-400">
        {caption}
      </figcaption>
    </figure>
  );
}

const features = [
  {
    title: 'HTTPS + SSL',
    description: 'Every webhook and destination connection is protected with HTTPS and managed SSL.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </svg>
    ),
  },
  {
    title: 'HMAC Signature Verification',
    description: 'Incoming requests are verified before processing to confirm they came from a trusted source.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Idempotent Processing',
    description: 'Unique event IDs prevent duplicate submissions from creating duplicate leads or payments.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3" />
      </svg>
    ),
  },
  {
    title: 'Retry with Backoff',
    description: 'Temporary destination errors trigger controlled retries, giving delivery another chance to succeed.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 11a8 8 0 0 0-14.8-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14m0 5v-5h-5" />
      </svg>
    ),
  },
  {
    title: 'Failure Logging',
    description: 'Unsuccessful forwards are recorded with their payload and response details for replay and review.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 4h14v16H5zM9 8h6M9 12h6M9 16h3" />
        <path d="m16 15 4 4m0-4-4 4" />
      </svg>
    ),
  },
  {
    title: 'Multi-tenant Architecture',
    description: 'Each client’s integrations and event records stay organized within their own configuration.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="4" width="8" height="7" rx="1.5" />
        <rect x="13" y="4" width="8" height="7" rx="1.5" />
        <rect x="8" y="14" width="8" height="7" rx="1.5" />
        <path d="M7 11v2h5m5-2v2h-5" />
      </svg>
    ),
  },
];

const audiences = [
  {
    title: 'Real estate agents',
    description: 'Send Facebook inquiries straight to your CRM so every prospect gets followed up with promptly.',
  },
  {
    title: 'Coaches and consultants',
    description: 'Keep new leads and paid bookings moving into the tools you already use to run your business.',
  },
  {
    title: 'Small e-commerce sellers',
    description: 'Connect payment events to your customer workflows without manually copying order information.',
  },
  {
    title: 'Agencies',
    description: 'Give clients dependable, clearly logged integrations without building a custom pipeline from scratch.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    setup: '$49',
    monthly: '$19/month',
    description: 'Facebook Leads → Google Sheets or Email',
  },
  {
    name: 'Pro',
    setup: '$99',
    monthly: '$29/month',
    description: 'Facebook + Stripe → CRM + Slack alerts',
  },
  {
    name: 'Custom',
    setup: 'From $199',
    monthly: '$49/month',
    description: 'Multi-source → any destination',
  },
];

const technologies = [
  {
    name: 'n8n',
    colorClass: 'text-[#EA4B71] dark:text-[#FF7898]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 4h4v4H7V4Zm6 6h4v4h-4v-4ZM3 16h4v4H3v-4Zm14 0h4v4h-4v-4Z" fill="#EA4B71" />
        <path d="M11 6h2v6h-2zM5 14h8v2H5zM15 12h2v4h-2z" fill="#EA4B71" />
      </svg>
    ),
  },
  {
    name: 'Supabase',
    colorClass: 'text-[#16A34A] dark:text-[#4ADE80]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13.4 2.8 4.1 13.5c-.8.9-.2 2.3 1 2.3h6.1l-.6 5.4c-.2 1.4 1.6 2 2.3.8l7-11.1c.6-1-.1-2.2-1.2-2.2h-5.4l1.4-4.5c.4-1.3-.5-2.3-1.3-1.4Z" fill="#3ECF8E" />
      </svg>
    ),
  },
  {
    name: 'AWS EC2',
    colorClass: 'text-[#232F3E] dark:text-[#FF9900]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 5.5 12 2l9 3.5v13L12 22l-9-3.5v-13Z" fill="#232F3E" />
        <path d="m12 2 9 3.5v13L12 22V2Z" fill="#FF9900" />
        <path d="M8 8h8v2H8zm0 4h8v2H8z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Caddy',
    colorClass: 'text-[#1F88C0] dark:text-[#61C3F5]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.5 21 7v10l-9 4.5L3 17V7l9-4.5Z" fill="#1F88C0" />
        <path d="M8 8h8v2H8zm0 3h6v2H8zm0 3h8v2H8z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    colorClass: 'text-[#B77900] dark:text-[#F7DF1E]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="3" fill="#F7DF1E" />
        <path d="M13 18.2c.5.8 1.2 1.2 2.2 1.2.9 0 1.4-.4 1.4-1 0-.7-.5-.9-1.6-1.4l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.6.5 3.4 1.9l-1.9 1.2c-.4-.7-.8-1-1.5-1-.6 0-1 .4-1 .9 0 .6.4.9 1.4 1.3l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2.1-1.7 3.2-3.9 3.2-2.2 0-3.6-1-4.3-2.4l2.1-1.1ZM4 18.4c.4.7.8 1.2 1.7 1.2.8 0 1.3-.3 1.3-1.5v-7.7h2.6v7.8c0 2.7-1.6 3.9-3.8 3.9-2 0-3.2-1-3.8-2.3L4 18.4Z" fill="#242424" transform="translate(1 -1) scale(.9)" />
      </svg>
    ),
  },
];

const responseExamples = [
  {
    title: 'First request',
    status: '200 OK',
    response: JSON.stringify(
      {
        status: 'success',
        message: 'Payload validated, transformed, and forwarded',
        external_id: 'FB-LEAD-SERVER-03',
        client_id: 'acme',
        destination: 'https://httpbin.org/post',
        processed_at: '2026-10-05T12:34:25.570Z',
      },
      null,
      2
    ),
  },
  {
    title: 'Duplicate request',
    status: '200 OK',
    response: JSON.stringify(
      {
        status: 'duplicate',
        message: 'This event was already processed',
        external_id: 'FB-LEAD-SERVER-03',
        client_id: 'acme',
        original_processed_at: '2026-10-05T12:34:25.806492+00:00',
        received_at: '2026-10-05T17:35:06.038+05:00',
      },
      null,
      2
    ),
  },
];

export function PayloadPipePage({
  navigate,
}: {
  navigate: (page: any, id?: number) => void;
}) {
  return (
    <main className="bg-white dark:bg-slate-900">
      <section className="pt-24 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-1.5 text-sm font-semibold text-[#0B192C] dark:text-slate-200">
              Case Study
            </span>
            <h1
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B192C] dark:text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              PayloadPipe
            </h1>
            <p className="mt-5 text-xl sm:text-2xl leading-relaxed font-medium text-[#475569] dark:text-slate-300">
              Facebook Leads and Stripe Payments → Straight into Your CRM. Automatically.
            </p>
            <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
              Important customer events often arrive as inconsistent webhooks, then get lost between
              inboxes, spreadsheets, and manual follow-up. PayloadPipe turns those incoming events
              into reliable, traceable deliveries to the tools your team depends on.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal className="max-w-4xl">
            <SectionHeading>The Problem</SectionHeading>
            <div className="space-y-5 text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
              <p>
                Webhooks are useful, but their payloads are not always easy to work with. Facebook
                lead events can bury the details inside nested arrays, while Stripe sends deeply
                nested objects with different fields and event structures.
              </p>
              <p>
                When those services do not connect cleanly to a CRM, teams fall back to manual
                copy-paste. It takes time, invites mistakes, and leaves leads or payment updates
                waiting for someone to notice them.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>How It Works</SectionHeading>
            <ImageFigure
              src="/portfolio/payloadpipe/04-workflow-canvas.png"
              alt="PayloadPipe production workflow showing connected webhook processing nodes"
              caption="The production workflow — 11 nodes handling validation, deduplication, transformation, and delivery"
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Validate',
                  description: 'Check each request and confirm the sender before processing.',
                },
                {
                  title: 'Dedupe',
                  description: 'Recognize event IDs that have already been handled.',
                },
                {
                  title: 'Transform',
                  description: 'Map nested source data into clean, useful fields.',
                },
                {
                  title: 'Forward',
                  description: 'Deliver the event to your CRM and connected tools.',
                },
              ].map((step) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs p-6"
                >
                  <h3
                    className="text-lg font-bold text-[#0B192C] dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#475569] dark:text-slate-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>No Lost Leads. Ever.</SectionHeading>
            <div className="grid gap-8 md:grid-cols-2">
              <ImageFigure
                src="/portfolio/payloadpipe/02-processed-events.png"
                alt="PayloadPipe list of successfully processed events"
                caption="Every successful event stored with unique ID and timestamp"
              />
              <ImageFigure
                src="/portfolio/payloadpipe/03-failed-forwards.png"
                alt="PayloadPipe log of failed event forwards and their payloads"
                caption="Failed forwards logged with full payload for replay"
              />
            </div>
            <p className="mt-8 max-w-4xl text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
              Temporary delivery problems do not have to become lost leads. PayloadPipe retries
              failed forwards with backoff and records failures alongside the full payload, so
              events can be reviewed and replayed instead of disappearing silently.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>Real Proof — Live Test</SectionHeading>
            <ImageFigure
              src="/portfolio/payloadpipe/01-success-response.png"
              alt="Live PayloadPipe webhook test showing successful and duplicate responses"
              caption="Same webhook called twice — first returns success, second returns duplicate"
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {responseExamples.map((example) => (
                <article
                  key={example.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                    <h3
                      className="font-semibold text-[#0B192C] dark:text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {example.title}
                    </h3>
                    <span className="font-mono-tech text-xs text-emerald-700 dark:text-emerald-400">
                      {example.status}
                    </span>
                  </div>
                  <pre className="font-mono-tech overflow-x-auto p-5 text-xs sm:text-sm leading-6 text-[#475569] dark:text-slate-300">
                    <code>{example.response}</code>
                  </pre>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>Technical Highlights</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-[#0B192C] dark:bg-blue-950 dark:text-blue-300">
                    <span className="h-6 w-6">{feature.icon}</span>
                  </div>
                  <h3
                    className="text-lg font-bold text-[#0B192C] dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#475569] dark:text-slate-400">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>Who This Is For</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience) => (
                <article
                  key={audience.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs p-6"
                >
                  <h3
                    className="text-lg font-bold text-[#0B192C] dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {audience.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#475569] dark:text-slate-400">
                    {audience.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>Simple, Honest Pricing</SectionHeading>
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <article
                  key={plan.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#0B192C] dark:hover:border-blue-500 hover:shadow-lg hover:ring-1 hover:ring-[#0B192C]/15 dark:hover:ring-blue-500/30"
                >
                  <h3
                    className="text-xl font-bold text-[#0B192C] dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-5 text-3xl font-bold text-[#0B192C] dark:text-white">
                    {plan.setup}
                    <span className="ml-2 text-base font-medium text-[#475569] dark:text-slate-400">
                      setup
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#475569] dark:text-slate-300">
                    + {plan.monthly}
                  </p>
                  <p className="mt-5 min-h-12 text-sm leading-6 text-[#475569] dark:text-slate-400">
                    {plan.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <SectionHeading>Built With</SectionHeading>
            <ul className="flex flex-wrap gap-3">
              {technologies.map((technology) => (
                <li
                  key={technology.name}
                  className={`inline-flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold shadow-xs ${technology.colorClass}`}
                >
                  <span className="h-5 w-5">{technology.icon}</span>
                  {technology.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to Stop Losing Leads?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-8 text-[#475569] dark:text-slate-400">
              Get in touch to discuss your setup. We respond within 24 hours.
            </p>
            <div className="mt-8">
              <PrimaryButton onClick={() => navigate('contact')}>Talk to Us →</PrimaryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
