// lib/simpleSyllabus.ts

export interface CachedSyllabus {
  // IDs / keys
  docCode: string; // "6iq1pjbyn"
  courseCode: string; // "MANA 3335"
  sectionNumber: string; // "25658"

  // Course info
  title: string; // "Introduction to Organizational Behavior and Management"
  termName: string; // "Spring 2026"

  // Instructor
  instructorFullName: string;
  instructorFirstName: string;
  instructorLastName: string;
  instructorEmail: string | null;

  // Dates (from properties.created / properties.modified for the course)
  createdAt: string | null;
  modifiedAt: string | null;
}

const SIMPLE_SYLLABUS_BASE = "https://uh.simplesyllabus.com";

/**
 * Normalize course codes so "mana  3335" === "MANA 3335" etc.
 */
function normalizeCourseCode(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toUpperCase();
}

/**
 * From "MANA 3335 25658" → { courseCode: "MANA 3335", sectionNumber: "25658" }
 */
function parseTitleForCourseAndSection(title: string): {
  courseCode: string;
  sectionNumber: string;
} {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 3) {
    return {
      courseCode: title.trim(),
      sectionNumber: "",
    };
  }

  const [subject, number, ...rest] = parts;
  const section = rest[0] ?? "";
  return {
    courseCode: `${subject} ${number}`,
    sectionNumber: section,
  };
}

/**
 * Hit the doc-library-search endpoint to get all syllabi for a given course code,
 * then for each result fetch the detailed doc info so we can extract dates + email.
 *
 * Results are normalized into CachedSyllabus objects.
 *
 * We rely on Next.js fetch caching with a 14-day revalidate window.
 */
export async function fetchSyllabiForCourse(
  rawCourseCode: string
): Promise<CachedSyllabus[]> {
  const normalizedRequested = normalizeCourseCode(rawCourseCode);

  const searchUrl = `${SIMPLE_SYLLABUS_BASE}/api2/doc-library-search?search=${encodeURIComponent(
    normalizedRequested
  )}`;

  const searchRes = await fetch(searchUrl, {
    // Cache the upstream response for 14 days
    next: { revalidate: 60 * 60 * 24 * 14 },
  });

  if (!searchRes.ok) {
    throw new Error(
      `Simple Syllabus search failed (${searchRes.status}) for ${normalizedRequested}`
    );
  }

  let searchJson: any;
  try {
    searchJson = await searchRes.json();
  } catch (err) {
    console.error("[SimpleSyllabus] Failed to parse search JSON", err);
    return [];
  }

  const items: any[] = searchJson.items ?? [];

  // Filter strictly to items that match the requested course code
  // based on the title "SUBJ 1234 12345"
  const matchingItems = items.filter((item) => {
    if (typeof item.title !== "string") return false;
    const { courseCode } = parseTitleForCourseAndSection(item.title);
    return normalizeCourseCode(courseCode) === normalizedRequested;
  });

  if (matchingItems.length === 0) {
    return [];
  }

  // For each matching item, fetch the detailed doc info (for email + dates).
  const detailPromises = matchingItems.map(async (item) => {
    const docCode: string = item.code;
    const title: string = item.title ?? "";
    const subtitle: string = item.subtitle ?? "";
    const termName: string = item.term_name ?? "";

    const { courseCode, sectionNumber } = parseTitleForCourseAndSection(title);

    // Basic instructor name info from search
    const searchEditor = item.editors?.[0];
    const instructorFullName: string = searchEditor?.full_name ?? "";
    const instructorFirstName: string = searchEditor?.first_name ?? "";
    const instructorLastName: string = searchEditor?.last_name ?? "";

    // Fetch doc details for this specific syllabus
    const docUrl = `${SIMPLE_SYLLABUS_BASE}/api2/doc?code=${encodeURIComponent(
      docCode
    )}`;

    const docRes = await fetch(docUrl, {
      next: { revalidate: 60 * 60 * 24 * 14 },
    });

    if (!docRes.ok) {
      // If detail fails, just return the info we already have from search
      return {
        docCode,
        courseCode,
        sectionNumber,
        title: subtitle || courseCode,
        termName,
        instructorFullName,
        instructorFirstName,
        instructorLastName,
        instructorEmail: null,
        createdAt: null,
        modifiedAt: null,
      } as CachedSyllabus;
    }

    let docJson: any;
    try {
      docJson = await docRes.json();
    } catch (err) {
      console.error(
        "[SimpleSyllabus] Failed to parse doc JSON for",
        docCode,
        err
      );
      return {
        docCode,
        courseCode,
        sectionNumber,
        title: subtitle || courseCode,
        termName,
        instructorFullName,
        instructorFirstName,
        instructorLastName,
        instructorEmail: null,
        createdAt: null,
        modifiedAt: null,
      } as CachedSyllabus;
    }

    const docItem = docJson.items?.[0];

    // Instructor email from detailed doc editors[0].accounts[0].email
    const detailEditor = docItem?.editors?.[0];
    const account = detailEditor?.accounts?.[0];
    const instructorEmail: string | null = account?.email ?? null;

    const properties = docItem?.properties ?? {};
    const createdAt: string | null = properties.created ?? null;
    const modifiedAt: string | null = properties.modified ?? null;

    return {
      docCode,
      courseCode,
      sectionNumber,
      title: subtitle || courseCode,
      termName,
      instructorFullName,
      instructorFirstName,
      instructorLastName,
      instructorEmail,
      createdAt,
      modifiedAt,
    } as CachedSyllabus;
  });

  const results = await Promise.all(detailPromises);

  // You can sort here if you want; right now we just return what we got.
  return results;
}
