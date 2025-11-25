// config/site.ts

export const siteConfig = {
  name: "Coog Planner",
  domain: "CoogPlanner.com",
  tagline: "UH degree & semester planning",

  github: {
    owner: "kevintrinh1227",
    repo: "CoogPlanner",
  },

  data: {
    // you update this manually whenever you refresh the UH dataset
    uhDataLastUpdated: "Nov 18, 2025",
  },
  hero: {
    primaryCtaHref: "/search",
  },
  stats: {
    transcriptsAnalyzed: "1,204+",
    plansGenerated: "3,587+",
    customSchedulesShared: "842+",
    itemsSearched: "18,940+",
    totalFavorited: "2,119+",
    addedToCart: "463+",
  },
  search: {
    helperText:
      "Please enter a course, instructor or degree plan to begin. (e.g., COSC 1336, Rincon Castro, Computer Science B.S.)",
  },
  enrollment: {
    // Label that will show in the UI
    nextTermLabel: "Fall 2026",

    // ISO string for when enrollment opens (adjust to whatever is correct)
    // This example is April 1, 2026 at 8:00 AM Central (UTC-5 or -6 depending on DST)
    nextEnrollmentStart: "2026-04-01T08:00:00-05:00",
  },

  features: {
    title: "Built for Coogs, not generic students.",
    description:
      "Coog Planner is opinionated around UH workflows: catalogs, prerequisites, and how students actually plan their semesters. Below shows some examples of what we do.",
    items: [
      {
        id: "uh-info",
        title: "Student Personalized Plans",
        body: "Degree plans based on your requirements and personal life, not generic four-year templates every other students follows.",
      },
      {
        id: "prereq-aware",
        title: "Pre/Co-requisites Planning",
        body: "Know instantly if a planned semester violates prerequisites/corequisites or recommended sequences before enrollment.",
      },
      {
        id: "grad-timeline",
        title: "Graduate On Time",
        body: "Visualize best-case and realistic graduation semesters based on your planned loads. So you can graduate on time.",
      },
      {
        id: "smart-loads",
        title: "Smarter Semester Work Loads",
        body: "Get a feel for when a semester is too heavy or too light with quick load indicators based on credits and course type mix.",
      },
      {
        id: "what-if",
        title: "What-if Degree Changes",
        body: "Experiment with switching majors or adding a minor while seeing which classes still count and how your grad date shifts.",
      },
      {
        id: "shareable-plans",
        title: "Shareable Schedules & Plans",
        body: "Share your plans/schedules with friends, mentors, or advisors so everyone is aligned on your semesters and graduation path.",
      },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
