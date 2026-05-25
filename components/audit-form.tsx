"use client";

import { useEffect, useState } from "react";

import { tools } from "@/data/tools";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AuditResults from "@/components/audit-results";

import { generateAudit } from "@/lib/audit-engine";

import { AuditRecommendation } from "@/types/audit";

interface ToolEntry {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export default function AuditForm() {

  const [teamSize, setTeamSize] = useState(1);

  const [useCase, setUseCase] = useState("");

  const [results, setResults] = useState<
    AuditRecommendation[]
  >([]);

  const [toolEntries, setToolEntries] = useState<ToolEntry[]>([
    {
      tool: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
    },
  ]);

  useEffect(() => {

    const saved =
      localStorage.getItem("audit-form");

    if (!saved) return;

    try {

      const parsed = JSON.parse(saved);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeamSize(parsed.teamSize ?? 1);

      setUseCase(parsed.useCase ?? "");

      setToolEntries(
        parsed.toolEntries ?? [
          {
            tool: "",
            plan: "",
            monthlySpend: 0,
            seats: 1,
          },
        ]
      );

    } catch (error) {

      console.error(error);

    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "audit-form",
      JSON.stringify({
        teamSize,
        useCase,
        toolEntries,
      })
    );

  }, [teamSize, useCase, toolEntries]);

  function updateTool(
    index: number,
    key: keyof ToolEntry,
    value: string | number
  ) {

    setToolEntries((prev) => {

      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      if (key === "tool") {
        updated[index].plan = "";
      }

      return updated;
    });
  }

  function addTool() {

    setToolEntries((prev) => [
      ...prev,
      {
        tool: "",
        plan: "",
        monthlySpend: 0,
        seats: 1,
      },
    ]);
  }

  function handleSubmit() {

    const filteredTools =
      toolEntries.filter(
        (tool) =>
          tool.tool &&
          tool.plan &&
          tool.monthlySpend > 0
      );

    if (filteredTools.length === 0) {

      alert(
        "Please add at least one valid tool."
      );

      return;
    }

    const auditResults = generateAudit({
      teamSize,
      useCase,
      tools: filteredTools,
    });

    setResults(auditResults);
  }

  return (
    <div className="mt-10 space-y-8">

      {/* Team Size */}
      <div>

        <label className="block mb-2 font-medium text-slate-300">
          Team Size
        </label>

        <Input
          type="number"
          min={1}
          value={teamSize}
          className="bg-slate-900 border-slate-700 text-white"
          onChange={(e) =>
            setTeamSize(Number(e.target.value))
          }
        />

      </div>

      {/* Use Case */}
      <div>

        <label className="block mb-2 font-medium text-slate-300">
          Primary Use Case
        </label>

        <Input
          placeholder="coding, research, writing..."
          value={useCase}
          className="bg-slate-900 border-slate-700 text-white"
          onChange={(e) =>
            setUseCase(e.target.value)
          }
        />

      </div>

      {/* Tool Entries */}
      <div className="space-y-6">

        {toolEntries.map((entry, index) => {

          const selectedTool =
            tools.find(
              (tool) =>
                tool.name === entry.tool
            );

          return (
            <div
              key={index}
              className="border border-slate-700 bg-slate-900/60 backdrop-blur rounded-2xl p-6 space-y-4 shadow-xl"
            >

              {/* Tool */}
              <div>

                <label className="block mb-2 text-slate-300">
                  Tool
                </label>

                <select
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                  value={entry.tool}
                  onChange={(e) =>
                    updateTool(
                      index,
                      "tool",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Tool
                  </option>

                  {tools.map((tool) => (

                    <option
                      key={tool.name}
                      value={tool.name}
                    >
                      {tool.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* Plan */}
              <div>

                <label className="block mb-2 text-slate-300">
                  Plan
                </label>

                <select
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                  value={entry.plan}
                  onChange={(e) =>
                    updateTool(
                      index,
                      "plan",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Plan
                  </option>

                  {selectedTool &&
                    selectedTool.plans.map(
                      (plan) => (

                        <option
                          key={plan}
                          value={plan}
                        >
                          {plan}
                        </option>

                      )
                    )}

                </select>

              </div>

              {/* Monthly Spend */}
              <div>

                <label className="block mb-2 text-slate-300">
                  Monthly Spend ($)
                </label>

                <Input
                  type="number"
                  min={0}
                  value={entry.monthlySpend}
                  className="bg-slate-900 border-slate-700 text-white"
                  onChange={(e) =>
                    updateTool(
                      index,
                      "monthlySpend",
                      Number(e.target.value)
                    )
                  }
                />

              </div>

              {/* Seats */}
              <div>

                <label className="block mb-2 text-slate-300">
                  Number of Seats
                </label>

                <Input
                  type="number"
                  min={1}
                  value={entry.seats}
                  className="bg-slate-900 border-slate-700 text-white"
                  onChange={(e) =>
                    updateTool(
                      index,
                      "seats",
                      Number(e.target.value)
                    )
                  }
                />

              </div>

            </div>
          );
        })}

      </div>

      <Button
        onClick={addTool}
        variant="outline"
        className="h-12 text-base"
      >
        Add Another Tool
      </Button>

      <div>

        <Button
          onClick={handleSubmit}
          className="h-14 text-lg w-full md:w-auto"
        >
          Generate Audit
        </Button>

      </div>

      {results.length > 0 && (
        <AuditResults results={results} />
      )}

    </div>
  );
}