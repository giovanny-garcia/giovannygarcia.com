import SectionWrapper from "./SectionWrapper";

export default function About() {
  return (
    <SectionWrapper id="about" className="bg-bg-secondary/50">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          About
        </h2>
        <p className="mb-6 text-text-secondary">
          Computer science student, looking for a first role in software.
        </p>
        <div className="space-y-4 text-base leading-relaxed text-text-secondary">
          <p>
            I'm studying computer science and looking for my first software
            development role. I want that work to lead toward a game studio.
          </p>
          <p>
            The project I can show today is Tiles Ascend, a game I built in
            Godot 4.3, wrote in GDScript, and shipped as a web build.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
