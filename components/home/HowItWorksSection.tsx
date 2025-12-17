// components/home/HowItWorksSection.tsx
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50">
        What Coog Planner helps you decide
      </h2>
      <ul className="space-y-2 text-[12px] text-slate-300">
        <li>
          • Which classes can satisfy each remaining requirement, ranked by
          difficulty, time of day, and how well they fit your schedule.
        </li>
        <li>
          • How to balance “hard” and “easy” courses each term so you can work
          your job, stay sane, and still move toward graduation.
        </li>
        <li>
          • The impact of each plan on your estimated GPA and graduation
          semester as you drag courses between terms.
        </li>
      </ul>
    </section>
  );
}
