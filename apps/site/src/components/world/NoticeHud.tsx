import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiBell, HiX } from "react-icons/hi";
import { notices, type NoticeKind } from "../../data/notices";

const READ_KEY = "gg-notices-read";

const KIND_LABEL: Record<NoticeKind, string> = {
  announcement: "Announcement",
  changelog: "Changelog",
};

type Filter = "all" | NoticeKind;

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    // Private mode and blocked storage still leave the panel usable this visit.
  }
}

export default function NoticeHud() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(loadReadIds);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadNotices = useMemo(
    () => notices.filter((notice) => !readIds.has(notice.id)),
    [readIds],
  );
  const kinds = useMemo(() => {
    const present = new Set(notices.map((notice) => notice.kind));
    return (["announcement", "changelog"] as const).filter((kind) =>
      present.has(kind),
    );
  }, []);
  const visible = useMemo(
    () =>
      notices.filter((notice) => filter === "all" || notice.kind === filter),
    [filter],
  );

  const markAllRead = () => {
    const next = new Set(notices.map((notice) => notice.id));
    setReadIds(next);
    saveReadIds(next);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...kinds.map((kind) => ({ id: kind, label: KIND_LABEL[kind] })),
  ];

  return (
    <aside
      aria-label="Notices"
      className="absolute top-3.5 right-3 z-30 flex flex-col items-end md:top-4 md:right-5"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (!open) markAllRead();
          setOpen((value) => !value);
        }}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md ${
          unreadNotices.length > 0
            ? "border-accent/50 bg-[#0c1018]/95 text-accent"
            : "border-white/10 bg-[#0e0e16]/85 text-text-secondary"
        }`}
      >
        <HiBell size={14} aria-hidden />
        Notices
        {unreadNotices.length > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-[#041016]">
            {unreadNotices.length}
          </span>
        )}
      </button>

      {!open && unreadNotices[0] && (
        <p className="mt-1.5 max-w-[14rem] truncate text-right font-mono text-[10px] tracking-wide text-accent/90">
          {unreadNotices[0].title}
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notices"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-2 flex max-h-[min(24rem,calc(100dvh-7.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e16]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md select-none max-md:fixed max-md:top-[8.75rem] max-md:right-3 max-md:mt-0 max-md:max-h-[min(24rem,calc(100dvh-12rem))]"
          >
            <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-3 py-2">
              <p className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Notices
              </p>
              <button
                type="button"
                aria-label="Close notices"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <HiX size={14} />
              </button>
            </div>

            {filters.length > 2 && (
              <div className="flex shrink-0 gap-1 px-3 pt-2">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={filter === item.id}
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      filter === item.id
                        ? "bg-accent/15 text-accent"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
              {visible.length === 0 ? (
                <p className="py-6 text-center text-sm text-text-secondary">
                  Nothing posted yet. Announcements and changelog notes will
                  show up here.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {visible.map((notice) => (
                    <li
                      key={notice.id}
                      className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                          {KIND_LABEL[notice.kind]}
                        </span>
                        <span className="font-mono text-[9px] text-text-muted">
                          {notice.date}
                        </span>
                      </div>
                      <p className="mt-1 font-heading text-sm font-semibold text-text-primary">
                        {notice.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                        {notice.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
