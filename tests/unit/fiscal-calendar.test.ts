import { describe, it, expect } from "vitest"
import { getFiscalEventsForStatus } from "@/lib/fiscal/calendar"

describe("Fiscal calendar generation", () => {
  describe("Auto-Entrepreneur events", () => {
    it("generates monthly URSSAF events for AE", () => {
      const events = getFiscalEventsForStatus("AUTO_ENTREPRENEUR", 2024, false)
      const urssafEvents = events.filter((e) => e.type === "URSSAF")
      expect(urssafEvents.length).toBe(12) // 12 monthly declarations
    })

    it("generates quarterly URSSAF events for AE (optional)", () => {
      const events = getFiscalEventsForStatus("AUTO_ENTREPRENEUR", 2024, true)
      const urssafEvents = events.filter((e) => e.type === "URSSAF")
      expect(urssafEvents.length).toBe(4) // 4 quarterly declarations
    })

    it("includes CFE for AE", () => {
      const events = getFiscalEventsForStatus("AUTO_ENTREPRENEUR", 2024, false)
      const cfeEvents = events.filter((e) => e.type === "CFE")
      expect(cfeEvents.length).toBe(1)
      expect(cfeEvents[0]?.date.getMonth()).toBe(11) // December (0-indexed)
    })

    it("returns valid dates for all AE events", () => {
      const events = getFiscalEventsForStatus("AUTO_ENTREPRENEUR", 2024, false)
      for (const event of events) {
        expect(event.date).toBeInstanceOf(Date)
        expect(event.date.getFullYear()).toBe(2024)
        expect(event.date.getTime()).not.toBeNaN()
      }
    })
  })

  describe("SASU events", () => {
    it("generates IS acompte events for SASU", () => {
      const events = getFiscalEventsForStatus("SASU", 2024)
      const isEvents = events.filter((e) => e.type === "IS")
      expect(isEvents.length).toBe(4) // 4 quarterly payments
    })

    it("generates TVA events for SASU", () => {
      const events = getFiscalEventsForStatus("SASU", 2024)
      const tvaEvents = events.filter((e) => e.type === "TVA")
      expect(tvaEvents.length).toBeGreaterThan(0)
    })

    it("includes CFE for SASU", () => {
      const events = getFiscalEventsForStatus("SASU", 2024)
      const cfeEvents = events.filter((e) => e.type === "CFE")
      expect(cfeEvents.length).toBe(1)
    })
  })

  describe("EURL events", () => {
    it("generates same events as SASU for EURL", () => {
      const sasuEvents = getFiscalEventsForStatus("SASU", 2024)
      const eurlEvents = getFiscalEventsForStatus("EURL", 2024)
      expect(eurlEvents.length).toBe(sasuEvents.length)
    })
  })

  it("all events have required fields", () => {
    const events = getFiscalEventsForStatus("AUTO_ENTREPRENEUR", 2024)
    for (const event of events) {
      expect(event.type).toBeDefined()
      expect(event.title).toBeTruthy()
      expect(event.date).toBeInstanceOf(Date)
      expect(typeof event.isRecurring).toBe("boolean")
    }
  })
})
