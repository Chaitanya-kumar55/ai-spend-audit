import AuditForm from "@/components/audit-form";

export default function Home() {

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="mb-16">

          <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            AI Cost Optimization Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">

            AI Spend
            {" "}
            <span className="text-cyan-400">
              Audit
            </span>

          </h1>

          <p className="text-slate-400 text-xl mt-6 max-w-2xl leading-8">

            Discover hidden savings opportunities across your AI tooling stack with intelligent recommendations and financial optimization insights.

          </p>

        </div>

        <AuditForm />

      </div>

    </main>
  );
}