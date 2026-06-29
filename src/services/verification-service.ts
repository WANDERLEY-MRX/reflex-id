import type { ConfidenceLevel, Validation } from "@prisma/client";
import { config } from "@/config";

export interface ConfidenceInput {
  validations: Pick<Validation, "status" | "confidenceLevel" | "validatorType">[];
  hasOrgVerification: boolean;
  evidenceAge: number;
  userVerificationRate: number;
}

const CONFIDENCE_WEIGHTS = {
  VALIDATION_STATUS: 0.35,
  VALIDATOR_TYPE: 0.25,
  ORGANIZATION_VERIFICATION: 0.20,
  EVIDENCE_AGE: 0.10,
  USER_HISTORY: 0.10,
} as const;

const VALIDATOR_TYPE_SCORES: Record<string, number> = {
  ORGANIZATION: 1.0,
  MANUAL: 0.8,
  PEER: 0.5,
  AI: 0.4,
};

const VALIDATION_STATUS_SCORES: Record<string, number> = {
  APPROVED: 1.0,
  REJECTED: 0.0,
  PENDING: 0.3,
};

export class VerificationService {
  calculateConfidence(input: ConfidenceInput): {
    score: number;
    level: ConfidenceLevel;
    breakdown: Record<string, number>;
  } {
    const statusScore = this.calculateStatusScore(input.validations);
    const validatorScore = this.calculateValidatorScore(input.validations);
    const orgScore = input.hasOrgVerification ? 1.0 : 0.0;
    const ageScore = this.calculateAgeScore(input.evidenceAge);
    const historyScore = Math.min(input.userVerificationRate, 1.0);

    const totalScore =
      statusScore * CONFIDENCE_WEIGHTS.VALIDATION_STATUS +
      validatorScore * CONFIDENCE_WEIGHTS.VALIDATOR_TYPE +
      orgScore * CONFIDENCE_WEIGHTS.ORGANIZATION_VERIFICATION +
      ageScore * CONFIDENCE_WEIGHTS.EVIDENCE_AGE +
      historyScore * CONFIDENCE_WEIGHTS.USER_HISTORY;

    const level = this.scoreToLevel(totalScore);

    return {
      score: Math.round(totalScore * 100) / 100,
      level,
      breakdown: {
        statusScore,
        validatorScore,
        orgScore,
        ageScore,
        historyScore,
      },
    };
  }

  private calculateStatusScore(validations: Pick<Validation, "status">[]): number {
    if (validations.length === 0) return 0;
    const total = validations.reduce((acc, v) => {
      return acc + (VALIDATION_STATUS_SCORES[v.status] ?? 0);
    }, 0);
    return total / validations.length;
  }

  private calculateValidatorScore(
    validations: Pick<Validation, "validatorType">[]
  ): number {
    if (validations.length === 0) return 0;
    const total = validations.reduce((acc, v) => {
      return acc + (VALIDATOR_TYPE_SCORES[v.validatorType] ?? 0);
    }, 0);
    return total / validations.length;
  }

  private calculateAgeScore(ageInDays: number): number {
    if (ageInDays <= 30) return 0.9;
    if (ageInDays <= 90) return 0.8;
    if (ageInDays <= 180) return 0.7;
    if (ageInDays <= 365) return 0.6;
    return 0.5;
  }

  private scoreToLevel(score: number): ConfidenceLevel {
    if (score >= 0.85) return "VERY_HIGH";
    if (score >= 0.70) return "HIGH";
    if (score >= 0.45) return "MEDIUM";
    return "LOW";
  }

  meetsThreshold(score: number): boolean {
    return score >= config.verification.confidenceThreshold;
  }

  needsMoreValidations(currentCount: number): boolean {
    return currentCount < config.verification.requiredValidations;
  }
}

export const verificationService = new VerificationService();
