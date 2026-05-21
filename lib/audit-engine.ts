import {
  AuditInput,
  AuditRecommendation,
} from "@/types/audit";

export function generateAudit(
  input: AuditInput
): AuditRecommendation[] {

  const recommendations: AuditRecommendation[] = [];

  input.tools.forEach((tool) => {

    // ChatGPT optimization
    if (
      tool.tool === "ChatGPT" &&
      tool.plan === "Team" &&
      tool.seats <= 2
    ) {

      const recommendedSpend = 40;
      const savings =
        tool.monthlySpend - recommendedSpend;

      recommendations.push({
        tool: "ChatGPT",
        currentSpend: tool.monthlySpend,
        recommendedSpend,
        savings,
        recommendation:
          "Downgrade to ChatGPT Plus",
        reason:
          "Small teams usually do not require Team features.",
      });
    }

    // Cursor optimization
    else if (
      tool.tool === "Cursor" &&
      tool.plan === "Business" &&
      tool.seats < 5
    ) {

      const recommendedSpend =
        tool.seats * 20;

      const savings =
        tool.monthlySpend - recommendedSpend;

      recommendations.push({
        tool: "Cursor",
        currentSpend: tool.monthlySpend,
        recommendedSpend,
        savings,
        recommendation:
          "Switch to Cursor Pro",
        reason:
          "Cursor Business pricing is expensive for smaller engineering teams.",
      });
    }

    // Copilot optimization
    else if (
      tool.tool === "GitHub Copilot" &&
      tool.plan === "Business" &&
      tool.seats <= 2
    ) {

      const recommendedSpend =
        tool.seats * 10;

      const savings =
        tool.monthlySpend - recommendedSpend;

      recommendations.push({
        tool: "GitHub Copilot",
        currentSpend: tool.monthlySpend,
        recommendedSpend,
        savings,
        recommendation:
          "Switch to Copilot Individual",
        reason:
          "Business features may not justify cost for very small teams.",
      });
    }

    // Already optimized
    else {

      recommendations.push({
        tool: tool.tool,
        currentSpend: tool.monthlySpend,
        recommendedSpend: tool.monthlySpend,
        savings: 0,
        recommendation:
          "Current plan looks appropriate",
        reason:
          "No meaningful optimization opportunities detected.",
      });
    }

  });

  return recommendations;
}