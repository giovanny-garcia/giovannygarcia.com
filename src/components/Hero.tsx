import { motion } from "framer-motion";
import { HiArrowDown, HiPlay } from "react-icons/hi";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 font-mono text-sm tracking-widest text-accent uppercase md:text-base">
            Seeking a software development internship
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mb-6 font-heading text-4xl leading-tight font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
            Giovanny Garcia
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
        >
          I'm a computer science student looking for my first software
          development role. The software I most want to build is games.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => scrollTo("#work")}
            className="group flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-heading text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/20"
          >
            View work
            <HiArrowDown className="transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={() => scrollTo("#game")}
            className="group flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-glow px-6 py-3 font-heading text-sm font-semibold text-accent transition-all hover:border-accent/60 hover:bg-accent/10"
          >
            <HiPlay className="transition-transform group-hover:scale-110" />
            Play Tiles Ascend
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-text-muted/30 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-text-muted/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
