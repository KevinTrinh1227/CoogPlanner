module.exports=[34431,a=>{"use strict";var b=a.i(87924),c=a.i(38246),d=a.i(50944),e=a.i(72131);function f({crumbs:a,showStarAndCart:f=!1,isSignedIn:g=!1,className:h}){let i=(0,d.useRouter)(),j=(0,d.usePathname)(),k=(0,e.useCallback)(a=>{g?"favorite"===a?alert("Placeholder: toggled favorite for this item."):alert("Placeholder: added item to your plan/cart."):i.push(`/signin?redirect=${encodeURIComponent(j??"/")}`)},[g,j,i]),l=(0,e.useCallback)(async()=>{},[]),m="inline-flex items-center truncate text-sm md:text-[15px] font-medium text-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light";return(0,b.jsxs)("div",{className:`flex flex-wrap items-center gap-2 text-sm text-slate-400 md:flex-nowrap md:items-center md:justify-between md:text-[15px] ${h??""}`,children:[(0,b.jsxs)("div",{className:"order-2 flex flex-wrap items-center gap-1.5 md:order-2 md:justify-end",children:[f&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("button",{type:"button",onClick:()=>k("favorite"),className:"inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light",children:[(0,b.jsx)("span",{"aria-hidden":!0,children:"⭐"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:"Favorite"})]}),(0,b.jsxs)("button",{type:"button",onClick:()=>k("cart"),className:"inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light",children:[(0,b.jsx)("span",{"aria-hidden":!0,children:"🛒"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:"Add to cart"})]})]}),(0,b.jsxs)("button",{type:"button",onClick:l,className:"inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light",children:[(0,b.jsx)("span",{"aria-hidden":!0,children:"🔗"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:"Share"})]})]}),(0,b.jsxs)("div",{className:"order-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap md:order-1",children:[(0,b.jsx)(c.default,{href:"/",className:m,title:"Go to Home",children:"Home"}),(0,b.jsx)("span",{className:"px-1 text-slate-600",children:"/"}),a.map((d,e)=>{let f=e===a.length-1;return(0,b.jsxs)("div",{className:"flex items-center",children:[d.href&&!f?(0,b.jsx)(c.default,{href:d.href,className:m,children:d.label}):(0,b.jsx)("span",{className:f?"inline-flex items-center truncate text-sm md:text-[15px] font-medium text-slate-100":m,"aria-current":f?"page":void 0,children:d.label}),!f&&(0,b.jsx)("span",{className:"px-1 text-slate-600","aria-hidden":!0,children:"/"})]},`${d.label}-${e}`)})]})]})}a.s(["PageBreadcrumb",()=>f])},56582,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(50944);let e=[{question:"How did you get all the data and when does it get updated?",lastUpdated:"Oct 2025",answer:`
All course and grade data ultimately comes from the University of Houston via the Texas Public Information Act (TPIA).

We rely on the same public data exports that power the open-source CougarGrades project and the **CougarGrades Public Data Repository**. When that dataset is refreshed by UH and the community, CoogPlanner can pull the latest files, re-parse them, and update what you see here.

In short:
• Data is requested from UH through formal public-records requests (TPIA).  
• The data is published and maintained in an open GitHub repository.  
• CoogPlanner periodically re-imports and re-processes that dataset into its own database and views.

Because this depends on when UH publishes new files and when volunteers update the public repo, data is not “real-time.” It is a historical record up to the most recently published term.`},{question:"Is this just another version of CougarGrades?",lastUpdated:"Oct 2025",answer:`
Short answer: **No.**

CougarGrades (by Austin Jackson) focuses on **exploring historical grade distributions** - charts, filters, and visualizations so you can see how past students did in a course or with a professor.

CoogPlanner is focused on **personalized planning**:
• Understand how your courses satisfy major, minor, and core requirements.  
• Build term-by-term plans that respect prerequisites and your workload.  
• Get suggestions for courses and instructors based on past outcomes and ratings.  

You can think of it this way:
• CougarGrades → “How have students done in this class or with this professor?”  
• CoogPlanner → “Given my transcript and goals, what should I take next, and with whom?”  

CougarGrades was a huge inspiration - CoogPlanner repurposes similar public data for a different goal.`},{question:"Important Notice & Disclaimer - what should I know?",lastUpdated:"Oct 2025",answer:`
CoogPlanner is an **independent, student-run project**.  
It is **not** affiliated with, endorsed by, or officially connected to the University of Houston or any of its departments. For official information, always refer to UH websites and your academic advisor.

What this tool is:
• Extra context and planning help.  
• A way to explore data and get ideas for schedules and degree paths.  

What this tool is *not*:
• Official advising or an official degree audit.  
• A guarantee of course availability, professor assignments, or outcomes.  

Requirements, policies, and offerings can change. Always double-check with your advisor and official UH resources before making final decisions. CoogPlanner and its contributors are not responsible for academic or personal decisions made based on this tool.`},{question:"Data & suggestion accuracy - can I trust it?",lastUpdated:"Oct 2025",answer:`
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

If you notice something that looks wrong, please report it so it can be investigated and corrected.`},{question:"How do I get my unofficial transcript?",lastUpdated:"Oct 2025",answer:`
Your **unofficial transcript** lets CoogPlanner read which courses you have completed or are in progress so it can analyze your degree and suggest next steps.

Here is a typical flow using UH systems:
1. Go to AccessUH and sign in with your CougarNet credentials.  
2. Open **myUH Self Service** from the dashboard.  
3. In the menu, go to **Academic Records** → **Transcripts**.  
4. Choose **View Unofficial Transcript** and make sure the report type is “Unofficial Transcript.”  
5. Submit the request, then open the generated PDF (sometimes under “View All Requested Reports”).  
6. Download that PDF to your device and upload it into CoogPlanner when prompted.

The PDF you upload is used to parse course history and build your analysis. Always review the parsed results and fix anything that looks off before relying on them for planning.`},{question:"How is my login, account data, and transcript kept secure?",lastUpdated:"Oct 2025",answer:`
CoogPlanner is designed with privacy and security in mind.

In general:
• Authentication is handled by a trusted auth provider (for example, a managed identity service). Passwords are not stored in plain text.  
• Any account details required for sign-in are stored securely by the auth provider, not directly by CoogPlanner.  
• Unofficial transcript files you upload are used to parse your course history. They are not shared with UH and are not used for anything outside of powering your planning experience.  

If you are not signed in, parsed transcript data is meant to be temporary and can be cleared when you leave or refresh the page. When signed in, you have more control over what’s saved with your account and can update or delete information over time.

For more details, refer to the dedicated Privacy & Legal page in the app once it is available.`},{question:"What’s on the roadmap for CoogPlanner?",lastUpdated:"Oct 2025",answer:`
The long-term goal is to evolve CoogPlanner from “data and planning helper” into a true **degree-planning copilot**.

Some of the roadmap ideas include:
• Auto-planning to graduation with multiple path options (fast track, balanced load, work-friendly).  
• Smarter path variants that consider constraints like max credits, specific days/times, GPA targets, and summer/winter usage.  
• Smart alerts for enrollment windows, prerequisite issues, and saved courses when new sections open or data changes.  
• An AI assistant that explains requirement gaps in plain language and suggests swaps when a class is full.  
• A visual schedule builder so you can drag-and-drop sections into a weekly timetable and avoid time conflicts.  
• Deeper eligibility checks that use your completed and in-progress courses to validate pre- and co-requisites in real time.  

This roadmap will evolve based on student feedback and what proves most useful in real-world planning.`},{question:"What if I want to contribute or help out?",lastUpdated:"Oct 2025",answer:`
CoogPlanner will be open to contributions from students and the UH community.

Ways you might help:
• Share feedback about what works well or feels confusing in the UI.  
• Suggest new ranking views, filters, or data points that would make planning decisions easier.  
• Help test new features and report bugs or edge cases.  
• Contribute code, documentation, or design ideas if and when the project is opened up on GitHub.  

If you're interested in helping, watch for links to the project repository or contact options on the About or Privacy & Legal pages.`},{question:"Is CoogPlanner affiliated with the University of Houston?",lastUpdated:"Oct 2025",answer:`
No. CoogPlanner is an independent, student-run project and has no affiliation, endorsement, or official connection with the University of Houston or the UH System.

All UH-related names, marks, and course information are used only for identification and informational purposes, based on publicly available or lawfully obtained data.

For any official information about your degree, requirements, or enrollment, always rely on:
• Official UH websites (such as uh.edu and catalog listings).  
• Official UH tools like your degree audit systems.  
• Your academic advisor and college advising center.`},{question:"Why should I sign up? What do I get with an account?",lastUpdated:"Oct 2025",answer:`
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

Signing up is optional, but it makes CoogPlanner more useful as a day-to-day planning companion rather than a one-off lookup tool.`},{question:"How are difficulty scores calculated for courses and instructors?",lastUpdated:"Oct 2025",answer:"Basically, difficulty scores are derived from historical grade distributions to give a sense of how challenging a course or instructor has been for past students."}];var f=a.i(34431);function g(){let a=(0,d.useRouter)(),g=(0,d.useSearchParams)(),h=(0,c.useMemo)(()=>e.map(a=>({...a,slug:a.question.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")})),[]),[i,j]=(0,c.useState)(()=>g.get("q")||void 0),k=(0,c.useRef)(void 0);void 0===k.current&&(k.current=g.get("q")||void 0),(0,c.useEffect)(()=>{if(!k.current)return;let a=document.getElementById(`faq-${k.current}`);a&&a.scrollIntoView({behavior:"smooth",block:"start"})},[]);let l=b=>{if(i===b)j(void 0),a.replace("/faq",{scroll:!1});else{let c;j(b),(c=new URLSearchParams(g.toString())).set("q",b),a.replace(`/faq?${c.toString()}`,{scroll:!1})}};return(0,b.jsxs)("div",{className:"mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 lg:py-14",children:[(0,b.jsx)(f.PageBreadcrumb,{crumbs:[{label:"FAQ"}],showStarAndCart:!1,className:"mb-3"}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h1",{className:"text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl",children:"🤔 Frequently Asked Questions"}),(0,b.jsx)("p",{className:"mt-2 max-w-5xl text-xs leading-relaxed text-slate-300 md:text-sm",children:"Answers to the most common questions about data freshness, accuracy, security, contributions, and more. Click a question below to expand its answer."})]}),(0,b.jsx)("section",{className:"space-y-4",children:h.map(a=>{let c,d=i===a.slug,e=a.answer.trim().split(/\n{2,}/);return(0,b.jsxs)("section",{id:`faq-${a.slug}`,className:"scroll-mt-24 w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:shadow-md md:p-7",children:[(0,b.jsxs)("div",{role:"button",tabIndex:0,onClick:()=>l(a.slug),onKeyDown:(c=a.slug,a=>{("Enter"===a.key||" "===a.key)&&(a.preventDefault(),l(c))}),className:"flex w-full cursor-pointer items-start justify-between gap-4 text-left","aria-expanded":d,"aria-controls":`faq-panel-${a.slug}`,children:[(0,b.jsxs)("div",{className:"flex flex-1 items-start gap-3",children:[(0,b.jsx)("div",{className:"mt-1 hidden h-7 w-7 items-center justify-center rounded-xl bg-slate-900/80 text-base text-slate-200 sm:flex",children:(0,b.jsx)("span",{"aria-hidden":!0,children:"🔹"})}),(0,b.jsxs)("div",{className:"flex flex-1 flex-col gap-1",children:[(0,b.jsx)("span",{className:"text-lg font-semibold tracking-tight text-slate-50 md:text-xl",children:a.question}),(0,b.jsxs)("span",{className:"text-[11px] uppercase tracking-wide text-slate-500",children:["Last updated:"," ",(0,b.jsx)("span",{className:"font-medium text-slate-300",children:a.lastUpdated})]})]})]}),(0,b.jsx)("div",{className:"mt-1 flex items-center justify-center",children:(0,b.jsx)("svg",{viewBox:"0 0 20 20","aria-hidden":"true",className:`h-5 w-5 text-slate-300 transition-transform duration-150 ${d?"rotate-180":""}`,children:(0,b.jsx)("path",{d:"M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z",fill:"currentColor"})})})]}),(0,b.jsx)("div",{id:`faq-panel-${a.slug}`,className:`overflow-hidden text-sm text-slate-300 transition-all duration-200 ease-out md:text-[15px] ${d?"mt-3 max-h-[600px] border-t border-slate-800 pt-3 opacity-100":"mt-0 max-h-0 border-t-0 pt-0 opacity-0"}`,"aria-hidden":!d,children:e.map((a,c)=>(0,b.jsx)("p",{className:"mb-2 whitespace-pre-line text-xs leading-relaxed text-slate-200 last:mb-0 md:text-sm",children:a.split(/(\*\*[^*]+\*\*)/g).map((a,c)=>{let d=a.match(/^\*\*([^*]+)\*\*$/);return d?(0,b.jsx)("strong",{children:d[1]},c):(0,b.jsx)("span",{children:a},c)})},c))})]},a.slug)})})]})}function h(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("div",{className:"px-4 py-8 text-sm text-slate-400",children:"Loading FAQ…"}),children:(0,b.jsx)(g,{})})}a.s(["default",()=>h],56582)}];

//# sourceMappingURL=_8cf801b6._.js.map