export function kroner(value: number): string {
  return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(
    Math.round(value)
  )} kr`;
}

export function tall(value: number, digits = 0): string {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}
