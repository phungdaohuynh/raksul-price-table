export function formatNumberWithCommas(value: number): string {
  const digits = String(value);
  const groups: string[] = [];

  for (let end = digits.length; end > 0; end -= 3) {
    const start = Math.max(end - 3, 0);
    groups.unshift(digits.slice(start, end));
  }

  return groups.join(",");
}
