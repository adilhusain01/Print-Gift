import { StoreShell } from "@/components/store-shell";

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <StoreShell>
      <section className="container-site section-space">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-6 max-w-5xl font-heading text-[clamp(3.5rem,7vw,6.5rem)] leading-[.92] tracking-[-0.04em]">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {intro}
        </p>
        <div className="mt-16 grid border-t border-border md:grid-cols-2">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className={`py-9 md:p-10 ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "border-b" : ""} border-border`}
            >
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                0{index + 1}
              </p>
              <h2 className="font-heading text-3xl">{section.title}</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </StoreShell>
  );
}
