import { describe, it, expect } from "vitest"

// Pure function to test invoice number generation logic
function formatInvoiceNumber(year: number, sequence: number): string {
  return `${year}-${String(sequence).padStart(3, "0")}`
}

function parseInvoiceNumber(number: string): { year: number; sequence: number } | null {
  const match = number.match(/^(\d{4})-(\d{3,})$/)
  if (!match || !match[1] || !match[2]) return null
  return {
    year: parseInt(match[1], 10),
    sequence: parseInt(match[2], 10),
  }
}

function formatQuoteNumber(year: number, sequence: number): string {
  return `DEV-${year}-${String(sequence).padStart(3, "0")}`
}

describe("Invoice number generation", () => {
  it("formats invoice numbers correctly", () => {
    expect(formatInvoiceNumber(2024, 1)).toBe("2024-001")
    expect(formatInvoiceNumber(2024, 10)).toBe("2024-010")
    expect(formatInvoiceNumber(2024, 100)).toBe("2024-100")
    expect(formatInvoiceNumber(2024, 999)).toBe("2024-999")
  })

  it("formats quote numbers correctly", () => {
    expect(formatQuoteNumber(2024, 1)).toBe("DEV-2024-001")
    expect(formatQuoteNumber(2024, 42)).toBe("DEV-2024-042")
  })

  it("parses invoice numbers correctly", () => {
    expect(parseInvoiceNumber("2024-001")).toEqual({ year: 2024, sequence: 1 })
    expect(parseInvoiceNumber("2024-042")).toEqual({ year: 2024, sequence: 42 })
    expect(parseInvoiceNumber("2024-999")).toEqual({ year: 2024, sequence: 999 })
  })

  it("returns null for invalid invoice numbers", () => {
    expect(parseInvoiceNumber("invalid")).toBeNull()
    expect(parseInvoiceNumber("2024")).toBeNull()
    expect(parseInvoiceNumber("DEV-2024-001")).toBeNull() // Quote format
  })

  it("sequences are zero-padded to 3 digits minimum", () => {
    for (let i = 1; i <= 9; i++) {
      const num = formatInvoiceNumber(2024, i)
      expect(num).toMatch(/^\d{4}-0{2}\d$/)
    }
    for (let i = 10; i <= 99; i++) {
      const num = formatInvoiceNumber(2024, i)
      expect(num).toMatch(/^\d{4}-0\d{2}$/)
    }
  })

  it("next sequence is previous + 1", () => {
    const current = "2024-005"
    const parsed = parseInvoiceNumber(current)!
    const next = formatInvoiceNumber(parsed.year, parsed.sequence + 1)
    expect(next).toBe("2024-006")
  })
})
