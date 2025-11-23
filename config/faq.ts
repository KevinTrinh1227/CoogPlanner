// config/faq.ts

export type FaqItem = {
  question: string;
  lastUpdated: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "How did you get all the data and when does it get updated?",
    lastUpdated: "Oct 2025",
    answer: `
All course and grade data ultimately comes from the University of Houston via the Texas Public Information Act (TPIA).

We rely on the same public data exports that power the open-source CougarGrades project and the **CougarGrades Public Data Repository**. When that dataset is refreshed by UH and the community, CoogPlanner can pull the latest files, re-parse them, and update what you see here.

In short:
• Data is requested from UH through formal public-records requests (TPIA).  
• The data is published and maintained in an open GitHub repository.  
• CoogPlanner periodically re-imports and re-processes that dataset into its own database and views.

Because this depends on when UH publishes new files and when volunteers update the public repo, data is not “real-time.” It is a historical record up to the most recently published term.`,
  },
  {
    question: "Is this just another version of CougarGrades?",
    lastUpdated: "Oct 2025",
    answer: `
Short answer: **No.**

CougarGrades (by Austin Jackson) focuses on **exploring historical grade distributions** - charts, filters, and visualizations so you can see how past students did in a course or with a professor.

CoogPlanner is focused on **personalized planning**:
• Understand how your courses satisfy major, minor, and core requirements.  
• Build term-by-term plans that respect prerequisites and your workload.  
• Get suggestions for courses and instructors based on past outcomes and ratings.  

You can think of it this way:
• CougarGrades → “How have students done in this class or with this professor?”  
• CoogPlanner → “Given my transcript and goals, what should I take next, and with whom?”  

CougarGrades was a huge inspiration - CoogPlanner repurposes similar public data for a different goal.`,
  },
  {
    question: "Important Notice & Disclaimer - what should I know?",
    lastUpdated: "Oct 2025",
    answer: `
CoogPlanner is an **independent, student-run project**.  
It is **not** affiliated with, endorsed by, or officially connected to the University of Houston or any of its departments. For official information, always refer to UH websites and your academic advisor.

What this tool is:
• Extra context and planning help.  
• A way to explore data and get ideas for schedules and degree paths.  

What this tool is *not*:
• Official advising or an official degree audit.  
• A guarantee of course availability, professor assignments, or outcomes.  

Requirements, policies, and offerings can change. Always double-check with your advisor and official UH resources before making final decisions. CoogPlanner and its contributors are not responsible for academic or personal decisions made based on this tool.`,
  },
  {
    question: "Data & suggestion accuracy - can I trust it?",
    lastUpdated: "Oct 2025",
    answer: `
The numbers shown in CoogPlanner come from:
• Official UH datasets obtained through public-records processes (TPIA).  
• Public rating sources (for example, RateMyProfessors) where applicable.  

That said, **no dataset is perfect**:
• Some terms or sections may be missing or reported differently.  
• Requirements and catalogs can change after data was collected.  
• A good or bad grade trend does not guarantee your personal outcome.  

Suggestions are meant to be **decision support**, not promises.  
Use them as a helpful starting point, then confirm details with:
• Your academic advisor.  
• The official UH catalog and degree audit tools.  

If you notice something that looks wrong, please report it so it can be investigated and corrected.`,
  },
  {
    question: "How do I get my unofficial transcript?",
    lastUpdated: "Oct 2025",
    answer: `
Your **unofficial transcript** lets CoogPlanner read which courses you have completed or are in progress so it can analyze your degree and suggest next steps.

Here is a typical flow using UH systems:
1️⃣ Go to AccessUH and sign in with your CougarNet credentials.  
2️⃣ Open **myUH Self Service** from the dashboard.  
3️⃣ In the menu, go to **Academic Records** → **Transcripts**.  
4️⃣ Choose **View Unofficial Transcript** and make sure the report type is “Unofficial Transcript.”  
5️⃣ Submit the request, then open the generated PDF (sometimes under “View All Requested Reports”).  
6️⃣ Download that PDF to your device and upload it into CoogPlanner when prompted.

The PDF you upload is used to parse course history and build your analysis. Always review the parsed results and fix anything that looks off before relying on them for planning.`,
  },
  {
    question: "How is my login, account data, and transcript kept secure?",
    lastUpdated: "Oct 2025",
    answer: `
CoogPlanner is designed with privacy and security in mind.

In general:
• Authentication is handled by a trusted auth provider (for example, a managed identity service). Passwords are not stored in plain text.  
• Any account details required for sign-in are stored securely by the auth provider, not directly by CoogPlanner.  
• Unofficial transcript files you upload are used to parse your course history. They are not shared with UH and are not used for anything outside of powering your planning experience.  

If you are not signed in, parsed transcript data is meant to be temporary and can be cleared when you leave or refresh the page. When signed in, you have more control over what’s saved with your account and can update or delete information over time.

For more details, refer to the dedicated Privacy & Legal page in the app once it is available.`,
  },
  {
    question: "What’s on the roadmap for CoogPlanner?",
    lastUpdated: "Oct 2025",
    answer: `
The long-term goal is to evolve CoogPlanner from “data and planning helper” into a true **degree-planning copilot**.

Some of the roadmap ideas include:
• Auto-planning to graduation with multiple path options (fast track, balanced load, work-friendly).  
• Smarter path variants that consider constraints like max credits, specific days/times, GPA targets, and summer/winter usage.  
• Smart alerts for enrollment windows, prerequisite issues, and saved courses when new sections open or data changes.  
• An AI assistant that explains requirement gaps in plain language and suggests swaps when a class is full.  
• A visual schedule builder so you can drag-and-drop sections into a weekly timetable and avoid time conflicts.  
• Deeper eligibility checks that use your completed and in-progress courses to validate pre- and co-requisites in real time.  

This roadmap will evolve based on student feedback and what proves most useful in real-world planning.`,
  },
  {
    question: "What if I want to contribute or help out?",
    lastUpdated: "Oct 2025",
    answer: `
CoogPlanner will be open to contributions from students and the UH community.

Ways you might help:
• Share feedback about what works well or feels confusing in the UI.  
• Suggest new ranking views, filters, or data points that would make planning decisions easier.  
• Help test new features and report bugs or edge cases.  
• Contribute code, documentation, or design ideas if and when the project is opened up on GitHub.  

If you’re interested in helping, watch for links to the project repository or contact options on the About or Privacy & Legal pages.`,
  },
  {
    question: "Is CoogPlanner affiliated with the University of Houston?",
    lastUpdated: "Oct 2025",
    answer: `
No. CoogPlanner is an independent, student-run project and has no affiliation, endorsement, or official connection with the University of Houston or the UH System.

All UH-related names, marks, and course information are used only for identification and informational purposes, based on publicly available or lawfully obtained data.

For any official information about your degree, requirements, or enrollment, always rely on:
• Official UH websites (such as uh.edu and catalog listings).  
• Official UH tools like your degree audit systems.  
• Your academic advisor and college advising center.`,
  },
  {
    question: "Why should I sign up? What do I get with an account?",
    lastUpdated: "Oct 2025",
    answer: `
You can still browse a lot of information as a guest, but an account unlocks more personalized and persistent features.

As a guest, you can:
• Explore basic course and instructor information.  
• View sample rankings and historical trends (where available).  

With an account, you can (planned features):
• Save degree snapshots and planning scenarios for later.  
• Store and refine transcript-based analyses instead of re-uploading each time.  
• Star or favorite courses and professors you are considering.  
• Keep a “cart” of upcoming courses you might register for and compare schedules.  
• Receive more tailored suggestions that persist across sessions.

Signing up is optional, but it makes CoogPlanner more useful as a day-to-day planning companion rather than a one-off lookup tool.`,
  },
];
