// components/course/syllabusClientCache.ts
"use client";

type AnySyllabus = any[];

const syllabusCache = new Map<string, AnySyllabus>();

export function setSyllabiForCourse(code: string, syllabi: AnySyllabus) {
  // normalize key so "MATH 3339" and "math 3339" share cache
  syllabusCache.set(code.trim().toUpperCase(), syllabi);
}

export function getSyllabiForCourse(code: string): AnySyllabus | null {
  return syllabusCache.get(code.trim().toUpperCase()) ?? null;
}
