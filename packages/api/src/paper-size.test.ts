import { describe, expect, it } from "vitest";
import { normalizePaperSize } from "./paper-size";

describe("normalizePaperSize", () => {
  it.each([
    ["A4", "A4"],
    ["a4", "A4"],
    ["A5", "A5"],
    ["a5", "A5"],
    ["B4", "B4"],
    ["b4", "B4"],
    ["B5", "B5"],
    ["b5", "B5"]
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePaperSize(input)).toBe(expected);
  });

  it.each([null, undefined, "", "letter", "A3"])("falls back to A4 for %s", (input) => {
    expect(normalizePaperSize(input)).toBe("A4");
  });
});
