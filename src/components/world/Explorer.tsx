import { motion } from "framer-motion";

interface ExplorerProps {
  x: number;
  y: number;
  facing: -1 | 1;
  moving: boolean;
}

export default function Explorer({ x, y, facing, moving }: ExplorerProps) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden
    >
      {/* Soft ground shadow */}
      <div className="absolute bottom-0 left-1/2 h-2 w-7 -translate-x-1/2 translate-y-1 rounded-full bg-accent/35 blur-[3px]" />

      <motion.div
        animate={{ y: moving ? [0, -3, 0] : [0, -1.5, 0] }}
        transition={{
          duration: moving ? 0.28 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ scaleX: facing }}
        className="relative flex w-8 flex-col items-center md:w-9"
      >
        {/* Head */}
        <div className="h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_12px_rgba(0,229,255,0.55)] md:h-4 md:w-4" />
        {/* Body */}
        <div className="mt-0.5 h-5 w-4 rounded-md bg-gradient-to-b from-accent to-cyan-700 md:h-6 md:w-[1.15rem]" />
        {/* Feet bob */}
        <div className="mt-0.5 flex w-full justify-between px-0.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-sm bg-accent/80"
            animate={moving ? { y: [0, 2, 0] } : { y: 0 }}
            transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-sm bg-accent/80"
            animate={moving ? { y: [0, 2, 0] } : { y: 0 }}
            transition={{
              duration: 0.28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.14,
            }}
          />
        </div>
      </motion.div>

      {/* You-are-here ring */}
      <motion.div
        className="absolute bottom-[-6px] left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border border-accent/30"
        animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.1, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
