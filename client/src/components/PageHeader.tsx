
interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-r from-[#171326] via-[#111827] to-[#0B1120] p-6 shadow-[0_8px_40px_rgba(76,29,149,0.15)] sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-600/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            KEYVERSE / ADMIN CONSOLE
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
