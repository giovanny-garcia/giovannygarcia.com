import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { skillCategories } from "../data/skills";

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        Skills & Tools
      </h2>
      <p className="mb-12 text-text-secondary">
        Languages and tools I use to build software, then the ones I use for
        games.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="rounded-2xl border border-border bg-bg-card p-6"
          >
            <h3 className="mb-4 font-heading text-base font-semibold text-accent">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-bg-secondary px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-accent-glow hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
