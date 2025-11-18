export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-4 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Coog Planner.</p>
        <p className="text-[10px] text-slate-600">
          Built by UH students. Not affiliated with the University of Houston,
          myUH, CASA, or UH Systems.
        </p>
      </div>
    </footer>
  );
}
