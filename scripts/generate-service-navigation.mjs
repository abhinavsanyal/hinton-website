import { readFileSync, writeFileSync } from "node:fs";
const content = readFileSync(new URL("../src/data/mocks/services.ts", import.meta.url), "utf8");
const pattern = /["']?slug["']?:\s*("(?:\\.|[^"\\])*")[\s\S]*?["']?navLabel["']?:\s*("(?:\\.|[^"\\])*")[\s\S]*?["']?navBlurb["']?:\s*("(?:\\.|[^"\\])*")/g;
const links = [...content.matchAll(pattern)].map((match) => ({ slug: JSON.parse(match[1]), navLabel: JSON.parse(match[2]), navBlurb: JSON.parse(match[3]) })).filter(link => !["2d-and-3d-animation", "brand-and-product-films"].includes(link.slug));
if (links.length < 1 || new Set(links.map(link => link.slug)).size !== links.length) throw new Error("Invalid service navigation source");
writeFileSync(new URL("../src/data/service-navigation.ts", import.meta.url), `// Generated from mocks/services.ts. Run npm run generate:nav after changing services.\nexport const serviceNavigation = ${JSON.stringify(links, null, 2)};\n`);
