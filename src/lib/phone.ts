// Pakistani numbers typed as 0319 4662181 become +923194662181 for tel: links and structured data.
export const intl = (n: string) => {
  const d = n.replace(/\D/g, "");
  return d.startsWith("92") ? `+${d}` : d.startsWith("0") ? `+92${d.slice(1)}` : `+${d}`;
};
