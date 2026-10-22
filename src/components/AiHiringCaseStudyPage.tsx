import React, { useState, useEffect, useRef } from 'react';

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
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const UI_SCREENS = [
  {
    id: 'dashboard',
    label: 'Recruiter Dashboard & Pipeline',
    shortLabel: 'Pipeline & Metrics',
    filename: 'Screenshot 2026-10-22 132405.png',
    src: '/ai-hiring-agent/Screenshot 2026-10-22 132405.png',
    alt: 'Recruiter Dashboard & Pipeline Overview displaying active jobs, candidate submissions, test metrics and scorecards',
    badge: 'Recruiter Operations Hub',
    description:
      'Central recruitment control tower showing active open roles, screened candidates, automated test completion rates, and real-time candidate scorecard reviews.',
    features: [
      'Real-time candidate qualification distribution',
      'One-click access to voice transcripts and proctoring logs',
      'Automated pipeline stage progression',
      'Direct synchronization with applicant status databases',
    ],
  },
  {
    id: 'profile',
    label: 'Recruiter Profile, Scheduling Limits & Working Hours',
    shortLabel: 'Working Hours & Limits',
    filename: 'Screenshot 2026-10-22 132438.png',
    src: '/ai-hiring-agent/Screenshot 2026-10-22 132438.png',
    alt: 'Recruiter Profile, Scheduling Limits, Working Hours and Timezone Configuration',
    badge: 'Availability Engine',
    description:
      'Granular controls allowing talent acquisition teams to establish working hours, maximum daily interview thresholds, timezone rules, and automated invite branding.',
    features: [
      'Multi-timezone automatic detection and slot alignment',
      'Daily & weekly interview caps to avoid recruiter overload',
      'Customized candidate email branding & template hooks',
      'Instant toggle between autonomous vs manual confirmation',
    ],
  },
  {
    id: 'calendar',
    label: 'Automated Google Calendar & Meet Sync',
    shortLabel: 'Google Calendar & Meet',
    filename: 'Screenshot 2026-10-22 132459.png',
    src: '/ai-hiring-agent/Screenshot 2026-10-22 132459.png',
    alt: 'Automated Google Calendar & Google Meet synchronization for candidate interviews',
    badge: 'Google Workspace Cloud Sync',
    description:
      'Direct, zero-friction integration with Google Workspace via OAuth 2.0. Automatically schedules confirmed interview slots, creates unique Google Meet video links, and fires automated reminders.',
    features: [
      'Google Cloud OAuth 2.0 token management',
      'Automated Google Meet room generation per candidate',
      'Bidirectional conflict detection with existing calendar events',
      'Instant cancellation and rescheduling lifecycle support',
    ],
  },
];

const METRICS = [
  {
    value: '85%',
    label: 'Screening Overhead Reduced',
    subtext: 'Eliminates repetitive initial phone screens and basic coding checks.',
    highlightColor: 'text-cyan-500 dark:text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'from-cyan-500/10 to-transparent',
  },
  {
    value: 'Zero',
    label: 'Human Bottleneck in Round 1',
    subtext: 'First-round assessments run 100% autonomously without recruiter scheduling.',
    highlightColor: 'text-emerald-500 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'from-emerald-500/10 to-transparent',
  },
  {
    value: '100%',
    label: 'Real-time Integrity Monitored',
    subtext: 'Continuous facial tracking, gaze deviation analysis, and browser blur logging.',
    highlightColor: 'text-blue-500 dark:text-blue-400',
    borderColor: 'border-blue-500/30',
    bgGlow: 'from-blue-500/10 to-transparent',
  },
  {
    value: '24/7',
    label: 'Global Candidate Availability',
    subtext: 'Candidates in any timezone interview on their schedule within minutes.',
    highlightColor: 'text-purple-500 dark:text-purple-400',
    borderColor: 'border-purple-500/30',
    bgGlow: 'from-purple-500/10 to-transparent',
  },
];

const ARCHITECTURAL_SUBSYSTEMS = [
  {
    number: '01',
    name: 'Dynamic Voice Agent',
    badge: 'Conversational Intelligence',
    description:
      'Conducts realistic, natural voice interviews with adaptive prompt chaining that dynamically generates follow-up queries based on candidate answers.',
    points: [
      'Gemini AI dynamic prompt chaining analyzes spoken responses for technical depth and relevance.',
      'Browser-native Web Speech API delivers zero-lag Speech-to-Text (STT) and low-latency Text-to-Speech (TTS).',
      'Hands-free interactive dialogue that mirrors the tone, cadence, and rigor of a senior engineering manager.',
      'Context-aware follow-ups: probes deeper into candidate claims or clarifies ambiguities in real time.',
    ],
    tech: ['Google Gemini AI', 'Web Speech API', 'Audio Worklet', 'JSON Schema Guardrails'],
    accent: 'cyan',
  },
  {
    number: '02',
    name: 'Multi-Vector Proctoring Engine',
    badge: 'Computer Vision & Integrity',
    description:
      'Continuous client-side visual and behavioral monitoring to ensure remote candidate integrity and eliminate proxy exam fraud.',
    points: [
      'MediaPipe face detection runs locally in the browser via WebAssembly, tracking head gaze drift and multi-person presence.',
      'Absence detection triggers warning states if the candidate leaves the camera frame or obscures video.',
      'Browser visibility & window blur hooks instantly flag tab-switching, dev tools opening, and secondary monitor interaction.',
      'Generates a timestamped anti-cheat integrity audit trail attached to the candidate scorecard.',
    ],
    tech: ['Google MediaPipe', 'WebAssembly (WASM)', 'Visibility API', 'Canvas Telemetry'],
    accent: 'emerald',
  },
  {
    number: '03',
    name: 'Google Workspace Automation',
    badge: 'Enterprise Synchronization',
    description:
      'End-to-end integration with Google Cloud APIs to automate scheduling, Google Meet room provisioning, and candidate communication.',
    points: [
      'Secure Google Cloud OAuth 2.0 flow connecting recruiter Gmail and Google Calendar accounts.',
      'Automated slot generation prevents double-booking against recruiter personal and business calendars.',
      'Dynamic creation of individual Google Meet video conference rooms embedded directly into calendar invites.',
      'Automated post-interview evaluation dispatch sending comprehensive candidate scorecards straight to hiring panels.',
    ],
    tech: ['Google Calendar API', 'Gmail API', 'Google Cloud OAuth', 'Automated Webhooks'],
    accent: 'blue',
  },
  {
    number: '04',
    name: 'Core Tech Stack & Data Layer',
    badge: 'Full-Stack Architecture',
    description:
      'Engineered for enterprise scale, rapid execution, modularity, and strict tenant isolation.',
    points: [
      'Next.js frontend architecture delivering ultra-fast page transitions and client-side audio/vision processing.',
      'Express.js backend services coordinating AI prompt chaining, scoring engines, and OAuth handshakes.',
      'MySQL database with Prisma ORM providing relational data integrity for candidates, evaluations, and recruiter profiles.',
      'Tailwind CSS design system styled with dark navy aesthetics, high contrast readability, and full responsive behavior.',
    ],
    tech: ['Next.js', 'Express', 'MySQL', 'Prisma ORM', 'Tailwind CSS', 'TypeScript'],
    accent: 'purple',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Job Creation & Rubric Definition',
    actor: 'Recruiter / Hiring Lead',
    summary:
      'Recruiters set up open positions, specify technical topics, required years of experience, and difficulty parameters.',
    details:
      'The platform generates tailored evaluation rubrics, scoring weights, and sets proctoring sensitivity limits tailored to the job tier.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Automated Scheduling & Invitation',
    actor: 'Autonomous Engine',
    summary:
      'Candidates receive a secure invitation link, select a slot within recruiter working hours, or launch an immediate test.',
    details:
      'Google Calendar API checks real-time availability, reserves the time, and generates a personalized Google Meet room link automatically.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Live Voice Session & Vision Monitoring',
    actor: 'AI Agent & Candidate',
    summary:
      'Candidate interacts verbally with the AI interviewer while MediaPipe runs continuous local computer vision anti-cheat checks.',
    details:
      'The AI adapts question difficulty in real time, asks probing technical follow-ups, and logs full audio/text transcripts without recruiter presence.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Auto-Generated Scorecard & Panel Dispatch',
    actor: 'Evaluation Pipeline',
    summary:
      'Within 60 seconds of session completion, Gemini synthesizes responses, generates structured scores, and emails the hiring panel.',
    details:
      'Hiring managers receive a breakdown of technical acumen, communication clarity, integrity confidence score, and interview highlights.',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

interface AiHiringCaseStudyPageProps {
  navigate: (page: any, id?: number) => void;
}

export function AiHiringCaseStudyPage({ navigate }: AiHiringCaseStudyPageProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const activeScreen = UI_SCREENS[activeScreenIndex];

  return (
    <article className="min-h-screen bg-white dark:bg-[#0F172A] text-[#334155] dark:text-slate-300 transition-colors duration-300">
      {/* Top Ambient Glow Overlays */}
      <div className="relative overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-80 left-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 1. Page Header & Hero Navigation */}
      <header className="pt-24 sm:pt-32 pb-14 sm:pb-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Top Back-Link & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <a
              href="/automations"
              onClick={(e) => {
                e.preventDefault();
                navigate('automations');
              }}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono-tech font-semibold text-[#0B192C] dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer"
              aria-label="Return to Automations showcase"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
              </svg>
              <span>← Back to Automations</span>
            </a>

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('home');
                }}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Home
              </a>
              <span>/</span>
              <a
                href="/automations"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('automations');
                }}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Automations
              </a>
              <span>/</span>
              <span className="text-slate-900 dark:text-cyan-400 font-semibold truncate max-w-[200px]">
                AI Hiring Agent
              </span>
            </nav>
          </div>

          <Reveal>
            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider shadow-xs shadow-cyan-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                AUTONOMOUS VOICE &amp; VISION AI
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono-tech text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                ENTERPRISE AUTOMATION
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Production Deployed
              </span>
            </div>

            {/* Hero Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B192C] dark:text-white max-w-5xl leading-[1.12]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Autonomous AI Hiring &amp; Proctoring Agent
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-[#475569] dark:text-slate-300 max-w-4xl font-normal">
              An end-to-end recruitment platform conducting dynamic voice interviews, real-time computer vision proctoring, and automated candidate evaluations at scale.
            </p>

            {/* Prominent CTA Bar */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://hiringagent-sandy.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-[#0B192C] dark:bg-cyan-600 hover:bg-[#1E3A8A] dark:hover:bg-cyan-500 shadow-md hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span>Launch Live Demo</span>
                <span className="text-cyan-300 dark:text-white" aria-hidden="true">↗</span>
              </a>

              <a
                href="https://websoul.trafft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0B192C] dark:text-white shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span>Book a Strategy Call</span>
                <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </a>

              <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-mono-tech text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>No Login Required for Demo</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Real-Time Voice &amp; Vision</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* 2. Section A: Executive Summary & 4-Stat Metric Strip */}
      <section className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="Executive summary and metrics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                  Executive Summary &amp; ROI
                </span>
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Accelerating Tech Hiring with Autonomous Precision
                </h2>
              </div>
              <p className="max-w-xl text-sm sm:text-base text-[#475569] dark:text-slate-400 leading-relaxed">
                Traditional technical recruitment stalls at Round 1: recruiters spend countless hours scheduling, screening, and evaluating candidate basics. This platform deploys an autonomous AI agent to conduct interactive spoken interviews, monitor exam integrity with computer vision, and deliver calibrated scorecards instantly.
              </p>
            </div>

            {/* 4-Stat Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {METRICS.map((metric, idx) => (
                <div
                  key={metric.label}
                  className={`relative overflow-hidden rounded-2xl border ${metric.borderColor} bg-white dark:bg-slate-900/90 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.bgGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
                  <div className="relative">
                    <span className="text-xs font-mono-tech text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                      Metric #{idx + 1}
                    </span>
                    <div
                      className={`text-4xl sm:text-5xl font-extrabold font-mono-tech ${metric.highlightColor} tracking-tight`}
                    >
                      {metric.value}
                    </div>
                    <div
                      className="mt-3 text-base sm:text-lg font-bold text-[#0B192C] dark:text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {metric.label}
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                      {metric.subtext}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Section B: The Problem & Market Bottlenecks */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="The recruitment bottleneck problem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                Industry Challenge
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                The Broken First Round: Recruiter Burnout &amp; Proxy Cheating
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-slate-400 leading-relaxed">
                In modern remote engineering hiring, talent teams receive hundreds of applications per open role. Screening candidates manually creates severe organizational drag, subjective bias, and vulnerability to AI-assisted cheating.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Manual Interview Friction',
                  icon: (
                    <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ),
                  badge: 'Human Bottleneck',
                  problem:
                    'Engineering managers and senior recruiters burn 15–20 hours each week repeatedly asking baseline technical questions instead of building core product features.',
                },
                {
                  title: 'Recruiter Fatigue & Subjectivity',
                  icon: (
                    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ),
                  badge: 'Inconsistent Grading',
                  problem:
                    'Back-to-back 30-minute screenings lead to cognitive fatigue, resulting in inconsistent rubric grading, overlooked talent, or leniency toward non-qualified candidates.',
                },
                {
                  title: 'Cross-Timezone Lag',
                  icon: (
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  badge: 'Scheduling Delay',
                  problem:
                    'Coordinating availability across candidates in Americas, EMEA, and APAC causes calendar ping-pong, inflating average time-to-hire from days to weeks.',
                },
                {
                  title: 'Proxy Fraud & Remote Cheating',
                  icon: (
                    <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  badge: 'Integrity Failure',
                  problem:
                    'Unproctored technical take-homes are routinely bypassed with ChatGPT, off-screen assistants, and proxy interviewers, corrupting hiring pipeline integrity.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 flex flex-col justify-between shadow-xs hover:border-slate-400 dark:hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-mono-tech uppercase font-semibold text-slate-500 dark:text-slate-400">
                        {item.badge}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-[#0B192C] dark:text-white mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                      {item.problem}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contrast Comparison Strip */}
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-500 dark:text-rose-400 font-bold block">
                    Before: Legacy Hiring Funnel
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                    2–3 weeks of email back-and-forth, 40+ hours of recruiter screen time per hire, zero anti-cheat verification, and high candidate drop-off.
                  </p>
                </div>
                <div className="space-y-2 md:border-l md:border-slate-300 dark:md:border-slate-700 md:pl-6">
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                    After: Autonomous AI Voice &amp; Vision Agent
                  </span>
                  <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">
                    Instant 24/7 candidate interview bookings, 100% automated voice questioning with adaptive AI follow-ups, continuous computer vision proctoring, and comprehensive scorecards in &lt;60s.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Section C: The Architectural Solution */}
      <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="System architecture and subsystems">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                System Architecture
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Engineering the Autonomous Subsystems
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-slate-400 leading-relaxed">
                The platform unites dynamic conversational AI, client-side computer vision edge inference, and Google Cloud Workspace APIs into an enterprise-grade recruiting engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {ARCHITECTURAL_SUBSYSTEMS.map((subsystem) => (
                <div
                  key={subsystem.name}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    {/* Subsystem Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono-tech text-cyan-600 dark:text-cyan-400">
                        {subsystem.number}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {subsystem.badge}
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-white mb-2.5"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {subsystem.name}
                    </h3>

                    <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed mb-6">
                      {subsystem.description}
                    </p>

                    {/* Architectural Feature Bullets */}
                    <ul className="space-y-3 mb-6" aria-label={`${subsystem.name} capabilities`}>
                      {subsystem.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155] dark:text-slate-300">
                          <span className="p-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subsystem Tech Badges */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-medium">
                      Core Technologies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {subsystem.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md text-xs font-mono-tech font-medium bg-slate-50 dark:bg-slate-800 text-[#0B192C] dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subsystem Architecture Summary Box */}
            <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8">
              <h4
                className="text-lg font-bold text-[#0B192C] dark:text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                High-Level Data Flow &amp; Inference Pipeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono-tech">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-cyan-600 dark:text-cyan-400 font-bold mb-1">01. Ingestion</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Audio stream digitized via Web Audio API; Video captured at 30fps for client-side MediaPipe WASM graph.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-1">02. Inference</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Real-time speech recognition feeds Gemini LLM prompt chains; Face mesh evaluates gaze angles and head tilt.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-blue-600 dark:text-blue-400 font-bold mb-1">03. Synthesis</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Next question streamed back via native speech synthesis; Telemetry logged into transactional MySQL records.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-purple-600 dark:text-purple-400 font-bold mb-1">04. Dispatch</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Comprehensive rubric scores + integrity audit packaged into Gmail API payload and delivered to hiring panel.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Section D: UI Showcase & Interactive Gallery */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="Application screenshots and user interface showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                  UI Showcase &amp; Interactive Gallery
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Recruiter &amp; Platform Interfaces
                </h2>
              </div>
              <p className="max-w-xl text-sm sm:text-base text-[#475569] dark:text-slate-400 leading-relaxed">
                Explore the actual production screens built for talent acquisition teams: from global pipeline management and automated interview limits to seamless Google Calendar syncing.
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
              {UI_SCREENS.map((screen, idx) => {
                const isActive = activeScreenIndex === idx;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`flex-1 min-w-[160px] sm:min-w-[200px] px-4 py-3 rounded-xl text-xs sm:text-sm font-mono-tech font-semibold transition-all duration-200 text-center cursor-pointer ${
                      isActive
                        ? 'bg-[#0B192C] dark:bg-cyan-500/20 text-white dark:text-cyan-300 dark:border dark:border-cyan-500/40 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="hidden md:inline">{screen.label}</span>
                    <span className="md:hidden">{screen.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Full-Width Browser Mockup Container - Fixed Aspect Ratio & Full Height */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-500/5">
              {/* Window Chrome Header Bar with Clean URL & Indicators */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>

                <div className="flex-1 max-w-xl mx-4 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono-tech text-slate-500 dark:text-slate-400 flex items-center justify-between truncate shadow-2xs">
                  <span className="flex items-center gap-2 truncate">
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                      https://hiringagent-sandy.vercel.app/
                    </span>
                  </span>
                  <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 shrink-0 ml-3">
                    {activeScreen.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://hiringagent-sandy.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono-tech font-semibold rounded-md bg-[#0B192C] dark:bg-cyan-600 text-white hover:bg-[#1E3A8A] dark:hover:bg-cyan-500 transition-colors"
                  >
                    <span>Test App</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>

              {/* Viewport Frame - Full height display, natural rendering, no cropping or dark letterbox borders */}
              <div className="relative w-full bg-slate-950 overflow-hidden flex items-center justify-center p-2 sm:p-4 lg:p-6">
                <img
                  key={activeScreen.src}
                  src={activeScreen.src}
                  alt={activeScreen.alt}
                  className="w-full h-auto max-h-[820px] object-contain rounded-lg border border-slate-800/80 shadow-2xl transition-all duration-300"
                  loading="eager"
                />
              </div>

              {/* Caption & Deep-Dive Details Bar */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 text-slate-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{activeScreen.label}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {activeScreen.description}
                    </p>
                  </div>
                  <a
                    href="https://hiringagent-sandy.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Launch in Live Environment</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>

                {/* Sub-Feature Pills for Current Screen */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {activeScreen.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-mono-tech bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Preview Strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {UI_SCREENS.map((screen, idx) => {
                const isActive = activeScreenIndex === idx;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`group/thumb rounded-xl overflow-hidden border p-2.5 text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/15 ring-2 ring-cyan-500/40 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 opacity-80 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-950 mb-2 border border-slate-200/60 dark:border-slate-800">
                      <img
                        src={screen.src}
                        alt={screen.alt}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                      />
                    </div>
                    <div className="truncate text-xs font-mono-tech font-bold text-[#0B192C] dark:text-slate-100">
                      {screen.shortLabel}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {screen.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Section E: Candidate & Recruiter End-to-End Workflow */}
      <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="End-to-end recruitment workflow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                End-to-End Roadmap
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Candidate &amp; Recruiter Journey
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-slate-400 leading-relaxed">
                From initial job configuration to panel-ready scorecards, the entire cycle operates autonomously while keeping recruiters fully in control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
                >
                  <div>
                    {/* Step Indicator Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono-tech uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-md bg-cyan-500/10">
                        Step {step.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                        {step.icon}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono-tech text-slate-400 dark:text-slate-500 block mb-1">
                      {step.actor}
                    </span>

                    <h3
                      className="text-lg font-bold text-[#0B192C] dark:text-white mb-2 leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed mb-3">
                      {step.summary}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.details}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-400 dark:text-slate-500">
                    <span>Phase 0{idx + 1} of 04</span>
                    <span className="text-cyan-600 dark:text-cyan-400">→</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Section F: Impact, Security & Enterprise Readiness */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80" aria-label="Enterprise readiness, data isolation and security">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-cyan-400 font-semibold block mb-2">
                Enterprise Readiness
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Security, Data Isolation &amp; Zero Latency
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-slate-400 leading-relaxed">
                Engineered specifically for corporate compliance, confidential hiring data protection, and low-latency global candidate experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#0B192C] dark:text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Tenant Data Isolation
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                    Strict logical separation prevents data leakage between recruitment teams. Candidate PII, interview recordings, and scorecards are encrypted in transit via TLS 1.3 and at rest with AES-256. Candidate voice data is never used to train public foundation models.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono-tech text-cyan-600 dark:text-cyan-400">
                  GDPR &amp; SOC2 Aligned Storage
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#0B192C] dark:text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Client-Side Edge Inference
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                    By compiling MediaPipe facial tracking and Web Speech synthesis into browser-native WebAssembly pipelines, camera video streams never need to leave the client device for anti-cheat verification, preserving candidate privacy and slashing server bandwidth costs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono-tech text-emerald-600 dark:text-emerald-400">
                  &lt;30ms Edge Vision Latency
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#0B192C] dark:text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Rapid Time-to-Hire Impact
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                    Organizations deploying autonomous voice &amp; vision screening compress average technical hiring cycles from 21 days down to under 48 hours. Top-tier candidates are identified immediately, preventing them from accepting competing offers while waiting for initial screening calls.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono-tech text-purple-600 dark:text-purple-400">
                  75% Reduction in Cycle Time
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Section G: Bottom Call to Action */}
      <section className="py-16 sm:py-24" aria-label="Call to action">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
              {/* Ambient Glows inside card */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 font-bold block mb-3">
                  Deploy Autonomous Automation
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Ready to eliminate screening bottlenecks in your organization?
                </h2>
                <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
                  Test the live recruitment demo immediately or schedule a consultation with the Websoul engineering practice to build custom AI voice agents, computer vision proctoring, or Google Cloud workflow automations tailored to your business.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="https://hiringagent-sandy.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg hover:shadow-cyan-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <span>Launch Live Demo</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <a
                    href="https://websoul.trafft.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <span>Book an Automation Strategy Call</span>
                    <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate('automations')}
                    className="inline-flex items-center gap-2 text-xs font-mono-tech text-slate-400 hover:text-white transition-colors cursor-pointer py-2 px-3"
                  >
                    <span>← View More Automations</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
