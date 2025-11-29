// app/api/simple-syllabus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchSyllabiForCourse } from "@/lib/simpleSyllabus";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseCode = searchParams.get("courseCode");

  if (!courseCode) {
    return NextResponse.json(
      { error: "Missing courseCode query parameter", syllabi: [] },
      { status: 400 }
    );
  }

  try {
    const syllabi = await fetchSyllabiForCourse(courseCode);

    // Always the same shape your client code expects:
    return NextResponse.json(
      {
        courseCode,
        syllabi,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching syllabi", err);
    // To keep your UI simple, you *can* still respond 200 with empty syllabi:
    return NextResponse.json(
      {
        courseCode,
        syllabi: [],
        error: "Failed to fetch syllabi from Simple Syllabus",
      },
      { status: 200 }
    );
  }
}
