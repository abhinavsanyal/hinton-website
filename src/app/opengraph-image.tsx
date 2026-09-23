import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt = "Hinton Studios — Human-directed AI filmmaking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpengraphImage() {
 const data = await readFile(join(process.cwd(), "public/assets/brand/hinton-YT-logo.png"));
 return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#000", alignItems: "center", justifyContent: "center" }}><img alt="" src={`data:image/png;base64,${data.toString("base64")}`} width={1200} height={630} style={{ objectFit: "cover" }} /></div>, size);
}
