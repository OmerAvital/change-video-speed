export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function round(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export function clean(strs: TemplateStringsArray, ...keys: string[]): string {
  const cleanUp = (s: string) => s.replace(/\s+/gm, ' ');
  let out = '';
  for (let i = 0; i < strs.length; i += 1) {
    out += strs[i];
    if (i < keys.length) {
      out += keys[i];
    }
  }

  return cleanUp(out).trim();
}
