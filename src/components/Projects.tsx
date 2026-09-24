import { motion } from "framer-motion";
import { HiExternalLink, HiCode } from "react-icons/hi";
import SectionWrapper from "./SectionWrapper";
import GameEmbed from "./GameEmbed";
import { projects, type Project } from "../data/projects";

function hasPublicLink(project: Project) {
  return Boolean(project.github || project.live);
}

export default function Projects() {
  const published = projects.filter(hasPublicLink);

  return (
    <SectionWrapper id="work">
      <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        Work
      </h2>
      <p className="mb-12 text-text-secondary">
        Software I've shipped with a public link.
      </p>

      <div className="grid gap-6">
        {published.map((project, i) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group grid gap-6 rounded-2xl border border-border bg-bg-card p-6 transition-all hover:border-accent/30 hover:bg-bg-card-hover hover:shadow-lg hover:shadow-accent/5 md:grid-cols-2 md:p-8"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-bg-secondary">
                <span className="font-mono text-sm text-text-muted">
                  screenshot
                </span>
              </div>
            )}

            <div className="flex flex-col">
              {project.featured && (
                <span className="mb-3 w-fit rounded-full bg-accent-glow px-3 py-1 font-mono text-xs font-medium text-accent">
                  Featured
                </span>
              )}

              <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary md:text-2xl">
                {project.title}
              </h3>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary md:text-base">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-bg-secondary px-2.5 py-1 text-xs font-medium text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    <HiCode size={16} />
                    Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    <HiExternalLink size={16} />
                    {project.live.includes("itch.io") ? "Play" : "Live"}
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <GameEmbed />
    </SectionWrapper>
  );
}
