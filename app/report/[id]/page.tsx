import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportPage({
  params,
}: Props) {

  const { id } = await params;

  const { data } =
    await supabase
      .from("audits")
      .select("*")
      .eq("share_id", id)
      .single();

  if (!data) {

    return (
      <main className="min-h-screen bg-black text-white p-10">

        <h1 className="text-4xl font-bold">
          Report Not Found
        </h1>

      </main>
    );
  }

  const auditResults =
    data.audit_data;

  const totalSavings =
    auditResults.reduce(
      (
        acc: number,
        item: any
      ) => acc + item.savings,
      0
    );

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Public AI Spend Audit
        </h1>

        <div className="border border-green-700 bg-green-950 rounded-2xl p-8 mb-10">

          <p className="text-4xl font-bold text-green-400">

            ${totalSavings}/month savings

          </p>

        </div>

        <div className="space-y-6">

          {auditResults.map(
            (
              result: any,
              index: number
            ) => (

              <div
                key={index}
                className="border border-zinc-800 rounded-xl p-6"
              >

                <h2 className="text-2xl font-semibold mb-4">

                  {result.tool}

                </h2>

                <div className="space-y-2 text-zinc-300">

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

                  <p className="text-green-400">

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

            )
          )}

        </div>

      </div>

    </main>
  );
}