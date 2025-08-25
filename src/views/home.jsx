import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-20">
        <section className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/60 shadow-lg ring-1 ring-black/5 backdrop-blur">
          {/* dekorasi lembut */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-500/10"
          />

          <div className="relative px-8 py-14 md:px-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30">
                Project Pribadi
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
                React + TanStack Query
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300">
                Demo CRUD dengan React dan TanStack Query.
              </p>

              <div className="mt-8 flex items-center justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold shadow-sm bg-indigo-600 text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
                >
                  Mulai
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
