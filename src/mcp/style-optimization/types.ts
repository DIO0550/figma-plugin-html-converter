export interface AIStyleOptimizationRequest {
  styles: Record<string, string>;
  html?: string;
  context?: string;
}

export interface AIStyleOptimizationResponse {
  proposals: AIStyleOptimizationProposal[];
  processingTimeMs: number;
}

export interface AIStyleOptimizationProposal {
  property: string;
  suggestion: string;
  reason: string;
  confidence: number;
}
