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
All course and grade data ultimately comes from the University of Houston via the Texas Public Information Act (TPIA). 🏛️

We rely on the same public data exports that power the open-source CougarGrades project and the **CougarGrades Public Data Repository**. When that dataset is refreshed by UH and the community, CoogPlanner can pull the latest files, re-parse them, and update what you see here.

In short:
• 📥 Data is requested from UH through formal public-records requests (TPIA).  
• 📊 The data is published and maintained in an open GitHub repository.  
• 🔁 CoogPlanner periodically re-imports and re-processes that dataset into its own database and views.

Because this depends on when UH publishes new files and when volunteers update the public repo, data is not “real-time.” It is a historical record up to the most recently published term.`,
  },
  {
    question: "Is this just another version of CougarGrades?",
    lastUpdated: "Oct 2025",
    answer: `
Short answer: ❌ No.

CougarGrades (by Austin Jackson) focuses on **exploring historical grade distributions** — amazing charts, filters, and visualizations so you can see how past students did in a course or with a professor.

CoogPlanner is focused on **personalized planning**:
• 🎓 Understand how your courses satisfy major/minor/core requirements.  
• 🧩 Build term-by-term plans that respect prerequisites and your workload.  
• ⭐ Get suggestions for courses and instructors based on past outcomes and ratings.  

You can think of it this way:
• CougarGrades ➝ “How have students done in this class or with this professor?”  
• CoogPlanner ➝ “Given my transcript and goals, what should I take next, and with whom?”  

CougarGrades was a huge inspiration — CoogPlanner just repurposes similar public data for a different goal.`,
  },
  {
    question: "Important Notice & Disclaimer — what should I know?",
    lastUpdated: "Oct 2025",
    answer: `
CoogPlanner is an **independent, student-run project**. 🐾  
It is **not** affiliated with, endorsed by, or officially connected to the University of Houston or any of its departments. For official information, always refer to UH websites and your academic advisor.

What this tool is:
• 🧠 Extra context and planning help.  
• 📈 A way to explore data and get ideas for schedules and degree paths.  

What this tool is *not*:
• ❌ Official advising or an official degree audit.  
• ❌ A guarantee of course availability, professor assignments, or outcomes.  

Requirements, policies, and offerings can change. Always double-check with your advisor and official UH resources before making final decisions. CoogPlanner and its contributors are not responsible for academic or personal decisions made based on this tool.`,
  },
  {
    question: "Data & suggestion accuracy — can I trust it?",
    lastUpdated: "Oct 2025",
    answer: `
The numbers shown in CoogPlanner come from:
• 📂 Official UH datasets obtained through public-records processes (TPIA).  
• ⭐ Public rating sources (for example, RateMyProfessors) where applicable.  

That said, **no dataset is perfect**:
• Some terms or sections may be missing or reported differently.  
• Requirements and catalogs can change after data was collected.  
• A good or bad grade trend does not guarantee your personal outcome.  

Suggestions are meant to be **decision support**, not promises.  
Use them as a helpful starting point, then confirm details with:
• Your academic advisor 🧑‍🏫  
• The official UH catalog and degree audit tools 📘  

If you notice something that looks wrong, please report it so it can be investigated and corrected.`,
  },
  {
    question: "How do I get my unofficial transcript?",
    lastUpdated: "Oct 2025",
    answer: `
Your **unofficial transcript** lets CoogPlanner read which courses you have completed or are in progress so it can analyze your degree and suggest next steps. 🎯

Here is a typical flow using UH systems:
1️⃣ Go to AccessUH and sign in with your CougarNet credentials.  
2️⃣ Open **myUH Self Service** from the dashboard.  
3️⃣ In the menu, go to **Academic Records** → **Transcripts**.  
4️⃣ Choose **View Unofficial Transcript** and make sure the report type is “Unofficial Transcript.”  
5️⃣ Submit the request, then open the generated PDF (sometimes under “View All Requested Reports”).  
6️⃣ Download that PDF to your device and upload it into CoogPlanner when prompted.

The PDF you upload is used to parse course history and build your analysis. Always review the parsed results and fix anything that looks off before relying on them for planning.`,
  },
];
