import { AnimatePresence, motion } from "framer-motion";
import { HiExternalLink, HiPlay, HiX } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaItchIo, FaBluesky } from "react-icons/fa6";
import {
  aboutContent,
  socialLinks,
  type WorldStation,
} from "../../data/world";
import { logEntries } from "../../data/log";
import { skillCategories } from "../../data/skills";

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  "itch.io": FaItchIo,
  Bluesky: FaBluesky,
} as const;

interface FocusDockProps {
  station: WorldStation;
  onClose: () => void;
  onPlay: (id: string) => void;
}

export default function FocusDock({ station, onClose, onPlay }: FocusDockProps) {
  // Keep panel under the station and on-screen
  const left = Math.min(82, Math.max(18, station.x));

  return (
    <motion.aside
      role="dialog"
      aria-label={station.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        left: `${left}%`,
        top: `calc(${station.y}% + 2.75rem)`,
      }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-30 flex w-[min(92%,20.5rem)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e16]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:w-[22rem]"
      style={{ maxHeight: "min(48vh, 28rem)" }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="min-w-0 flex-1 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            {station.tagline}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-text-primary">
            {station.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          <HiX size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {station.kind === "playable" && (
              <PlayableBody station={station} onPlay={onPlay} />
            )}
            {station.kind === "about" && <AboutBody />}
            {station.kind === "log" && <LogBody />}
            {station.kind === "skills" && <SkillsBody />}
            {station.kind === "links" && <LinksBody />}
            {station.kind === "soon" && (
              <p className="text-sm leading-relaxed text-text-secondary">
                Prototype bay for the next playable build. When something is
                ready to try in the browser, it will appear as a station on this
                floor.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

function PlayableBody({
  station,
  onPlay,
}: {
  station: Extract<WorldStation, { kind: "playable" }>;
  onPlay: (id: string) => void;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      {station.image ? (
        <img
          src={station.image}
          alt=""
          className="mb-3 aspect-video w-full rounded-lg object-cover"
        />
      ) : null}
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        {station.description}
      </p>
      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {station.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex w-full justify-center gap-2">
        <button
          type="button"
          onClick={() => onPlay(station.id)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-heading text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/25"
        >
          <HiPlay size={16} />
          Play
        </button>
        <a
          href={station.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 px-3 py-2.5 text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          aria-label="Open on itch.io"
        >
          <HiExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

function AboutBody() {
  return (
    <div className="w-full space-y-3">
      <p className="font-heading text-base font-medium text-text-primary">
        {aboutContent.headline}
      </p>
      {aboutContent.paragraphs.map((p) => (
        <p
          key={p.slice(0, 24)}
          className="text-sm leading-relaxed text-text-secondary"
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function LogBody() {
  return (
    <div className="w-full space-y-5 text-left">
      {logEntries.map((entry) => (
        <article
          key={entry.id}
          className="border-b border-white/6 pb-4 last:border-0 last:pb-0"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">
            {entry.date}
          </p>
          <h3 className="mb-1.5 font-heading text-sm font-semibold text-text-primary">
            {entry.title}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            {entry.body}
          </p>
        </article>
      ))}
    </div>
  );
}

function SkillsBody() {
  return (
    <div className="w-full space-y-4 text-left">
      {skillCategories.map((cat) => (
        <div key={cat.name}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            {cat.name}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-xs text-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LinksBody() {
  return (
    <div className="w-full space-y-3">
      <p className="mb-1 text-sm leading-relaxed text-text-secondary">
        Looking for a first software development internship. Best ways to reach
        me:
      </p>
      <ul className="space-y-2">
        {socialLinks.map(({ label, href }) => {
          const Icon = SOCIAL_ICONS[label];
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
              >
                <Icon size={18} />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
