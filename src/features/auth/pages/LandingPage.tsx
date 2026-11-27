import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BellRing,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Globe2,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe2,
    title: 'Monitor every endpoint',
    description:
      'Bring HTTP, HTTPS, TCP, DNS, and push checks together in one organized workspace.',
  },
  {
    icon: BellRing,
    title: 'See issues as they happen',
    description:
      'Keep monitor health and incident updates close, so your team can act with context.',
  },
  {
    icon: LayoutDashboard,
    title: 'Understand the full picture',
    description:
      'Move between organizations, projects, and monitors without losing sight of service health.',
  },
];

const PREVIEW_MONITORS = [
  { name: 'Public API', target: 'api.example.com', status: 'Operational', color: 'green' },
  { name: 'Customer portal', target: 'app.example.com', status: 'Operational', color: 'green' },
  { name: 'Payments service', target: 'payments.example.com', status: 'Investigating', color: 'amber' },
];

const RESPONSE_BARS = [38, 48, 44, 58, 52, 65, 57, 48, 72, 64, 77, 62, 70, 56, 83, 68, 74, 60, 87, 71, 79, 63, 72, 56];

const ProductPreview = () => (
  <div className="relative mx-auto w-full max-w-[650px]">
    <div className="absolute -inset-8 rounded-[2.5rem] bg-indigo-400/20 blur-3xl" />
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_100px_-35px_rgba(15,23,42,0.7)]">
      <div className="flex min-h-[420px]">
        <aside className="hidden w-[62px] shrink-0 flex-col items-center gap-5 border-r border-gray-100 bg-gray-50/80 py-5 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Activity size={17} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <LayoutDashboard size={16} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400">
            <Server size={16} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400">
            <BellRing size={16} />
          </span>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:hidden">
                <Activity size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">Workspace overview</p>
                <p className="mt-0.5 text-[11px] text-gray-500">A sample view of your services</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-2.5 py-1.5 text-[10px] font-semibold text-green-700 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Systems operational
            </span>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500">Monitor health</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                  Your services, at a glance
                </p>
              </div>
              <span className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-medium text-gray-500 sm:text-xs">
                Last 24 hours
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { label: 'Total monitors', value: '12', icon: Server, tone: 'text-indigo-600 bg-indigo-50' },
                { label: 'Operational', value: '10', icon: CircleCheck, tone: 'text-green-600 bg-green-50' },
                { label: 'Open incidents', value: '02', icon: Zap, tone: 'text-amber-600 bg-amber-50' },
              ].map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="min-w-0 rounded-xl border border-gray-100 p-3 sm:p-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
                    <Icon size={16} />
                  </span>
                  <p className="mt-3 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {value}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] font-medium text-gray-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-800">Response activity</p>
                  <p className="mt-1 text-[10px] text-gray-400">Illustrative preview · sample data</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700">
                  <ArrowDownRight size={13} /> Stable
                </span>
              </div>
              <div className="mt-4 flex h-16 items-end gap-[3px]" aria-hidden="true">
                {RESPONSE_BARS.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className={`flex-1 rounded-t-sm ${
                      index > 19 ? 'bg-indigo-400' : 'bg-indigo-200'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-gray-400">
                <span>12:00 AM</span>
                <span>6:00 AM</span>
                <span>12:00 PM</span>
                <span>Now</span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <div className="flex items-center justify-between bg-gray-50/80 px-4 py-2.5">
                <p className="text-[11px] font-semibold text-gray-700">Monitored services</p>
                <span className="text-[10px] font-medium text-gray-400">SAMPLE DATA</span>
              </div>
              {PREVIEW_MONITORS.map((monitor) => (
                <div
                  key={monitor.name}
                  className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        monitor.color === 'green' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-gray-800">
                        {monitor.name}
                      </p>
                      <p className="truncate text-[10px] text-gray-400">{monitor.target}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-medium ${
                      monitor.color === 'green' ? 'text-green-700' : 'text-amber-700'
                    }`}
                  >
                    {monitor.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-xl shadow-slate-950/10 sm:flex">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <ShieldCheck size={19} />
      </span>
      <div>
        <p className="text-xs font-semibold text-gray-900">Built for peace of mind</p>
        <p className="mt-0.5 text-[11px] text-gray-500">Know where things stand</p>
      </div>
    </div>
  </div>
);

export const LandingPage = () => (
  <div className="min-h-screen overflow-hidden bg-white text-gray-900">
    <header className="relative z-10 border-b border-white/10 bg-slate-950 text-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link to="/" className="inline-flex items-center gap-2.5" aria-label="PulseMonitor home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
            <Activity size={19} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">PulseMonitor</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Platform
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-300 transition hover:text-white">
            How it works
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-200 transition hover:text-white sm:px-3"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:px-4 sm:text-sm"
          >
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </nav>
    </header>

    <main>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(99,102,241,0.24),transparent_42%)]" />
        <div className="absolute -right-40 top-20 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Service health, without the guesswork
            </div>

            <h1 className="mt-6 text-[2.65rem] font-semibold leading-[1.07] tracking-[-0.045em] sm:text-5xl lg:text-[3.6rem]">
              When services matter, <span className="text-indigo-300">clarity matters.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Keep your monitors, service health, and incident updates in one calm, clear workspace.
              Spend less time checking—and more time moving forward.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Create your workspace <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/[0.04]"
              >
                Explore the platform <ChevronRight size={16} />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-indigo-300" /> Multiple monitor types
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-indigo-300" /> Organized workspaces
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-indigo-300" /> Incident visibility
              </span>
            </div>
          </div>

          <ProductPreview />
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 text-xs text-slate-300 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <Globe2 size={16} className="text-indigo-300" />
              <span>Checks for the services your team depends on</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock3 size={16} className="text-indigo-300" />
              <span>A focused view of current service health</span>
            </div>
            <div className="flex items-center gap-2.5">
              <LifeBuoy size={16} className="text-indigo-300" />
              <span>Incident context where you need it</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              A clearer way to monitor
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The signal your team needs. Nothing in the way.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              PulseMonitor brings the essentials together, helping you understand what is healthy
              and where attention may be needed.
            </p>
          </div>

          <div className="mt-11 grid gap-4 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-950/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={20} />
                  </span>
                  <span className="text-xs font-semibold tracking-wider text-gray-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y border-gray-100 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              Simple to get started
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              From a new account to a clearer view.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-gray-600">
              Set up your workspace, add the services you want to monitor, and keep an eye on
              incidents from one place.
            </p>
            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>

          <ol className="space-y-3">
            {[
              {
                icon: Activity,
                title: 'Create your account',
                description: 'Register with your name and email address.',
              },
              {
                icon: LockKeyhole,
                title: 'Verify your email',
                description: 'Confirm your account with the verification code sent to your inbox.',
              },
              {
                icon: LayoutDashboard,
                title: 'Set up your workspace',
                description: 'Create an organization, then add projects and monitors.',
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
                    <span className="text-[11px] font-semibold text-gray-400">0{index + 1}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-indigo-600 px-6 py-9 sm:px-10 sm:py-11 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">
              Your services deserve your attention
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Make service health easier to understand.
            </h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Create an account and bring your monitoring into one workspace.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          >
            Create an account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>

    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Activity size={16} />
          </span>
          PulseMonitor
        </Link>
        <p className="text-xs text-gray-500">
          Service health and incident visibility for your team.
        </p>
        <div className="flex items-center gap-5 text-xs font-medium text-gray-500">
          <Link to="/login" className="transition hover:text-indigo-600">
            Sign in
          </Link>
          <Link to="/signup" className="transition hover:text-indigo-600">
            Create account
          </Link>
          <a
            href="https://uptime-tracker-api.onrender.com/docs"
            className="inline-flex items-center gap-1.5 transition hover:text-indigo-600"
          >
            API docs <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
