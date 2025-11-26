// app/dashboard/page.tsx

import React from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import DegreeProgressCard from "@/components/dashboard/DegreeProgressCard";
import SemesterCoursesCard from "@/components/dashboard/SemesterCoursesCard";
import ProfileOverviewCard from "@/components/dashboard/ProfileOverviewCard";

export default function DashboardPage() {
  const studentName = "Kevin";
  const degreeName = "B.S. in Computer Science";
  const catalogYear = "2023–2024";
  const classification = "Junior";
  const classificationYearLabel = "1st yr"; // placeholder
  const onTrackTerm = "Spring 2027";

  // College abbreviation instead of full name
  const collegeAbbr = "NSM"; // College of Natural Sciences & Mathematics

  const degreeProgress = {
    totalCredits: 120,
    completedCredits: 78,
    currentGpa: 3.42,
    buckets: [
      { label: "Core Requirements", completed: 36, total: 50 },
      { label: "Major Requirements", completed: 30, total: 50 },
      { label: "Electives", completed: 12, total: 20 },
    ],
  };

  const currentTerm = "Fall 2025";
  const currentCourses = [
    {
      code: "COSC 3320",
      title: "Algorithms and Data Structures",
      credits: 3,
      location: "TTH 1:00–2:30 PM · Online",
      instructor: "Dr. Smith",
    },
    {
      code: "COSC 3380",
      title: "Database Systems",
      credits: 3,
      location: "MW 11:30–1:00 PM · PGH 232",
      instructor: "Dr. Nguyen",
    },
    {
      code: "MATH 2415",
      title: "Calculus III",
      credits: 4,
      location: "MWF 9:00–9:50 AM · SEC 104",
      instructor: "Prof. Lee",
    },
    {
      code: "POLS 1337",
      title: "U.S. Government",
      credits: 3,
      location: "TTH 3:00–4:30 PM · AH 202",
      instructor: "Dr. Gonzalez",
    },
  ];

  const completedCourses = [
    {
      term: "Spring 2025",
      code: "COSC 2436",
      title: "Programming and Data Structures",
      credits: 3,
      grade: "A",
      instructor: "Dr. Patel",
    },
    {
      term: "Spring 2025",
      code: "MATH 2414",
      title: "Calculus II",
      credits: 4,
      grade: "B+",
      instructor: "Dr. Chen",
    },
    {
      term: "Fall 2024",
      code: "COSC 1410",
      title: "Introduction to Programming",
      credits: 4,
      grade: "A",
      instructor: "Dr. Johnson",
    },
    {
      term: "Fall 2024",
      code: "ENGL 1304",
      title: "First Year Writing II",
      credits: 3,
      grade: "A-",
      instructor: "Prof. Davis",
    },
    {
      term: "Spring 2024",
      code: "HIST 1377",
      title: "The United States to 1877",
      credits: 3,
      grade: "B",
      instructor: "Dr. Martinez",
    },
  ];

  const currentCredits = currentCourses.reduce((sum, c) => sum + c.credits, 0);

  const requirementsRemaining = 18;
  const totalRequirements = 40;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 scroll-smooth lg:py-14">
      {/* Breadcrumb: Home / Dashboard */}
      <PageBreadcrumb
        crumbs={[{ label: "Dashboard" }]}
        className="mb-3"
        showStarAndCart={false}
        isSignedIn={true}
      />

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left side: heading + program line */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
            Welcome, {studentName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {collegeAbbr} · {degreeName} · {classification} · GPA{" "}
            {degreeProgress.currentGpa.toFixed(2)}
          </p>
        </div>

        {/* Right side: estimated + target grad term text */}
        <div className="mt-2 flex flex-col items-start gap-1.5 text-sm text-slate-300 md:items-end">
          <span className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Estimated Grad Term: {onTrackTerm}
          </span>
          <span className="text-xs text-slate-500">
            Target Grad Term: {onTrackTerm}
          </span>
        </div>
      </div>

      {/* Academic Overview card */}
      <ProfileOverviewCard
        studentName={studentName}
        degreeName={degreeName}
        classification={classification}
        classificationYearLabel={classificationYearLabel}
        catalogYear={catalogYear}
        onTrackTerm={onTrackTerm}
        completedCredits={degreeProgress.completedCredits}
        totalCredits={degreeProgress.totalCredits}
        currentGpa={degreeProgress.currentGpa}
        currentTerm={currentTerm}
        currentCredits={currentCredits}
        requirementsRemaining={requirementsRemaining}
        totalRequirements={totalRequirements}
      />

      {/* Degree Progress */}
      <DegreeProgressCard
        degreeName={degreeName}
        classification={classification}
        completedCredits={degreeProgress.completedCredits}
        totalCredits={degreeProgress.totalCredits}
        currentGpa={degreeProgress.currentGpa}
        buckets={degreeProgress.buckets}
      />

      {/* Current / Completed courses – combined component, full row */}
      <SemesterCoursesCard
        currentTerm={currentTerm}
        currentCourses={currentCourses}
        completedCourses={completedCourses}
      />
    </div>
  );
}
