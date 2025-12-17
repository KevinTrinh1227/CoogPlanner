"use client";

import { useState, type ChangeEvent } from "react";

type CourseStatus = "completed" | "in-progress";

type CourseRow = {
  id: string;
  code: string;
  title: string;
  term: string;
  credits: string;
  grade: string;
  status: CourseStatus;
};

const initialCourses: CourseRow[] = [
  {
    id: "1",
    code: "MATH 2413",
    title: "Calculus I",
    term: "Fall 2023",
    credits: "4",
    grade: "A",
    status: "completed",
  },
  {
    id: "2",
    code: "COSC 1336",
    title: "Programming Fundamentals",
    term: "Fall 2023",
    credits: "3",
    grade: "A-",
    status: "completed",
  },
  {
    id: "3",
    code: "MATH 2414",
    title: "Calculus II",
    term: "Spring 2024",
    credits: "4",
    grade: "IP",
    status: "in-progress",
  },
];

const degreeOptions = [
  "",
  "B.S. Computer Science",
  "B.S. Mechanical Engineering",
  "B.S. Electrical Engineering",
  "B.B.A. Finance",
  "B.S. Biology (Pre-Med)",
  "Exploring / Undecided",
];

const remainingSemesterOptions = Array.from({ length: 20 }, (_, i) =>
  String(i + 1)
);

function getCurrentTermLabel(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const season = month >= 6 ? "Fall" : "Spring";
  return `${season} ${year}`;
}

function getProjectedGraduationLabel(
  remainingSemesters: string
): string | null {
  const n = parseInt(remainingSemesters, 10);
  if (!Number.isFinite(n) || n <= 0) return null;

  const now = new Date();
  let year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // Rough model: Spring / Fall semesters
  const seasons = ["Spring", "Fall"];
  let index = month >= 6 ? 1 : 0; // before July -> Spring, after -> Fall

  const steps = n - 1;
  index += steps;
  year += Math.floor(index / 2);
  const season = seasons[index % 2];

  return `${season} ${year}`;
}

export default function MyDegreeClient() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [remainingSemesters, setRemainingSemesters] = useState<string>("4");

  const completedCourses = courses.filter(
    (course) => course.status === "completed"
  );
  const inProgressCourses = courses.filter(
    (course) => course.status === "in-progress"
  );

  const currentTermLabel = getCurrentTermLabel();
  const projectedGraduation = getProjectedGraduationLabel(remainingSemesters);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFileName(null);
      return;
    }
    setSelectedFileName(file.name);

    // TODO: Wire this up to backend / worker that parses PDF + updates courses.
    console.log("Selected transcript file:", file);
  };

  const updateCourseField = (
    id: string,
    field: keyof CourseRow,
    value: string
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const addCourse = (status: CourseStatus) => {
    const newCourse: CourseRow = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      code: "",
      title: "",
      term: "",
      credits: "",
      grade: status === "completed" ? "" : "IP",
      status,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleAnalyze = () => {
    console.log("Analyze clicked:", {
      selectedDegree,
      remainingSemesters,
      courses,
    });
    alert(
      "Analysis is not wired up yet.\n\nOnce backend is ready, this will compare your courses to your degree requirements and suggest what to take next."
    );
  };

  return (
    <div className="flex flex-col gap-14">
      {/* 1. Transcript upload */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          1. Upload Your Unofficial Transcript (PDF)
        </h2>

        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-6 sm:px-6 sm:py-8">
          <label
            htmlFor="transcript-upload"
            className="flex cursor-pointer flex-col items-center gap-4 text-center"
          >
            <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/80">
              <span aria-hidden className="text-2xl">
                📄
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-100">
                Drop your PDF here or click to browse
              </p>
              <p className="text-xs text-slate-400">
                We currently support <span className="font-semibold">PDF</span>{" "}
                only. Parsing happens securely client-side in this prototype.
              </p>
              <p className="text-xs text-slate-400">
                Selected file:{" "}
                <span className="font-medium text-slate-200">
                  {selectedFileName ?? "None yet"}
                </span>
              </p>
            </div>
            <input
              id="transcript-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Tip: For best results later, export the PDF directly from
          myUH/PeopleSoft without printing or scanning.
        </p>
      </section>

      {/* 2. Degree + graduation target */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          2. Select Your Degree & Target Graduation
        </h2>
        <p className="text-sm text-slate-300">
          Choose your degree so we can match against the right requirements, and
          tell us roughly how many more semesters you want to take before
          graduating.
        </p>

        <div className="max-w-xl space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="degree-select"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Degree / Program
              </label>
              <select
                id="degree-select"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
              >
                {degreeOptions.map((option) => (
                  <option key={option || "none"} value={option}>
                    {option || "Select a degree"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="remaining-semesters"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Semesters Remaining
              </label>
              <select
                id="remaining-semesters"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
                value={remainingSemesters}
                onChange={(e) => setRemainingSemesters(e.target.value)}
              >
                {remainingSemesterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Current term (estimate):{" "}
            <span className="font-semibold text-slate-100">
              {currentTermLabel}
            </span>{" "}
            • Projected graduation:{" "}
            {projectedGraduation ? (
              <span className="font-semibold text-slate-100">
                {projectedGraduation}
              </span>
            ) : (
              <span className="text-slate-500">
                Choose remaining semesters to see an estimate.
              </span>
            )}
          </p>
        </div>
      </section>

      {/* 3. Courses lists */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          3. Review and Edit Your Courses
        </h2>
        <p className="text-sm text-slate-300">
          These are the courses we&apos;ll use when analyzing your degree. You
          can edit anything, remove mistakes, or add missing classes manually.
        </p>

        <div className="flex flex-col gap-6">
          {/* Completed */}
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-emerald-300">
                Completed Courses
              </h3>
              <button
                type="button"
                onClick={() => addCourse("completed")}
                className="inline-flex items-center gap-1 self-start rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-400/80 hover:text-emerald-200 hover:shadow-md focus-visible:self-auto focus-visible:outline-none focus-visible:ring focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:self-auto"
              >
                <span aria-hidden>➕</span>
                <span>Add completed</span>
              </button>
            </div>

            <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {completedCourses.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No completed courses yet. Add them manually or upload a
                  transcript.
                </p>
              ) : (
                completedCourses.map((course) => (
                  <CourseRowCard
                    key={course.id}
                    course={course}
                    onChange={updateCourseField}
                    onRemove={removeCourse}
                  />
                ))
              )}
            </div>
          </div>

          {/* In-progress */}
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-sky-300">
                In-Progress / Current Term
              </h3>
              <button
                type="button"
                onClick={() => addCourse("in-progress")}
                className="inline-flex items-center gap-1 self-start rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-sky-400/80 hover:text-sky-200 hover:shadow-md focus-visible:self-auto focus-visible:outline-none focus-visible:ring focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:self-auto"
              >
                <span aria-hidden>➕</span>
                <span>Add in-progress</span>
              </button>
            </div>

            <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {inProgressCourses.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No in-progress courses yet. Add what you&apos;re currently
                  taking so we can factor them into your plan.
                </p>
              ) : (
                inProgressCourses.map((course) => (
                  <CourseRowCard
                    key={course.id}
                    course={course}
                    onChange={updateCourseField}
                    onRemove={removeCourse}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Analysis */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          4. Run Degree Analysis & Requirement Suggestions
        </h2>

        <p className="text-sm text-slate-300">
          Run an analysis to see what requirements you have left and which
          courses are good next options based on what you have already taken.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 rounded-xl bg-red-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-red-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
          >
            <span aria-hidden>🚀</span>
            <span>Get My Personal Analysis</span>
          </button>
        </div>
      </section>
    </div>
  );
}

type CourseRowCardProps = {
  course: CourseRow;
  onChange: (id: string, field: keyof CourseRow, value: string) => void;
  onRemove: (id: string) => void;
};

function CourseRowCard({ course, onChange, onRemove }: CourseRowCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-100 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input
            type="text"
            className="w-24 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 font-mono text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            placeholder="COSC 1336"
            value={course.code}
            onChange={(e) => onChange(course.id, "code", e.target.value)}
          />
          <input
            type="text"
            className="min-w-[8rem] flex-1 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            placeholder="Course title"
            value={course.title}
            onChange={(e) => onChange(course.id, "title", e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => onRemove(course.id)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-[0.7rem] font-medium text-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:border-red-400/80 hover:text-red-200 hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <span aria-hidden>✕</span>
          <span>Remove</span>
        </button>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-4">
        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
            Term
          </p>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            placeholder="e.g. Fall 2023"
            value={course.term}
            onChange={(e) => onChange(course.id, "term", e.target.value)}
          />
        </div>

        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
            Credits
          </p>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            placeholder="3"
            value={course.credits}
            onChange={(e) => onChange(course.id, "credits", e.target.value)}
          />
        </div>

        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
            Grade
          </p>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            placeholder={course.status === "in-progress" ? "IP" : "A"}
            value={course.grade}
            onChange={(e) => onChange(course.id, "grade", e.target.value)}
          />
        </div>

        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
            Status
          </p>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[0.7rem] text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
            value={course.status}
            onChange={(e) =>
              onChange(course.id, "status", e.target.value as CourseStatus)
            }
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
          </select>
        </div>
      </div>
    </div>
  );
}
