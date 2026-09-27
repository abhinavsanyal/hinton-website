import Link from "next/link";
import { audioSamples } from "@/data/audio-samples";
import { AudioPlayer } from "@/components/ui/audio-player";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

import { EditorialShell } from "@/components/blog/editorial-shell";
export { EditorialShell } from "@/components/blog/editorial-shell";
export { BlogView, ArticleView, blogMetadata, articleParams, articleMetadata } from "@/views/blog";
export const aboutMetadata = buildMetadata({ title: "About Our AI Film Studio", description: "Meet Hinton Studios, a Bengaluru-based studio combining human creative direction with AI-assisted film production for brands worldwide.", url: "/about" });
export function AboutView() {
  return <EditorialShell title="Human vision. New ways to make it real." kicker="About Hinton"><div className="editorial-prose"><p className="editorial-lede">We are a Bengaluru-based AI filmmaking studio. Our work brings creative direction, visual development and film finishing into one production process.</p><h2>The idea comes first.</h2><p>We help brands turn a brief into a film: from the first narrative and visual references to the edit, sound and final delivery. AI expands the production toolkit; people make the decisions that give a film its purpose.</p><h2>A studio for every screen.</h2><p>Explore our television commercials, brand and product films, animation, visual effects and vertical storytelling. We scope each project around its audience, channel, creative ambition and delivery requirements.</p><h2>Start a conversation.</h2><p>Our studio contacts are Abhinava, Avkash and Souvik. Share your brief with <a href="mailto:abhinava@hintonstudios.com">abhinava@hintonstudios.com</a> and we’ll connect you with the right team.</p><Link href="/work">Explore our work ↗</Link></div></EditorialShell>;
}
export const audioMetadata = { ...buildMetadata({ title: "AI Voice & Audio Production", description: "Explore Hinton Studios’ approach to AI-assisted voice, sound and multilingual film production. Request audio references for your brief.", url: "/audio-samples" }), robots: { index: audioSamples.length > 0, follow: true } };
export function AudioView() {
  return <EditorialShell title="Give your story a voice." kicker="AI audio"><div className="editorial-prose"><p className="editorial-lede">Voice and sound should belong to the film, not feel added on.</p><h2>Voice direction, language and tone.</h2><p>Tell us the language, intended audience, duration and mood of your project. We can discuss voice direction and audio references as part of your production brief.</p><h2>Listen to references for your project.</h2>{audioSamples.length ? <div className="editorial-grid">{audioSamples.map(sample => <AudioPlayer key={sample.id} sample={sample} />)}</div> : <p>Our public audio collection is being prepared. Contact the studio for relevant samples and usage details.</p>}<a href="mailto:abhinava@hintonstudios.com">Request audio samples ↗</a></div></EditorialShell>;
}
