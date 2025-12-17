// lib/courseSearchIndex.ts
import courseIndexJson from "@/data/courseSearchIndex.json";

// Shape of one course entry in your JSON
export type CourseSearchEntry = {
  slug: string; // e.g. "COSC-3320"
  courseCode: string; // e.g. "COSC 3320"
  courseTitle: string; // e.g. "Algorithms and Data Structures"
  courseContext?: string | null; // optional catalog-style blurb
};

// Strongly-typed in-memory index
export const courseSearchIndex: CourseSearchEntry[] =
  courseIndexJson as CourseSearchEntry[];
