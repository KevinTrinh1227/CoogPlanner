// app/search/page.tsx

const exampleCourses = [
  { code: "COSC 1336", title: "Programming Fundamentals" },
  { code: "COSC 2436", title: "Programming & Data Structures" },
  { code: "COSC 3320", title: "Algorithms and Data Structures" },
  { code: "COSC 3360", title: "Operating Systems" },
  { code: "COSC 3380", title: "Design File and Database Systems" },
].sort((a, b) => a.code.localeCompare(b.code));

const exampleInstructors = [
  { name: "Carlos Alberto Rincon Castro", dept: "Computer Science" },
  { name: "Jaspal Subhlok", dept: "Computer Science" },
  { name: "Shishir Shah", dept: "Computer Science" },
].sort((a, b) => a.name.localeCompare(b.name));

const examplePrograms = [
  { name: "Computer Science B.S.", college: "NSM" },
  { name: "Mechanical Engineering B.S.", college: "Engineering" },
  { name: "Psychology B.A.", college: "CLASS" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function SearchPage() {
  // For now this is just the "All" view.
  // Later you can read search params (e.g. ?type=courses) and filter.
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Browse UH academics
        </h1>
        <p className="text-xs text-slate-400">
          Use the search above to jump to any course, instructor, or degree
          program. Or explore the catalog below in alphabetical order.
        </p>

        {/* Local tabs (UI only for now) */}
        <div className="mt-3 inline-flex rounded-full border border-slate-800 bg-slate-950/80 p-1 text-[11px] text-slate-300">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-medium text-slate-50">
            All
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Courses
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Instructors
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Programs / Degrees
          </button>
        </div>
      </section>

      {/* Content grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Courses column */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              Courses
            </p>
            <p className="text-[11px] text-slate-500">Sample A–Z</p>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
            {exampleCourses.map((c) => (
              <li
                key={c.code}
                className="rounded-lg px-2 py-1.5 hover:bg-slate-900"
              >
                <p className="text-[12px] font-semibold text-slate-50">
                  {c.code}
                </p>
                <p className="text-[11px] text-slate-300">{c.title}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Page 1 / N</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Prev
              </button>
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Instructors column */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              Instructors
            </p>
            <p className="text-[11px] text-slate-500">Sample A–Z</p>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
            {exampleInstructors.map((i) => (
              <li
                key={i.name}
                className="rounded-lg px-2 py-1.5 hover:bg-slate-900"
              >
                <p className="text-[12px] font-semibold text-slate-50">
                  {i.name}
                </p>
                <p className="text-[11px] text-slate-300">{i.dept}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Page 1 / N</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Prev
              </button>
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Programs / Degrees column */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              Programs / Degrees
            </p>
            <p className="text-[11px] text-slate-500">Sample A–Z</p>
          </div>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
            {examplePrograms.map((p) => (
              <li
                key={p.name}
                className="rounded-lg px-2 py-1.5 hover:bg-slate-900"
              >
                <p className="text-[12px] font-semibold text-slate-50">
                  {p.name}
                </p>
                <p className="text-[11px] text-slate-300">{p.college}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Page 1 / N</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Prev
              </button>
              <button className="rounded-full border border-slate-800 px-2 py-0.5 text-slate-500 hover:border-slate-600 hover:text-slate-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Future: extra info/footer */}
      <section className="text-[11px] text-slate-500">
        <p>
          Later this page can pull real data from CougarGrades / catalogs,
          support full pagination, and switch views based on the route segment
          (e.g., <code className="text-slate-300">/search/courses</code>,{" "}
          <code className="text-slate-300">/search/instructors</code>, etc.).
        </p>
      </section>
    </div>
  );
}
