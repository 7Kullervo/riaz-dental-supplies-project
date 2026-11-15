// Pakistani numbers typed as 0319 4662181 become +923194662181 for tel: links and structured data.
export const intl = (n: string) => {
  const d = n.replace(/\D/g, "");
  return d.startsWith("92") ? `+${d}` : d.startsWith("0") ? `+92${d.slice(1)}` : `+${d}`;
};

// WhatsApp links need the number as digits with country code and no leading 0 (e.g. 923344138720).
// Accepts how people normally write Pakistani numbers: 0334 4138720, +92 334 4138720, 3344138720.
export const waNumber = (n: string) => {
  let d = n.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("92")) return d;
  if (d.startsWith("0")) return "92" + d.slice(1);
  if (d.length === 10 && d.startsWith("3")) return "92" + d;
  return d;
};
