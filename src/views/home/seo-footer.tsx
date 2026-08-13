export const SeoFooter = () => {
  return (
    <footer className="bg-black text-white py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h2 className="text-[2.5vmin] max-sm:text-[20px] font-semibold mb-4">Hinton Studios</h2>
          <p className="text-[1.6vmin] max-sm:text-[14px] text-white/70 leading-relaxed mb-6">
            Hinton Studios — AI filmmaking and AI video production studio based in Bengaluru, India.
          </p>
          <address className="not-italic text-[1.4vmin] max-sm:text-[13px] text-white/50">
            Bengaluru, Karnataka<br/>
            India<br/>
            <a href="mailto:hello@hintonstudios.com" className="hover:text-white mt-2 inline-block transition-colors">hello@hintonstudios.com</a>
          </address>
        </div>
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Services</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            <li>AI TVC Production</li>
            <li>Brand & Product Films</li>
            <li>Vertical Micro Dramas</li>
            <li>AI Storyboards & Animatics</li>
            <li>VFX & 3D Animation</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Locations Served</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            <li>Bengaluru (Bangalore)</li>
            <li>Mumbai & Delhi NCR</li>
            <li>USA & Global Brands</li>
            <li>Dubai & UAE</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
