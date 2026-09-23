const posters: Record<string, string> = {
  "3D Animation Kookie Kandy[30sec].mov": "kookie",
  "Dominoz[30sec].mov": "dominoz",
  "Horror Comedy Soda AD[60secs].mov": "horror",
  "Ilaiyaraaja-birthday-tribute-final-cut.mov": "ilaiyaraaja",
  "Nishiddham-previz[4mins].mov": "nishiddham",
  "Superstar-previz[3mins].mov": "superstar",
  "TATA-1MG[40secs].mov": "tata1mg",
  "Zepto-Raksha-Bandhan-2026.mov": "zepto",
  "Outro-horizontal.mp4": "outro-horizontal",
};
export function posterFor(src: string) {
  const file = decodeURIComponent(src.split("/").pop()?.split("?")[0] || "");
  const key = posters[file] || (/^portfolio-[1-6]\.mp4$/.test(file) ? file.replace(".mp4", "") : null);
  return key ? `/assets/posters/${key}${key !== "outro-horizontal" ? "-2026" : ""}.jpg` : undefined;
}
