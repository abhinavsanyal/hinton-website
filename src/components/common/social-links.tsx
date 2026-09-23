import { socialLinks } from "@/data/social-links";

const paths = {
  instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
  facebook: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  x: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.4 22H2.2l8.3-9.5L.8 2h6.5l4.5 6.8L18.9 2zM17.8 20h1.8L6.3 4H4.4l13.4 16z",
  linkedin: "M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2 9h4v13H2V9zm7 0h4v1.8c.7-1.2 2-2.1 3.8-2.1 4.1 0 5.2 2.6 5.2 6V22h-4v-6.5c0-1.8-.4-3.2-2.2-3.2-2 0-2.8 1.4-2.8 3.2V22H9V9z",
  youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z",
};
export function SocialLinks() {
  return <nav className="social-links" aria-label="Follow Hinton Studios">{socialLinks.map(social => <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.name}: ${social.handle}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={paths[social.icon]} /></svg><span><strong>{social.name}</strong><small>{social.handle}</small></span></a>)}</nav>;
}
