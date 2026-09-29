import { AnimatePresence, motion } from "framer-motion";
import { HiPlay } from "react-icons/hi";
import {
  FaGithub,
  FaLinkedin,
  FaItchIo,
  FaBluesky,
  FaInstagram,
  FaTwitch,
} from "react-icons/fa6";
import type { RefObject } from "react";
import {
  aboutContent,
  guitarContent,
  socialLinks,
  type DockPlacement,
  type WorldStation,
} from "../../data/world";
import { blogPosts } from "../../data/blog";
import { logEntries } from "../../data/log";
import { skillCategories } from "../../data/skills";
import ElectricBorder from "./ElectricBorder";

/** Phrases wrapped in *asterisks* render in accent, for a few key words only. */
function AccentText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span
          key={i}
          className="text-accent font-semibold"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  "itch.io": FaItchIo,
  Bluesky: FaBluesky,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
} as const;

const STATION_TAG_CLASS =
  "cursor-default select-none rounded-md border border-transparent bg-white/5 px-2 py-1 font-mono text-[10px] text-text-muted transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-accent/30 hover:bg-accent/10 hover:text-accent";

function StationTag({ label }: { label: string }) {
  return <span className={STATION_TAG_CLASS}>{label}</span>;
}

interface FocusDockProps {
  station: WorldStation;
  placement: DockPlacement;
  dockRef: RefObject<HTMLDivElement | null>;
}

export default function FocusDock({
  station,
  placement,
  dockRef,
}: FocusDockProps) {
  const playable = station.kind === "playable";
  const { placeBelow, maxHeight } = placement;

  const panel = (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-3 py-1.5">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-sm font-semibold tracking-tight text-text-primary">
            {station.title}
          </h2>
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-accent/90">
            {station.tagline}
          </p>
        </div>
      </div>

      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {station.kind === "playable" && <PlayableBody station={station} />}
            {station.kind === "about" && <AboutBody />}
            {station.kind === "log" && <LogBody />}
            {station.kind === "skills" && <SkillsBody />}
            {station.kind === "links" && <LinksBody />}
            {station.kind === "blog" && <BlogBody />}
            {station.kind === "guitar" && <GuitarBody />}
            {station.kind === "soon" && (
              <p className="text-sm leading-relaxed text-text-secondary">
                <AccentText text="Nothing *playable* here yet. The next browser build gets this spot when it's actually ready to try." />
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <div
      ref={dockRef}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-30 flex w-[min(92%,20.5rem)] -translate-x-1/2 flex-col select-none md:w-[22rem]"
      style={{
        left: placement.left,
        top: placement.top,
        bottom: placement.bottom,
        maxHeight,
      }}
    >
      <motion.aside
        role="dialog"
        aria-label={station.title}
        initial={{ opacity: 0, y: placeBelow ? 12 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: placeBelow ? 10 : -10 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={
          playable
            ? "flex min-h-0 flex-1 flex-col overflow-visible"
            : "flex min-h-0 max-h-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e16]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        }
      >
        {playable ? (
          <ElectricBorder
            borderRadius={16}
            className="flex min-h-0 w-full flex-1 flex-col"
            contentClassName="flex min-h-0 flex-1 flex-col"
            contentStyle={{ height: "auto", minHeight: 0, flex: "1 1 auto" }}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e16]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {panel}
            </div>
          </ElectricBorder>
        ) : (
          panel
        )}
      </motion.aside>
    </div>
  );
}

function PlayableBody({
  station,
}: {
  station: Extract<WorldStation, { kind: "playable" }>;
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
        <AccentText text={station.description} />
      </p>
      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {station.tags.map((tag) => (
          <StationTag key={tag} label={tag} />
        ))}
      </div>
      <a
        href={station.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-heading text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/25"
      >
        <HiPlay size={16} />
        Play on itch.io
      </a>
    </div>
  );
}

function AboutBody() {
  return (
    <div className="w-full space-y-3">
      <p className="font-heading text-base font-medium text-text-primary">
        <AccentText text={aboutContent.headline} />
      </p>
      {aboutContent.paragraphs.map((p) => (
        <p
          key={p.slice(0, 24)}
          className="text-sm leading-relaxed text-text-secondary"
        >
          <AccentText text={p} />
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
            <AccentText text={entry.body} />
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
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            {cat.name}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {cat.skills.map((skill) => (
              <StationTag key={skill} label={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogBody() {
  return (
    <div className="w-full space-y-5 text-left">
      {blogPosts.map((post) => (
        <article
          key={post.id}
          className="border-b border-white/6 pb-4 last:border-0 last:pb-0"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">
            {post.date}
          </p>
          <h3 className="mb-1.5 font-heading text-sm font-semibold text-text-primary">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            <AccentText text={post.body} />
          </p>
        </article>
      ))}
    </div>
  );
}

function GuitarBody() {
  return (
    <div className="w-full space-y-3">
      <p className="font-heading text-base font-medium text-text-primary">
        <AccentText text={guitarContent.headline} />
      </p>
      {guitarContent.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-text-secondary">
          <AccentText text={p} />
        </p>
      ))}
    </div>
  );
}

function LinksBody() {
  return (
    <div className="w-full space-y-3">
      <p className="mb-1 text-sm leading-relaxed text-text-secondary">
        <AccentText text="Open to a first *software internship*. Easiest ways to reach me:" />
      </p>
      <ul className="grid grid-cols-2 gap-2">
        {socialLinks.map(({ label, href }) => {
          const Icon = SOCIAL_ICONS[label];
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2 text-sm text-text-secondary transition-colors hover:border-accent/35 hover:bg-accent/5 hover:text-accent"
              >
                <Icon size={16} />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
