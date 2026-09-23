import Image from "next/image";

const clients = [
  { name: "Trendloud", src: "/assets/clients/trendloud.png", href: "https://trendloud.com/", width: 160, height: 64 },
  { name: "Nice Kidz", src: "/assets/clients/nice-kidz.png", href: "https://nicekidz.com/", width: 160, height: 90 },
  { name: "IIFFCA Federation", src: "/assets/clients/iiffca.jpg", href: "https://www.instagram.com/iiffca.fed/", width: 88, height: 88 },
  { name: "BJP IT Cell", src: "/assets/clients/bjp.svg", width: 80, height: 86 },
];

export function ClientStrip() {
  return (
    <section className="editorial-section client-section" aria-labelledby="clients-title">
      <p className="editorial-kicker" id="clients-title">Selected clients & collaborators</p>
      <div className="client-strip">
        {clients.map(client => {
          const logo = <Image src={client.src} alt={client.name} width={client.width} height={client.height} className={client.name === "BJP IT Cell" ? "client-logo client-logo-light" : "client-logo"} />;
          return client.href ? <a key={client.name} href={client.href} target="_blank" rel="noopener noreferrer">{logo}</a> : <span key={client.name}>{logo}</span>;
        })}
      </div>
    </section>
  );
}
