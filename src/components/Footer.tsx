export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary/50 px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-text-muted">
          &copy; {year} Giovanny Garcia
        </p>
        <p className="font-mono text-xs text-text-muted">
          Built with React, Tailwind &amp; Godot 4.3
        </p>
      </div>
    </footer>
  );
}
