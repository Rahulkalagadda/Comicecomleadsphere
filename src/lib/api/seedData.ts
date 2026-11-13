import { Book, Comic, PodcastSeries, User, Order, AuditLog, Entitlement } from "@/types";

export const SEED_BOOKS: Book[] = [
  {
    id: "book-jungle-safari",
    slug: "ai-jungle-safari-transformation-blueprint",
    type: "book",
    title: "The AI Jungle Safari: Data, Digital & AI Transformation Blueprint",
    author: "Dr. Amit Khandelwal",
    coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
    description:
      "Conceptualized, curated, and published by Dr. Amit Khandelwal (CXO Lanes Power List 2026 Winner, 28 years of Global Transformation leadership). Across 13 structured chapters, ten Jungle C-Suite archetypes—from Lion (CEO & AI Strategy) and Elephant (CDO & Data Strategy) to Wolf (COO & Operations) and Monkey (GenAI & Productivity)—guide boards from fragmented POCs to measurable ROI.",
    category: "AI & Digital Transformation",
    tags: ["AI Strategy", "CXO Blueprint", "Data Governance", "GenAI", "Transformation"],
    price: 899,
    rating: 4.95,
    pageCount: 280,
    previewPageLimit: 10,
    publishedAt: "2026-10-01",
    featured: true,
    isNew: true,
    tableOfContents: [
      { title: "Chapter 01: The Jungle Audit — Are we ready?", page: 1 },
      { title: "Chapter 02: Sensing the Forest Floor — Where is the real opportunity?", page: 22 },
      { title: "Chapter 03: Chasing the High Yield Prey — Which AI opportunities create ROI?", page: 44 },
      { title: "Chapter 04: Carving the Path — Moving from POC to production", page: 68 },
      { title: "Chapter 05: The Eagle Eye — Protecting AI & corporate information", page: 92 },
      { title: "Chapter 06: The Legal Canopy — Navigating regulation and IP", page: 114 },
      { title: "Chapter 07: Waterhole Rights — Governing AI, data & accountability", page: 136 },
      { title: "Chapter 08: The Jungle Code — Ethical and human-centered AI", page: 158 },
      { title: "Chapter 09: Weathering the Storm — Managing risk, people & change", page: 180 },
      { title: "Chapter 10: The King's Checklist — Critical AI success factors", page: 204 },
      { title: "Chapter 11: The Stakeholder Safari — Customer & board trust", page: 226 },
      { title: "Chapter 12: The King's Treasury — Board, budget & AI economics", page: 248 },
      { title: "Chapter 13: The Crown of AI — Sustainable competitive advantage", page: 264 },
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Chapter 01: The Jungle Audit — The Jungle Is Changing",
        text: `Think Strategically. Then Let AI Roar.

Every animal in the jungle is talking about AI. Every vendor promises exponential acceleration. Yet very few enterprises actually possess an AI strategy.

Companies rush to buy the engine first—new tools, new foundation models, new cloud platforms—while forgetting the very first executive question: "Are we ready?"

AI investment does not equal AI readiness. And buying an AI subscription does not equal enterprise transformation. Before prescribing technology, a disciplined organization conducts a Jungle Audit across five pillars: Business Alignment, Operational Readiness, Data Maturity, Talent Capability, and Value & Risk Governance.`,
      },
      {
        pageNumber: 2,
        title: "Chapter 01: The Five Core Questions",
        text: `As The Lion reminds the C-Suite Council around the studio table, a real AI strategy never begins with algorithms—it begins with the business problem:

1. Where can AI create measurable business value (Revenue, Customer Experience, Productivity, Risk, or Growth)?
2. What foundational data do we actually need, and is it clean, connected, and governed?
3. Which AI capabilities should we build versus buy?
4. How do we manage security, regulatory exposure, IP, and ethical AI risk?
5. How do we measure sustained financial ROI rather than demo-day applause?

AI without strategy creates activity. AI with strategy creates lasting advantage.`,
      },
      {
        pageNumber: 3,
        title: "The 10 Jungle C-Suite Archetypes",
        text: `Transformation fails when AI is isolated inside a single IT lab. Season 1 convenes all ten enterprise functions inside one executive council:

• Lion (CEO & AI Strategy): AI Strategy, Business Value, Executive Leadership
• Elephant (CDO & Data Strategy): Data Strategy, Data Readiness, Data Ownership
• Wolf (COO & Operations): Process Maturity, Implementation, Scaling, Adoption
• Owl (Governance & Compliance): AI Governance, Compliance, Ethics, Risk
• Fox (CSO & Innovation): Innovation, AI Discovery, Strategic Opportunities
• Cheetah (Automation & Tech): Automation, Technology, POC to Production
• Eagle (CISO & Cybersecurity): AI Security, Data Protection, Cyber Risk
• Ant (Workforce & HR): Workforce Upskilling, Change Management
• Peacock (CMO & Marketing): Customer Experience, Marketing, Brand Innovation
• Monkey (GenAI & Productivity): Rapid Experimentation vs. Unchecked Tool Sprawl.`,
      },
      {
        pageNumber: 4,
        title: "The Value Pipeline: Business → Data → AI → People → Governance",
        text: `Look at how high-performing enterprises sequence transformation:

[Business Problem] → [Governed Data] → [Targeted AI Use Case] → [Enabled People] → [Measured Business Value]

When Monkey interrupts the Lion proclaiming, "I already use ChatGPT and automated my banana inventory—so I have an AI strategy!" the unintended order of 4,000 bananas exposes the core fallacy of bottom-up hype without operational guardrails.

Operational Readiness precedes Automation: Map the workflow, identify bottlenecks, simplify legacy handoffs, and only then automate.`,
      },
      ...Array.from({ length: 16 }, (_, idx) => {
        const pageNum = idx + 5;
        return {
          pageNumber: pageNum,
          title:
            pageNum <= 10
              ? `Chapter 01.${pageNum}: Data Maturity & The Readiness Scorecard`
              : `Chapter ${Math.min(13, Math.ceil((pageNum - 4) / 2))}: Executive Playbook`,
          text:
            pageNum <= 10
              ? `Page ${pageNum}: Data Maturity asks whether enterprise intelligence is Available, Accurate, Connected, Governed, and Secure enough to sustain production models. Disconnected spreadsheets, legacy ERPs, and duplicate CRM silos cannot produce reliable autonomous decisions.\n\nBy scoring Business Alignment, Operations, Data, AI Capability, and Value & Risk on a 5-point maturity scorecard, leadership moves past slide decks into a sequenced, funded transformation roadmap.`
              : `Page ${pageNum}: [PROTECTED EXECUTIVE PLAYBOOK - ENTITLEMENT VERIFIED]\nDetailed board governance matrix, CAPEX/OPEX allocation rubrics, Vendor Lock-In safeguards, and Production MLOps readiness checklists from Dr. Amit Khandelwal's 13-Chapter AI Jungle Safari.`,
        };
      }),
    ],
  },
  {
    id: "book-jungle-audit-handbook",
    slug: "the-jungle-audit-maturity-playbook",
    type: "book",
    title: "The Jungle Audit: 5-Pillar AI Readiness & Maturity Playbook",
    author: "Dr. Amit Khandelwal",
    coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
    description:
      "The companion boardroom workbook for Chapter 01 of The AI Jungle Safari. Score Business Alignment, Process Maturity, Data Readiness, Talent Capability, and Value & Risk Governance before writing an AI cheque.",
    category: "Enterprise Readiness",
    tags: ["Jungle Audit", "Process Maturity", "Data Readiness", "ROI"],
    price: 599,
    rating: 4.9,
    pageCount: 164,
    previewPageLimit: 10,
    publishedAt: "2026-10-08",
    featured: true,
    isNew: true,
    tableOfContents: [
      { title: "Pillar 1: Business Alignment — What value are we creating?", page: 1 },
      { title: "Pillar 2: Operational Readiness — Map before you automate", page: 28 },
      { title: "Pillar 3: Data Maturity — Clean, connected & governed", page: 64 },
      { title: "Pillar 4: People & Change — Turning hype into adoption", page: 98 },
      { title: "Pillar 5: Value & Risk — The 5-Pillar Jungle Scorecard", page: 130 },
    ],
    pages: Array.from({ length: 20 }, (_, idx) => {
      const pageNum = idx + 1;
      return {
        pageNumber: pageNum,
        title: `Pillar ${Math.min(5, Math.ceil(pageNum / 4))}: Readiness Diagnostic Sheet ${pageNum}`,
        text:
          pageNum <= 10
            ? `Page ${pageNum}: Measure first. Transform second.\n\nBefore funding generative or predictive pilots, run the Jungle Audit across five institutional questions: (1) Which revenue, cost, CX, or risk KPI owns this initiative? (2) Has the legacy workflow been mapped and simplified? (3) Are source systems connected under clear data ownership?\n\nAs Wolf (COO) demonstrates, automating a fragmented manual approval flow merely accelerates bottlenecks.`
            : `Page ${pageNum}: [PROTECTED FIELD PLAYBOOK - ENTITLEMENT VERIFIED]\nWeighted scoring templates for CIO/CDO steering committees, Shadow-AI remediation checklists, and 90-day governance milestones.`,
      };
    }),
  },
];

export const SEED_COMICS: Comic[] = [
  {
    id: "comic-jungle-audit",
    slug: "ai-jungle-podcast-episode-1-comic",
    type: "comic",
    title: "The AI Jungle Podcast: Episode 1 Graphic Comic",
    creator: "Dr. Amit Khandelwal",
    illustrator: "AI Jungle Studio",
    coverUrl: "/media/images/ai-jungle-podcast-comic.jpg",
    description:
      "Full 7-panel illustrated comic strip starring Host Lion (King of Strategy), Elephant (Chief Data Officer), Wolf (COO), and Monkey (GenAI). Covers The Hook, The Elephant Enters, The Monkey Interrupts (4,000 Bananas), and The Five Questions.",
    category: "Graphic Comic",
    genre: "AI Strategy Comic",
    price: 299,
    pageCount: 16,
    previewPageLimit: 10,
    publishedAt: "2026-10-05",
    featured: true,
    isNew: true,
    aspectRatio: "3:4",
    pages: [
      {
        pageNumber: 1,
        imageUrl: "/media/images/ai-jungle-podcast-comic.jpg",
        panelDescription:
          "Panels 1–7: The Hook, The Elephant Enters, The Monkey Interrupts (4,000 Bananas), and The Five Questions",
      },
      {
        pageNumber: 2,
        imageUrl: "/media/images/jungle-audit-part-1.jpg",
        panelDescription:
          "1.1 The Jungle Audit (Part 1 — Clips 01–06): The Jungle Is Changing, Process Maturity & Data Readiness",
      },
      {
        pageNumber: 3,
        imageUrl: "/media/images/jungle-audit-part-2.jpg",
        panelDescription:
          "1.2 The Jungle Audit (Part 2 — Clips 07–12): Operational Readiness, 4,000 Bananas & The Maturity Scorecard",
      },
      {
        pageNumber: 4,
        imageUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        panelDescription:
          "Season 1 Master Poster: The 10 Jungle C-Suite Advisors & 13-Chapter AI Transformation Blueprint",
      },
      ...Array.from({ length: 12 }, (_, idx) => {
        const pageNum = idx + 5;
        const cycle = [
          "/media/images/ai-jungle-podcast-comic.jpg",
          "/media/images/jungle-audit-part-1.jpg",
          "/media/images/jungle-audit-part-2.jpg",
        ];
        return {
          pageNumber: pageNum,
          imageUrl: cycle[idx % cycle.length],
          panelDescription:
            pageNum <= 10
              ? `Comic Plate ${pageNum}: Season 1 Storyboard Study — Measure First. Transform Second.`
              : `Collector Plate ${pageNum}: [PROTECTED COMIC EDITION — ENTITLEMENT VERIFIED]`,
        };
      }),
    ],
  },
  {
    id: "comic-jungle-part-1",
    slug: "the-jungle-audit-part-1",
    type: "comic",
    title: "1.1 The Jungle Audit — Part 1 (Clips 01–06 Comic Strip)",
    creator: "Dr. Amit Khandelwal",
    illustrator: "AI Jungle Studio",
    coverUrl: "/media/images/jungle-audit-part-1.jpg",
    description:
      "Vertical 6-panel comic strip covering Clip 01 (The Jungle Is Changing), Clip 02 (Don't Buy the Engine First), Clip 03 (The Operations Reality — Wolf), Clip 04 (The Data Reality — Elephant), Clip 05 (The Jungle Audit), and Clip 06 (Business Alignment).",
    category: "Graphic Comic",
    genre: "Chapter 1 Comic Strip",
    price: 399,
    pageCount: 14,
    previewPageLimit: 10,
    publishedAt: "2026-10-08",
    featured: true,
    isNew: true,
    aspectRatio: "3:4",
    pages: [
      {
        pageNumber: 1,
        imageUrl: "/media/images/jungle-audit-part-1.jpg",
        panelDescription:
          "Clips 01–06 Complete Comic: From 'AI Investment ≠ AI Readiness' to '1. Business Alignment'",
      },
      {
        pageNumber: 2,
        imageUrl: "/media/images/ai-jungle-podcast-comic.jpg",
        panelDescription:
          "Episode 1 Companion Strip: Host Lion & Elephant Discuss Why AI Without Strategy Creates Chaos",
      },
      ...Array.from({ length: 12 }, (_, idx) => {
        const pageNum = idx + 3;
        return {
          pageNumber: pageNum,
          imageUrl:
            pageNum % 2 === 0
              ? "/media/images/jungle-audit-part-2.jpg"
              : "/media/images/jungle-audit-part-1.jpg",
          panelDescription:
            pageNum <= 10
              ? `Part 1 Breakdown Plate ${pageNum}: Lion, Wolf (COO) & Elephant (CDO) Panel Commentary`
              : `Part 1 Annotated Plate ${pageNum}: [PROTECTED COLLECTOR PANEL]`,
        };
      }),
    ],
  },
  {
    id: "comic-jungle-part-2",
    slug: "the-jungle-audit-part-2",
    type: "comic",
    title: "1.2 The Jungle Audit — Part 2 (Clips 07–12 Comic Strip)",
    creator: "Dr. Amit Khandelwal",
    illustrator: "AI Jungle Studio",
    coverUrl: "/media/images/jungle-audit-part-2.jpg",
    description:
      "Vertical comic strip covering Clip 07 (Operational Readiness: Map → Simplify → Automate), Clip 08 (Data Maturity Scorecard), Clip 09 (GenAI Trap: 4,000 Bananas), Clip 10 (5-Pillar Maturity Scorecard), Clip 11 (The Value Chain), and Clip 12 (Closing Manifesto).",
    category: "Graphic Comic",
    genre: "Chapter 1 Comic Strip",
    price: 399,
    pageCount: 14,
    previewPageLimit: 10,
    publishedAt: "2026-10-10",
    featured: true,
    isNew: true,
    aspectRatio: "3:4",
    pages: [
      {
        pageNumber: 1,
        imageUrl: "/media/images/jungle-audit-part-2.jpg",
        panelDescription:
          "Clips 07–12 Complete Comic: Operational Readiness, 4,000 Bananas & The Jungle Audit Scorecard",
      },
      {
        pageNumber: 2,
        imageUrl: "/media/images/jungle-audit-part-1.jpg",
        panelDescription:
          "Previously in Part 1: Business Alignment & Connected Data Governance",
      },
      ...Array.from({ length: 12 }, (_, idx) => {
        const pageNum = idx + 3;
        return {
          pageNumber: pageNum,
          imageUrl:
            pageNum % 2 === 0
              ? "/media/images/jungle-audit-part-1.jpg"
              : "/media/images/jungle-audit-part-2.jpg",
          panelDescription:
            pageNum <= 10
              ? `Part 2 Breakdown Plate ${pageNum}: Map → Simplify → Automate Sequence`
              : `Part 2 Collector Plate ${pageNum}: [PROTECTED COLLECTOR PANEL]`,
        };
      }),
    ],
  },
];

export const SEED_PODCASTS: PodcastSeries[] = [
  {
    id: "podcast-ai-jungle",
    slug: "ai-jungle-podcast",
    type: "podcast",
    title: "The AI Jungle Podcast: Where Business Meets Artificial Intelligence",
    host: "Dr. Amit Khandelwal & The Lion",
    coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
    description:
      "Season 1 Executive Video Podcast Series. Featuring Lion (CEO & AI Strategy), Wolf (COO & Operations), Elephant (CDO), and Monkey (GenAI) tackling real enterprise AI readiness, process maturity, and boardroom ROI.",
    category: "AI Strategy & Leadership",
    episodeCount: 4,
    publishedAt: "2026-10-08",
    featured: true,
    isNew: true,
    episodes: [
      {
        id: "ep-jungle-01",
        seriesId: "podcast-ai-jungle",
        episodeNumber: 1,
        title: "Ep 1: 1.1 The Jungle Audit — Full Pilot Masterclass (Free Episode)",
        description:
          "The complete inaugural video dialogue in the AI Jungle Studio: why companies buy AI before checking readiness, how Wolf maps broken processes, and Lion's five foundational questions before scaling AI.",
        duration: "02:52",
        thumbnailUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        videoStreamUrl: "/media/videos/jungle-audit-ep1-full.mp4",
        isFree: true,
        price: 0,
        releaseDate: "2026-10-08",
      },
      {
        id: "ep-jungle-02",
        seriesId: "podcast-ai-jungle",
        episodeNumber: 2,
        title: "Ep 2: Clip 01 — The Jungle Is Changing (Host Keynote Cut)",
        description:
          "\"Every beast knows how to run. But do you know where you're running?\" Studio monologue on strategic direction over blind velocity.",
        duration: "00:10",
        thumbnailUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        videoStreamUrl: "/media/videos/clip-01-jungle-is-changing.mp4",
        isFree: false,
        price: 199,
        releaseDate: "2026-10-10",
      },
      {
        id: "ep-jungle-03",
        seriesId: "podcast-ai-jungle",
        episodeNumber: 3,
        title: "Ep 3: Clip 02 — Don't Buy the Engine First (AI Investment ≠ Readiness)",
        description:
          "Why rushing into tools, models, and platforms without business-case grounding creates expensive shelfware.",
        duration: "00:10",
        thumbnailUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        videoStreamUrl: "/media/videos/clip-02-ai-investment-readiness.mp4",
        isFree: false,
        price: 249,
        releaseDate: "2026-10-12",
      },
      {
        id: "ep-jungle-04",
        seriesId: "podcast-ai-jungle",
        episodeNumber: 4,
        title: "Ep 4: Clip 03 — Operational Readiness (Map It Before You Automate It)",
        description:
          "Wolf (COO) and Lion dissect why automating disconnected habits multiplies chaos—and how to sequence process maturity first.",
        duration: "00:10",
        thumbnailUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        videoStreamUrl: "/media/videos/clip-03-process-maturity.mp4",
        isFree: false,
        price: 249,
        releaseDate: "2026-10-14",
      },
    ],
  },
];

export const SEED_CURRENT_USER: User = {
  id: "usr-exec-01",
  name: "Marcus Vance",
  email: "marcus.vance@vanceholdings.com",
  role: "super_admin",
  avatarUrl: "/images/mascot-lion.jpg",
  themePreference: "jungle",
  createdAt: "2026-01-10",
  status: "active",
};

export const SEED_USERS: User[] = [
  SEED_CURRENT_USER,
  {
    id: "usr-02",
    name: "Clara O'Connor",
    email: "clara.oc@meridiancap.com",
    role: "customer",
    themePreference: "jungle",
    createdAt: "2026-04-12",
    status: "active",
  },
  {
    id: "usr-03",
    name: "Vikram Singhania",
    email: "v.singhania@apexventure.io",
    role: "content_manager",
    themePreference: "jungle",
    createdAt: "2026-03-01",
    status: "active",
  },
  {
    id: "usr-04",
    name: "Sarah Jenkins",
    email: "sarah.j@financeops.org",
    role: "finance_manager",
    themePreference: "executive",
    createdAt: "2026-05-18",
    status: "active",
  },
];

export const SEED_ENTITLEMENTS: Entitlement[] = [
  {
    id: "ent-01",
    userId: "usr-exec-01",
    contentId: "book-jungle-safari",
    contentType: "book",
    grantedAt: "2026-10-01T10:00:00Z",
    verifiedBackendSignature: "sig_backend_verified_aijs_991823",
  },
  {
    id: "ent-02",
    userId: "usr-exec-01",
    contentId: "ep-jungle-01",
    contentType: "podcast_episode",
    grantedAt: "2026-10-08T11:00:00Z",
    verifiedBackendSignature: "sig_backend_verified_epjungle01_free",
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "ord-8812",
    orderNumber: "AGY-2026-8812",
    userId: "usr-exec-01",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@vanceholdings.com",
    items: [
      {
        id: "item-1",
        contentId: "book-jungle-safari",
        contentType: "book",
        title: "The AI Jungle Safari: Data, Digital & AI Transformation Blueprint",
        unitPrice: 899,
        coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
      },
    ],
    totalAmount: 899,
    currency: "INR",
    status: "payment_successful",
    razorpayOrderId: "order_Qz9182Jsk182",
    razorpayPaymentId: "pay_Kx9102837192",
    createdAt: "2026-10-01T10:00:00Z",
    verifiedAt: "2026-10-01T10:01:14Z",
  },
  {
    id: "ord-8813",
    orderNumber: "AGY-2026-8813",
    userId: "usr-02",
    customerName: "Clara O'Connor",
    customerEmail: "clara.oc@meridiancap.com",
    items: [
      {
        id: "item-2",
        contentId: "comic-jungle-part-1",
        contentType: "comic",
        title: "1.1 The Jungle Audit — Part 1 (Clips 01–06 Comic Strip)",
        unitPrice: 399,
        coverUrl: "/media/images/jungle-audit-part-1.jpg",
      },
    ],
    totalAmount: 399,
    currency: "INR",
    status: "payment_successful",
    razorpayOrderId: "order_M771920Kjs11",
    razorpayPaymentId: "pay_Lm9981273618",
    createdAt: "2026-10-08T14:22:00Z",
    verifiedAt: "2026-10-08T14:23:05Z",
  },
  {
    id: "ord-8814",
    orderNumber: "AGY-2026-8814",
    userId: "usr-02",
    customerName: "Clara O'Connor",
    customerEmail: "clara.oc@meridiancap.com",
    items: [
      {
        id: "item-3",
        contentId: "ep-jungle-02",
        contentType: "podcast_episode",
        title: "Ep 2: Clip 01 — The Jungle Is Changing (Host Keynote Cut)",
        unitPrice: 199,
      },
    ],
    totalAmount: 199,
    currency: "INR",
    status: "refunded",
    razorpayOrderId: "order_Ref991823Jk",
    razorpayPaymentId: "pay_Ref88192731",
    createdAt: "2026-10-10T09:12:00Z",
    verifiedAt: "2026-10-10T09:13:00Z",
    refundReason: "Customer upgraded to Season 1 full collector bundle",
  },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    actorEmail: "marcus.vance@vanceholdings.com",
    actorRole: "super_admin",
    action: "CONTENT_PUBLISHED",
    targetRecord: "book-jungle-safari (The AI Jungle Safari Blueprint)",
    timestamp: "2026-10-01T09:30:00Z",
    result: "SUCCESS",
  },
  {
    id: "log-2",
    actorEmail: "sarah.j@financeops.org",
    actorRole: "finance_manager",
    action: "ORDER_REFUND_ISSUED",
    targetRecord: "ord-8814 (₹199)",
    timestamp: "2026-10-10T11:00:00Z",
    result: "SUCCESS",
    metadata: { reason: "Bundle upgrade refund processed" },
  },
  {
    id: "log-3",
    actorEmail: "v.singhania@apexventure.io",
    actorRole: "content_manager",
    action: "EPISODE_CREATED",
    targetRecord: "ep-jungle-01 (1.1 The Jungle Audit Full Pilot)",
    timestamp: "2026-10-08T08:00:00Z",
    result: "SUCCESS",
  },
];
