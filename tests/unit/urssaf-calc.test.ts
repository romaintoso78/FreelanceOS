import { describe, it, expect } from "vitest"
import {
  calculateUrssafAE,
  calculateUrssaf,
  getVatThresholdWarning,
  AE_VAT_THRESHOLDS,
} from "@/lib/fiscal/urssaf"

describe("URSSAF calculation for Auto-Entrepreneur", () => {
  it("calculates 22% of CA for AE services", () => {
    const result = calculateUrssafAE(10_000)
    expect(result.cotisations).toBe(2_200)
    expect(result.tauxApplique).toBe(0.22)
  })

  it("returns zero cotisations for zero CA", () => {
    const result = calculateUrssafAE(0)
    expect(result.cotisations).toBe(0)
  })

  it("calculates correctly for typical freelance income", () => {
    const result = calculateUrssafAE(50_000)
    expect(result.cotisations).toBe(11_000)
  })
})

describe("URSSAF calculation by legal status", () => {
  it("uses AE rate for AUTO_ENTREPRENEUR", () => {
    const result = calculateUrssaf("AUTO_ENTREPRENEUR", 30_000)
    expect(result.cotisations).toBe(6_600)
    expect(result.tauxApplique).toBe(0.22)
  })

  it("returns estimation for SASU", () => {
    const result = calculateUrssaf("SASU", 100_000)
    expect(result.cotisations).toBeGreaterThan(0)
    expect(result.tauxApplique).toBeGreaterThan(0)
  })

  it("returns estimation for EURL", () => {
    const result = calculateUrssaf("EURL", 80_000)
    expect(result.cotisations).toBeGreaterThan(0)
  })
})

describe("VAT threshold warnings", () => {
  it("returns null warning for SASU (TVA applies from start)", () => {
    const result = getVatThresholdWarning(10_000, "SASU")
    expect(result).toBeNull()
  })

  it("returns null warning for EURL", () => {
    const result = getVatThresholdWarning(10_000, "EURL")
    expect(result).toBeNull()
  })

  it("returns no warning below 80% threshold for AE", () => {
    const result = getVatThresholdWarning(20_000, "AUTO_ENTREPRENEUR")
    expect(result?.level).toBe("none")
  })

  it("returns warning at 80% threshold for AE", () => {
    const warningThreshold = AE_VAT_THRESHOLDS.services * 0.8 // 30,000
    const result = getVatThresholdWarning(warningThreshold + 1, "AUTO_ENTREPRENEUR")
    expect(result?.level).toBe("warning")
  })

  it("returns critical warning at 95% threshold for AE", () => {
    const criticalThreshold = AE_VAT_THRESHOLDS.services * 0.95 // 35,625
    const result = getVatThresholdWarning(criticalThreshold + 1, "AUTO_ENTREPRENEUR")
    expect(result?.level).toBe("critical")
  })

  it("correctly identifies the 37,500€ threshold", () => {
    expect(AE_VAT_THRESHOLDS.services).toBe(37_500)
  })
})
