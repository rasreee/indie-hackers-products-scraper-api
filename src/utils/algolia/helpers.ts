export function encode(format: string, ...args: readonly any[]): string {
  let i = 0;

  return format.replace(/%s/g, () => encodeURIComponent(args[i++]));
}
