export const SeoHowTo = () => {
  return (
    <section className="bg-black text-white py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Process">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[4vmin] max-sm:text-[24px] font-light mb-[6vmin]">How an AI ad film gets made at Hinton</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "The Brief", desc: "We receive your brand requirements, budget constraints, and delivery formats." },
            { title: "Script & Shot List", desc: "Human directors craft a cinematic screenplay and precise shot list." },
            { title: "Animatic Generation", desc: "Initial storyboards and animatics are generated within 48 hours for review." },
            { title: "AI Execution", desc: "Generative AI pipeline across Seedance, Veo, Kling and Sora creates the raw footage." },
            { title: "VFX & Compositing", desc: "Character consistency and complex VFX are enforced through human-guided compositing." },
            { title: "Grade & Finish", desc: "Final color grade and finish in DaVinci Resolve for broadcast-ready 4K delivery." },
          ].map((step, i) => (
            <li key={i} className="border-l border-white/20 pl-6">
              <span className="text-[1.5vmin] max-sm:text-[12px] text-white/50 uppercase tracking-widest">Step 0{i+1}</span>
              <h3 className="text-[2.2vmin] max-sm:text-[18px] font-medium mt-2 mb-3">{step.title}</h3>
              <p className="text-[1.6vmin] max-sm:text-[14px] text-white/70 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
