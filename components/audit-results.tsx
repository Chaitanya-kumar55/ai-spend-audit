import { AuditRecommendation } from "@/types/audit";

interface Props {
  results: AuditRecommendation[];
}

export default function AuditResults({
  results,
}: Props) {

  const totalMonthlySavings =
    results.reduce(
      (acc, item) => acc + item.savings,
      0
    );

  const annualSavings =
    totalMonthlySavings * 12;

  return (
    <div className="mt-16">

      {/* Hero */}
      <div className="border border-green-700 bg-green-950 rounded-2xl p-8 mb-10">

        <h2 className="text-4xl font-bold">
          Potential Savings
        </h2>

        <div className="mt-6 space-y-2">

          <p className="text-3xl font-semibold text-green-400">
            ${totalMonthlySavings.toFixed(2)}
            /month
          </p>

          <p className="text-xl text-zinc-300">
            ${annualSavings.toFixed(2)}
            annual savings
          </p>

        </div>

      </div>

      {/* Recommendations */}
      <div className="space-y-6">

        {results.map((result, index) => (

          <div
            key={index}
            className="border border-zinc-800 rounded-xl p-6"
          >

            <h3 className="text-2xl font-semibold">
              {result.tool}
            </h3>

            <div className="mt-4 space-y-2 text-zinc-300">

              <p>
                Current Spend:
                {" "}
                ${result.currentSpend}
              </p>

              <p>
                Recommended Spend:
                {" "}
                ${result.recommendedSpend}
              </p>

              <p className="text-green-400 font-medium">
                Savings:
                {" "}
                ${result.savings}
              </p>

              <p>
                Recommendation:
                {" "}
                {result.recommendation}
              </p>

              <p>
                Reason:
                {" "}
                {result.reason}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}