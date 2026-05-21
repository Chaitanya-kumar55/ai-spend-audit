export interface ToolSpend {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSpend[];
  teamSize: number;
  useCase: string;
}

export interface AuditRecommendation {
  tool: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  recommendation: string;
  reason: string;
}