import { StoreShell } from "@/components/store-shell";

export function InfoPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <StoreShell>
      <section className="container-site section-space">
        <h1 className="max-w-5xl font-heading text-[clamp(3.5rem,7vw,6.5rem)] leading-[.92] tracking-[-0.04em]">
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
