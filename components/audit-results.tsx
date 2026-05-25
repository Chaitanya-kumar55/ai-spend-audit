"use client";

import { useEffect, useState } from "react";

import { AuditRecommendation } from "@/types/audit";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

import { v4 as uuidv4 } from "uuid";

interface Props {
  results: AuditRecommendation[];
}

export default function AuditResults({
  results,
}: Props) {

  const [summary, setSummary] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [email, setEmail] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [role, setRole] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [shareUrl, setShareUrl] =
    useState("");

  const totalMonthlySavings =
    results.reduce(
      (acc, item) => acc + item.savings,
      0
    );

  const annualSavings =
    totalMonthlySavings * 12;

  // AI Summary
  useEffect(() => {

    async function generateSummary() {

      try {

        const response = await fetch(
          "/api/summary",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              results,
            }),
          }
        );

        const data =
          await response.json();

        setSummary(data.summary);

      } catch (error) {

        console.error(error);

        setSummary(
          "Your AI stack has optimization opportunities that could reduce monthly operating costs."
        );

      } finally {

        setLoading(false);

      }

    }

    generateSummary();

  }, [results]);

  // Save audit
  async function saveLead() {

    if (!email) {

      alert("Email required");

      return;
    }

    const shareId = uuidv4();

    const { error } =
      await supabase
        .from("audits")
        .insert([
          {
            email,
            company,
            role,
            share_id: shareId,
            audit_data: results,
          },
        ]);

    if (error) {

      console.error(error);

      alert(
        "Failed to save audit"
      );

      return;
    }

    const url =
      `${window.location.origin}/report/${shareId}`;

    setShareUrl(url);

    setSubmitted(true);
  }

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

      {/* AI Summary */}
      <div className="border border-zinc-800 rounded-2xl p-6 mb-10">

        <h3 className="text-2xl font-semibold mb-4">
          AI Summary
        </h3>

        {loading ? (

          <p className="text-zinc-400">
            Generating summary...
          </p>

        ) : (

          <p className="text-zinc-300 leading-7">
            {summary}
          </p>

        )}

      </div>

      {/* Lead Capture */}
      <div className="border border-zinc-800 rounded-2xl p-6 mb-10">

        <h3 className="text-2xl font-semibold mb-6">
          Save Your Audit
        </h3>

        {submitted ? (

          <div className="space-y-4">

            <p className="text-green-400">
              Audit saved successfully.
            </p>

            <div>

              <p className="text-sm text-zinc-400 mb-2">
                Shareable Report URL
              </p>

              <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg break-all">

                {shareUrl}

              </div>

            </div>

          </div>

        ) : (

          <div className="space-y-4">

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <Input
              placeholder="Company"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
            />

            <Input
              placeholder="Role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            />

            <Button onClick={saveLead}>
              Save Audit
            </Button>

          </div>

        )}

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