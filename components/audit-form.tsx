"use client";

import { useEffect, useState } from "react";

import { tools } from "@/data/tools";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolEntry {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export default function AuditForm() {

  const [teamSize, setTeamSize] = useState(1);

  const [useCase, setUseCase] = useState("");

  const [toolEntries, setToolEntries] = useState<ToolEntry[]>([
    {
      tool: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
    },
  ]);

  // Load saved form data
  useEffect(() => {

    const saved = localStorage.getItem("audit-form");

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

      console.error(
        "Failed to parse localStorage",
        error
      );

    }

  }, []);

  // Save form data
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

    const updated = [...toolEntries];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    setToolEntries(updated);
  }

  function addTool() {

    setToolEntries([
      ...toolEntries,
      {
        tool: "",
        plan: "",
        monthlySpend: 0,
        seats: 1,
      },
    ]);
  }

  function handleSubmit() {

    console.log({
      teamSize,
      useCase,
      toolEntries,
    });

    alert("Audit generation coming next.");
  }

  return (
    <div className="mt-10 space-y-8">

      {/* Team Size */}
      <div>

        <label className="block mb-2 font-medium">
          Team Size
        </label>

        <Input
          type="number"
          value={teamSize}
          onChange={(e) =>
            setTeamSize(Number(e.target.value))
          }
        />

      </div>

      {/* Use Case */}
      <div>

        <label className="block mb-2 font-medium">
          Primary Use Case
        </label>

        <Input
          placeholder="coding, research, writing..."
          value={useCase}
          onChange={(e) =>
            setUseCase(e.target.value)
          }
        />

      </div>

      {/* Tool Entries */}
      <div className="space-y-6">

        {toolEntries.map((entry, index) => {

          const selectedTool = tools.find(
            (t) => t.name === entry.tool
          );

          return (
            <div
              key={index}
              className="border border-zinc-800 rounded-xl p-6 space-y-4"
            >

              {/* Tool */}
              <div>

                <label className="block mb-2">
                  Tool
                </label>

                <select
                  className="w-full bg-black border border-zinc-700 p-3 rounded-lg"
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

                <label className="block mb-2">
                  Plan
                </label>

                <select
                  className="w-full bg-black border border-zinc-700 p-3 rounded-lg"
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

                  {selectedTool?.plans.map((plan) => (
                    <option
                      key={plan}
                      value={plan}
                    >
                      {plan}
                    </option>
                  ))}

                </select>

              </div>

              {/* Monthly Spend */}
              <div>

                <label className="block mb-2">
                  Monthly Spend ($)
                </label>

                <Input
                  type="number"
                  value={entry.monthlySpend}
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

                <label className="block mb-2">
                  Number of Seats
                </label>

                <Input
                  type="number"
                  value={entry.seats}
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

      {/* Add Tool */}
      <Button
        onClick={addTool}
        variant="outline"
      >
        Add Another Tool
      </Button>

      {/* Submit */}
      <div>

        <Button onClick={handleSubmit}>
          Generate Audit
        </Button>

      </div>

    </div>
  );
}