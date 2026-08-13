export const SeoCapabilities = () => {
  const capabilities = [
    "AI TVC production", "AI ad film production", "AI brand films", "AI product films",
    "AI animated series", "AI short films", "Vertical micro drama production",
    "AI storyboards and animatics", "AI reels and UGC ads", "AI VFX and CGI",
    "Multilingual AI voiceover", "4K broadcast delivery"
  ];
  return (
    <section className="bg-black text-white/70 py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Capabilities">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[2vmin] max-sm:text-[14px] uppercase tracking-widest font-semibold mb-[4vmin] text-white/50">Our Capabilities</h2>
        <ul className="flex flex-wrap gap-4 text-[1.8vmin] max-sm:text-[14px]">
          {capabilities.map((cap, i) => (
            <li key={i} className="flex items-center">
              <a href="#" className="hover:text-white transition-colors">{cap}</a>
              {i < capabilities.length - 1 && <span className="ml-4 text-white/20">·</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
