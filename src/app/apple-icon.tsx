import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default async function Icon() {
 const data = await readFile(join(process.cwd(), "public/assets/brand/hinton-YT-logo.png"));
 return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#000", alignItems: "center", justifyContent: "center" }}><img alt="" src={`data:image/png;base64,${data.toString("base64")}`} width={180} height={180} style={{ objectFit: "cover" }} /></div>, size);
}
