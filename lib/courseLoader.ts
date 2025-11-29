// lib/courseLoader.ts
"use server";

import type {
  Course,
  CourseBadges,
  CourseCatalogInfo,
  CourseSnapshot,
  GradeBucket,
  InstructorSummary,
  PastSection,
  SectionLetterBreakdown,
  TrendLabel,
} from "@/lib/courses";
import { getCourseDisplayCode } from "@/lib/courses";
import { getSupabaseServerClient } from "./supabaseServer";

// --- helpers --------------------------------------------------------

function parseCourseCode(rawCode: string): { subject: string; number: string } {
  const decoded = decodeURIComponent(rawCode).trim().toUpperCase();

  // Try SUBJECT-1234 or SUBJECT 1234
  const parts = decoded.split(/[\s-]+/);
  if (parts.length >= 2) {
    return { subject: parts[0], number: parts[1] };
  }

  // Fallback: COSC3320 -> COSC / 3320
  const match = decoded.match(/^([A-Z]+)(\d+)$/);
  if (match) {
    return { subject: match[1], number: match[2] };
  }

  // Last resort
  return { subject: decoded, number: "" };
}

function safeNumber(value: number | null | undefined): number {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return Number(value);
}

function buildGradeBucketsFromDifficulty(row: any | null): GradeBucket[] {
  if (!row) return [];

  const a = safeNumber(row.a_count);
  const b = safeNumber(row.b_count);
  const c = safeNumber(row.c_count);
  const d = safeNumber(row.d_count);
  const f = safeNumber(row.f_count);
  const s = safeNumber(row.s_count);
  const nr = safeNumber(row.nr_count);
  const w = safeNumber(row.dropped_count);

  const total = a + b + c + d + f + s + nr + w;
  if (total <= 0) return [];

  const toPct = (count: number) => (count / total) * 100;

  const buckets: GradeBucket[] = [
    { label: "A", percentage: toPct(a) },
    { label: "B", percentage: toPct(b) },
    { label: "C", percentage: toPct(c) },
    { label: "D", percentage: toPct(d) },
    { label: "F", percentage: toPct(f) },
    { label: "W", percentage: toPct(w) },
    { label: "S", percentage: toPct(s) },
    { label: "NR", percentage: toPct(nr) },
  ];

  return buckets;
}

function buildSnapshotFromDifficulty(
  row: any | null,
  totalInstructors: number | null,
  totalSectionsFallback: number | null
): CourseSnapshot {
  if (!row) {
    return {
      avgGpa: null,
      dropRate: null,
      totalEnrolled: null,
      totalInstructors,
      totalSections: totalSectionsFallback,
      avgClassSize: null,
      gpaStdDev: null,
    };
  }

  const totalEnrollment = safeNumber(row.total_enrollment);
  const graded = safeNumber(row.graded_count);
  const dropped = safeNumber(row.dropped_count);
  const denom = graded + dropped || totalEnrollment;

  const dropRate =
    denom > 0 ? (dropped / denom) * 100 : row.withdraw_rate ?? null;

  const sectionCount = safeNumber(row.section_count) || totalSectionsFallback;

  const avgClassSize =
    sectionCount && totalEnrollment
      ? totalEnrollment / sectionCount
      : sectionCount
      ? null
      : null;

  return {
    avgGpa: row.avg_gpa != null ? Number(row.avg_gpa) : null,
    dropRate: dropRate != null ? Number(dropRate) : null,
    totalEnrolled: totalEnrollment || null,
    totalInstructors,
    totalSections: sectionCount || null,
    avgClassSize,
    gpaStdDev: null, // can compute later from per-term GPAs if you want
  };
}

// --- UPDATED: difficultyLabel comes straight from DB, no fallback text ---
function buildBadgesFromDifficulty(
  row: any | null,
  snapshot: CourseSnapshot
): CourseBadges {
  const gpa =
    snapshot.avgGpa != null
      ? snapshot.avgGpa
      : row?.avg_gpa != null
      ? Number(row.avg_gpa)
      : null;

  const dropRate =
    snapshot.dropRate != null
      ? snapshot.dropRate
      : row?.withdraw_rate != null
      ? Number(row.withdraw_rate)
      : null;

  const difficultyScore =
    row?.difficulty_score != null ? Number(row.difficulty_score) : null;

  // If difficulty_label exists in DB, use it as-is (e.g., "Very Easy", "Easy", "Hard", "Very Hard").
  // If it's missing/empty, we leave it as null so the UI component can decide what to show.
  const rawLabel =
    typeof row?.difficulty_label === "string"
      ? row.difficulty_label.trim()
      : "";

  const difficultyLabel = rawLabel.length > 0 ? rawLabel : null; // <- no automatic label fallback

  const trend: TrendLabel = "Stable"; // placeholder until you compute real trend

  return {
    gpa,
    dropRate,
    difficultyLabel: difficultyLabel as any, // allow null / custom strings; UI will handle
    difficultyScore,
    trend,
  };
}

function buildPastSections(rows: any[]): PastSection[] {
  return rows.map((row) => {
    const a = safeNumber(row.a_count);
    const b = safeNumber(row.b_count);
    const c = safeNumber(row.c_count);
    const d = safeNumber(row.d_count);
    const f = safeNumber(row.f_count);
    const s = safeNumber(row.satisfactory_count);
    const nr = safeNumber(row.not_reported_count);
    const w = safeNumber(row.total_dropped);

    // Total enrolled = all grade outcomes + withdrawals
    const totalEnrolled = a + b + c + d + f + s + nr + w;

    const letters: SectionLetterBreakdown = {
      A: a,
      B: b,
      C: c,
      D: d,
      F: f,
      W: w,
      S: s,
      NR: nr,
    };

    const first = (row.instr_first_name || "").trim();
    const last = (row.instr_last_name || "").trim();
    const instructorName =
      (first || last) && `${first} ${last}`.trim().length > 0
        ? `${first} ${last}`.trim()
        : "Unknown";

    return {
      term: row.term ?? "Unknown term",
      instructor: instructorName,
      section: row.class_section ?? "",
      enrolled: totalEnrolled, // always a number (0+)
      gpa: row.avg_gpa != null ? Number(row.avg_gpa) : 0, // default to 0 instead of null
      letters,
    };
  });
}

function buildInstructorSummaries(rows: any[]): InstructorSummary[] {
  type Agg = {
    students: number;
    gpaWeightedSum: number;
    drops: number;
    subject: string | null;
    courses: Set<string>;
    sections: number;
  };

  const byName = new Map<string, Agg>();

  for (const row of rows) {
    const first = (row.instr_first_name || "").trim();
    const last = (row.instr_last_name || "").trim();
    const name =
      (first || last) && `${first} ${last}`.trim().length > 0
        ? `${first} ${last}`.trim()
        : "Unknown";

    const a = safeNumber(row.a_count);
    const b = safeNumber(row.b_count);
    const c = safeNumber(row.c_count);
    const d = safeNumber(row.d_count);
    const f = safeNumber(row.f_count);
    const s = safeNumber(row.satisfactory_count);
    const nr = safeNumber(row.not_reported_count);
    const w = safeNumber(row.total_dropped);

    const graded = a + b + c + d + f + s + nr;
    const total = graded + w;
    const gpa = row.avg_gpa != null ? Number(row.avg_gpa) : null;

    if (!byName.has(name)) {
      byName.set(name, {
        students: 0,
        gpaWeightedSum: 0,
        drops: 0,
        subject: row.subject ?? null,
        courses: new Set<string>(),
        sections: 0,
      });
    }
    const agg = byName.get(name)!;

    // Track how many distinct courses & sections this instructor has
    const courseKey = `${row.subject ?? ""}-${row.catalog_nbr ?? ""}`;
    agg.courses.add(courseKey);
    agg.sections += 1;

    agg.students += total;
    agg.drops += w;
    if (gpa != null && total > 0) {
      agg.gpaWeightedSum += gpa * total;
    }
  }

  const summaries: InstructorSummary[] = [];

  for (const [name, agg] of byName.entries()) {
    const avgGpa =
      agg.students > 0 && agg.gpaWeightedSum > 0
        ? agg.gpaWeightedSum / agg.students
        : null;
    const dropRate = agg.students > 0 ? (agg.drops / agg.students) * 100 : null;

    const parts: string[] = [];
    parts.push(`${agg.students.toLocaleString()} students`);
    parts.push(`Avg GPA ${avgGpa != null ? avgGpa.toFixed(2) : "–"}`);
    parts.push(`Drop ${dropRate != null ? `${dropRate.toFixed(0)}%` : "–"}`);

    summaries.push({
      name,
      summary: parts.join(" · "),
      department: agg.subject ?? null,
      rating: null, // placeholder for future RateMyProf / etc

      totalStudents: agg.students || null,
      avgGpaNumeric: avgGpa,
      dropRateNumeric: dropRate,
      courseCount: agg.courses.size || null,
      sectionCount: agg.sections || null,
    });
  }

  // Sort by number of students descending
  summaries.sort((a, b) => {
    const aStudents = parseInt(a.summary.split(" ")[0].replace(/,/g, "")) || 0;
    const bStudents = parseInt(b.summary.split(" ")[0].replace(/,/g, "")) || 0;
    return bStudents - aStudents;
  });

  return summaries;
}

function buildInstructorNarrative(
  courseCode: string,
  courseName: string,
  instructors: InstructorSummary[]
): string {
  if (!instructors.length) {
    return `Historically, ${courseCode} – ${courseName} has been taught by a small set of instructors. As more data is added, CoogPlanner will summarize which instructors tend to have higher GPAs, lower drop rates, and which sections best match your learning style.`;
  }

  const names = instructors.slice(0, 4).map((i) => i.name);
  const firstFew =
    names.length === 1
      ? names[0]
      : names.length === 2
      ? names.join(" and ")
      : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;

  return `Over the years, ${courseCode} – ${courseName} has been taught by instructors like ${firstFew}. Historical grade data shows a wide range of outcomes across different teaching styles. Use the instructor list above, along with GPA and drop-rate summaries, to decide which sections best fit how you like to learn.`;
}

// --- main loader ----------------------------------------------------

export async function getCourseByCodeFromDb(
  rawCode: string
): Promise<Course | null> {
  const { subject, number } = parseCourseCode(rawCode);
  const supabase = getSupabaseServerClient();

  // 1) course_difficulty (aggregated metrics)
  const { data: difficultyRow, error: diffError } = await supabase
    .from("course_difficulty")
    .select("*")
    .eq("subject", subject)
    .eq("number", number)
    .maybeSingle();

  if (diffError) {
    console.error("Error fetching course_difficulty:", diffError.message);
  }

  // 2) latest catalog details
  const { data: catalogRows, error: catalogError } = await supabase
    .from("course_publication_details")
    .select("*")
    .eq("subject", subject)
    .eq("number", number)
    .order("catalog_year", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1);

  if (catalogError) {
    console.error(
      "Error fetching course_publication_details:",
      catalogError.message
    );
  }

  const catalogRow = catalogRows?.[0] ?? null;

  // 3) all grade distribution rows for this course
  const { data: gradeRows, error: gradeError } = await supabase
    .from("course_grade_distributions")
    .select("*")
    .eq("subject", subject)
    .eq("catalog_nbr", number);

  if (gradeError) {
    console.error(
      "Error fetching course_grade_distributions:",
      gradeError.message
    );
  }

  const rows = gradeRows ?? [];

  // If we literally have nothing, bail
  if (!difficultyRow && !catalogRow && rows.length === 0) {
    return null;
  }

  // Build parts
  const displayCode = difficultyRow?.course_code
    ? String(difficultyRow.course_code)
    : `${subject}-${number}`;

  const nameFromDiff = difficultyRow?.course_title;
  const nameFromCatalog = catalogRow?.title;
  const nameFromGrades = rows[0]?.course_descr;

  const courseName =
    nameFromCatalog || nameFromDiff || nameFromGrades || "Unknown course title";

  const instructors = buildInstructorSummaries(rows);
  const pastSections = buildPastSections(rows);

  const totalInstructors =
    instructors.length > 0
      ? instructors.length
      : difficultyRow?.term_count ?? null;

  const snapshot = buildSnapshotFromDifficulty(
    difficultyRow,
    totalInstructors,
    rows.length || null
  );

  const badges = buildBadgesFromDifficulty(difficultyRow, snapshot);
  const gradeDistribution = buildGradeBucketsFromDifficulty(difficultyRow);

  const catalog: CourseCatalogInfo = {
    creditHours:
      catalogRow?.credit_hours != null ? Number(catalogRow.credit_hours) : null,
    lectureHours:
      catalogRow?.lecture_contact != null
        ? Number(catalogRow.lecture_contact)
        : null,
    labHours:
      catalogRow?.lab_contact != null ? Number(catalogRow.lab_contact) : null,
    description: catalogRow?.description ?? nameFromGrades ?? courseName,
    fulfills: [], // to be filled from a future requirements table
    repeatability: catalogRow?.repeatability ?? null,
    tccnsEquivalent: null,
    additionalFee: catalogRow?.additional_fee ?? null,
    prerequisites: catalogRow?.prerequisites ?? null,
  };

  const instructorNarrative = buildInstructorNarrative(
    getCourseDisplayCode({ code: displayCode } as Course),
    courseName,
    instructors
  );

  const course: Course = {
    code: displayCode,
    name: courseName,
    department: subject, // you can prettify later (e.g., map COSC -> "Computer Science")
    badges,
    catalog,
    snapshot,
    gradeDistribution,
    instructors,
    instructorNarrative,
    pastSections,
  };

  return course;
}
