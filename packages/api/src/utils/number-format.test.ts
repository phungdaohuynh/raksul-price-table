import { describe, expect, it } from "vitest";
import { formatNumberWithCommas } from "./number-format";

describe("formatNumberWithCommas", () => {
  it.each([
    [1, "1"],
    [10, "10"],
    [100, "100"],
    [1000, "1,000"],
    [12345, "12,345"],
    [123456, "123,456"],
    [1234567, "1,234,567"],
    [1234567890, "1,234,567,890"]
  ])("formats %s as %s", (input, expected) => {
    expect(formatNumberWithCommas(input)).toBe(expected);
  });
});
