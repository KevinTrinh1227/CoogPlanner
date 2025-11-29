// lib/courses.ts

// Types for course data
export type DifficultyLabel = "Easy" | "Moderate" | "Hard";
export type TrendLabel = "Improving" | "Stable" | "Declining";

/**
 * Format a user-facing course code like "COSC 3320" from the internal code.
 *
 * Supports formats like:
 *  - "COSC-3320"
 *  - "COSC 3320"
 *  - "COSC3320" (fallback: no space inserted)
 */
export function getCourseDisplayCode(course: Course): string {
  const raw = course.code.trim();
  if (!raw) return "";

  // First try splitting on dash or whitespace, e.g. "COSC-3320" or "COSC 3320"
  const [subject, rest] = raw.split(/[\s-]+/, 2);
  if (rest) {
    return `${subject} ${rest}`;
  }

  // Fallback: if it's like "COSC3320", try to separate letters + digits
  const match = raw.match(/^([A-Za-z]+)(\d.*)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  // As a last resort, just return the raw code
  return raw;
}

export type CourseBadges = {
  gpa: number | null;
  dropRate: number | null; // percent
  difficultyLabel: DifficultyLabel;
  difficultyScore: number | null; // 1–5
  trend: TrendLabel;
};

export type CourseCatalogInfo = {
  creditHours: number | null;
  lectureHours: number | null;
  labHours: number | null;
  description: string;
  fulfills: string[];
  repeatability: string | null;
  tccnsEquivalent: string | null;
  additionalFee: string | null;
  prerequisites?: string | null;
};

export type CourseSnapshot = {
  avgGpa: number | null;
  dropRate: number | null;
  totalEnrolled: number | null;
  totalInstructors: number | null;
  totalSections: number | null;
  avgClassSize: number | null;
  // standard deviation for the course's GPA / grade distribution
  gpaStdDev: number | null;
};

export type GradeBucket = {
  label: string; // "A", "B", "C", "D", "F", "W", "S", "NR", etc.
  percentage: number; // 0–100
};

export type InstructorSummary = {
  name: string;
  summary: string; // e.g. "224 students · Avg GPA 2.70 · Drop 19%"
  department?: string | null;
  rating?: number | null;

  // Numeric fields for badges / stats
  totalStudents?: number | null;
  avgGpaNumeric?: number | null;
  dropRateNumeric?: number | null;

  // NEW: how many courses/sections this instructor has (for this context)
  courseCount?: number | null;
  sectionCount?: number | null;
};

export type SectionLetterBreakdown = {
  A: number | null;
  B: number | null;
  C: number | null;
  D: number | null;
  F: number | null;
  W: number | null;
  S?: number | null;
  NR?: number | null;
};

export type PastSection = {
  term: string; // e.g. "Spring 2025"
  instructor: string;
  section: string;
  enrolled: number | null;
  gpa: number | null;
  letters?: SectionLetterBreakdown;
};

export type Course = {
  code: string; // "COSC-3320"
  name: string;
  department: string;
  badges: CourseBadges;
  catalog: CourseCatalogInfo;
  snapshot: CourseSnapshot;
  gradeDistribution: GradeBucket[];
  instructors: InstructorSummary[];
  /**
   * Human-readable paragraph summarizing instructor history for this course.
   * For now this is placeholder text; later it can be generated from real data.
   */
  instructorNarrative: string;
  pastSections: PastSection[];
};

// Placeholder data (until real DB + cache are wired up)
const placeholderCourses: Course[] = [
  {
    code: "COSC-3320",
    name: "Algorithms and Data Structures",
    department: "Computer Science",
    badges: {
      gpa: 3.58,
      dropRate: 12, // percent
      difficultyLabel: "Easy",
      difficultyScore: 1.78, // 1–5
      trend: "Declining",
    },
    catalog: {
      creditHours: 3,
      lectureHours: 3,
      labHours: 0,
      prerequisites:
        "A grade of C- or better in COSC 1437 and MATH 2305, and concurrent enrollment in or credit for MATH 2414 with a grade of C- or better.",
      description:
        "COSC 3320 covers fundamental algorithms and data structures such as lists, trees, graphs, and hashing, with an emphasis on runtime analysis and practical implementation in modern languages.",
      fulfills: [
        "B.S. Computer Science · Major requirement",
        "Algorithm & data structures core block",
      ],
      repeatability: "No",
      tccnsEquivalent: "COSC 2436",
      additionalFee: "No",
    },
    snapshot: {
      avgGpa: 3.0,
      dropRate: 12,
      totalEnrolled: 4684,
      totalInstructors: 9,
      totalSections: 48,
      avgClassSize: 97,
      gpaStdDev: 0.45,
    },
    gradeDistribution: [
      { label: "A", percentage: 29 },
      { label: "B", percentage: 35 },
      { label: "C", percentage: 16 },
      { label: "D", percentage: 3 },
      { label: "F", percentage: 2 },
      { label: "W", percentage: 12 },
      { label: "Other", percentage: 3 },
    ],
    instructors: [
      {
        name: "Carlos Ordonez",
        summary: "224 students · Avg GPA 2.70 · Drop 19%",
      },
      {
        name: "Gopal Pandurangan",
        summary: "770 students · Avg GPA 2.74 · Drop 15%",
      },
      {
        name: "Khalid Maen Hourani",
        summary: "192 students · Avg GPA 3.21 · Drop 5%",
      },
      {
        name: "Panruo Wu",
        summary: "615 students · Avg GPA 2.91 · Drop 7%",
      },
      {
        name: "Uma Ramamurthy",
        summary: "45 students · Avg GPA 2.86 · Drop 20%",
      },
      {
        name: "Ernst L Leiss",
        summary: "2,071 students · Avg GPA 3.26 · Drop 8%",
      },
      {
        name: "Kam-Hoi Cheng",
        summary: "37 students · Avg GPA 2.86 · Drop 43%",
      },
      {
        name: "Michele Scquizzato",
        summary: "222 students · Avg GPA 2.85 · Drop 6%",
      },
      {
        name: "Rakesh M Verma",
        summary: "508 students · Avg GPA 2.41 · Drop 27%",
      },
    ],
    instructorNarrative:
      "Over the years, COSC 3320 has been taught by a small group of core instructors, including Carlos Ordonez, Gopal Pandurangan, Ernst L Leiss, Panruo Wu, and others. Each instructor brings a slightly different emphasis to the course—some sections lean more theoretical, while others are more implementation-focused. Historical grade data shows a wide range of outcomes: instructors like Ernst L Leiss and Khalid Maen Hourani tend to post higher average GPAs with moderate drop rates, while others may be more challenging but still very highly regarded. Use the instructor list above, along with GPA and drop-rate summaries, to decide which teaching style best fits how you like to learn algorithms.",
    pastSections: [
      {
        term: "Spring 2025",
        instructor: "Carlos Ordonez",
        section: "1",
        enrolled: 143,
        gpa: 2.72,
        letters: {
          A: 30,
          B: 45,
          C: 32,
          D: 12,
          F: 8,
          W: 16,
        },
      },
      {
        term: "Spring 2025",
        instructor: "Gopal Pandurangan",
        section: "4",
        enrolled: 148,
        gpa: 2.83,
        letters: {
          A: 38,
          B: 52,
          C: 30,
          D: 10,
          F: 5,
          W: 13,
        },
      },
      {
        term: "Fall 2024",
        instructor: "Ernst L Leiss",
        section: "1",
        enrolled: 263,
        gpa: 3.46,
        letters: {
          A: 110,
          B: 90,
          C: 35,
          D: 8,
          F: 5,
          W: 15,
        },
      },
      {
        term: "Fall 2024",
        instructor: "Panruo Wu",
        section: "702",
        enrolled: 99,
        gpa: 2.76,
        letters: {
          A: 22,
          B: 32,
          C: 20,
          D: 8,
          F: 5,
          W: 12,
        },
      },
    ],
  },
];

// In-memory cache placeholder (later: swap for Redis / KV / DB lookups)
const courseCache = new Map<string, Course>();

type CourseSource = "cache" | "database" | "placeholder";

export type CourseResult = {
  course: Course | null;
  source: CourseSource;
};

/**
 * Simulated cache lookup.
 * Later you can replace this with Redis / Next cache / etc.
 */
async function getCourseFromCache(code: string): Promise<Course | null> {
  const key = code.toUpperCase();
  return courseCache.get(key) ?? null;
}

/**
 * Simulated DB lookup.
 * Right now this just searches the placeholderCourses array.
 * Later: replace with real DB query.
 */
async function getCourseFromDatabase(code: string): Promise<Course | null> {
  const normalized = code.toUpperCase();
  const match =
    placeholderCourses.find((c) => c.code.toUpperCase() === normalized) ?? null;
  return match;
}

/**
 * Write-through to the in-memory cache.
 * Later you can mirror this to your real cache layer.
 */
async function saveCourseToCache(course: Course): Promise<void> {
  courseCache.set(course.code.toUpperCase(), course);
}

/**
 * Get a single course by code.
 *
 * Order:
 *  1. Try cache
 *  2. Try DB (currently placeholder array)
 *  3. Fallback to null
 */
export async function getCourseByCode(code: string): Promise<CourseResult> {
  // 1) cache
  const cached = await getCourseFromCache(code);
  if (cached) {
    return { course: cached, source: "cache" };
  }

  // 2) DB (for now: placeholderCourses)
  const fromDb = await getCourseFromDatabase(code);
  if (fromDb) {
    // pretend we're populating cache
    await saveCourseToCache(fromDb);
    return { course: fromDb, source: "database" };
  }

  // 3) no match
  return { course: null, source: "placeholder" };
}

/**
 * List all courses (for now just the placeholderCourses array).
 * Later: page through your DB.
 */
export async function getAllCourses(): Promise<Course[]> {
  // could also hydrate cache here if you want
  return placeholderCourses;
}

/**
 * Simple search helper by code or name.
 * Very basic for now, just for MVP UX.
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const q = query.trim().toLowerCase();
  if (!q) return placeholderCourses;

  return placeholderCourses.filter((course) => {
    const codeMatch = course.code.toLowerCase().includes(q);
    const nameMatch = course.name.toLowerCase().includes(q);
    const deptMatch = course.department.toLowerCase().includes(q);
    return codeMatch || nameMatch || deptMatch;
  });
}
