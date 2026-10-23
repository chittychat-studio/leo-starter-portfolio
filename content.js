/*
  content.js: every word, link and project on the site lives here.
  Edit this file, save, and refresh the page. You do not need to touch
  index.html, styles.css or main.js unless you want to change the design.

  Tips
  - Text is shown as plain text, so you can type anything safely.
  - Images can be any file in the assets/ folder (SVG, PNG, JPG, WebP).
  - Leave a link as "" to hide its button.
  - Each project gets its own page at #/work/<slug>. Keep slugs short,
    lowercase and with dashes only, for example "tidewater" or "kindred-ui".
*/
window.PORTFOLIO = {
  site: {
    title: "Alex Rivera, product engineer",
    description: "Portfolio of Alex Rivera, a product engineer who builds calm, fast web apps."
  },

  person: {
    name: "Alex Rivera",
    initials: "AR",
    role: "Product engineer",
    location: "Remote, based in Lisbon",
    // The hero line. Keep it to one or two short sentences.
    tagline: "I build calm, fast web apps that people enjoy using every day.",
    avatar: "assets/avatar.svg",
    email: "hello@example.com",
    resume: "" // e.g. "assets/resume.pdf"
  },

  hero: {
    primaryCta: { label: "See selected work", href: "#projects" },
    secondaryCta: { label: "Get in touch", href: "#contact" }
  },

  about: {
    heading: "About",
    paragraphs: [
      "I am a product engineer with seven years of experience shipping web apps for small teams and early stage startups. I enjoy the whole path from a rough idea to a polished feature that real people rely on.",
      "My favourite work sits where design and engineering meet: clear interfaces, quick load times and code that the next person can read. Outside work I run, sketch and teach beginner coding workshops."
    ],
    skillsHeading: "What I work with",
    skills: [
      "JavaScript", "TypeScript", "HTML and CSS", "React", "Node.js",
      "PostgreSQL", "Accessibility", "Design systems", "Testing"
    ]
  },

  // The pinned "how I work" story. The picture on the left changes as each
  // chapter scrolls past. Three to five chapters read best.
  story: {
    heading: "How I work",
    chapters: [
      {
        title: "Listen first",
        text: "Every project starts with the people who will use it. I sit in on support calls, read old tickets and watch someone use the current tool before I write a line of code.",
        image: "assets/study-3.svg",
        imageAlt: "Abstract stack of notes"
      },
      {
        title: "Sketch the smallest version",
        text: "I draw the one screen that matters most, build it quickly and put it in front of real users within a week. Feedback beats guessing.",
        image: "assets/study-1.svg",
        imageAlt: "Abstract wireframe of a small app screen"
      },
      {
        title: "Make it fast and kind",
        text: "Pages load in under a second on a mid range phone. Keyboard, screen reader and reduced motion users get the same product as everyone else.",
        image: "assets/study-2.svg",
        imageAlt: "Abstract line chart rising to the right"
      },
      {
        title: "Leave it better",
        text: "Clear names, small tests and a short README. The next person on the team should be able to ship on their first day.",
        image: "assets/study-4.svg",
        imageAlt: "Abstract grid of tidy shapes"
      }
    ]
  },

  projects: {
    heading: "Selected work",
    intro: "A few things I have designed and built recently. Scroll to browse, open one to read the story.",
    items: [
      {
        slug: "tidewater",
        title: "Tidewater",
        year: "2026",
        role: "Lead engineer",
        client: "Independent surf schools",
        description: "A booking app for small surf schools. Lessons, instructors and payments in one simple screen.",
        image: "assets/project-1.svg",
        imageAlt: "Abstract illustration of waves for the Tidewater project",
        tags: ["React", "Node.js", "Stripe"],
        live: "https://example.com",
        code: "https://github.com/",
        story: [
          "Surf schools juggled bookings across chat apps, spreadsheets and a paper diary. Double bookings were common and instructors found out about lessons the night before.",
          "We built one calm screen that shows the day: lessons, who teaches them and who has paid. Booking a lesson takes three taps, and instructors get a short message the moment their day changes.",
          "Six schools moved over in the first season. Missed lessons dropped to almost none and owners stopped answering booking messages late at night."
        ],
        results: [
          { value: "6", label: "schools in season one" },
          { value: "3 taps", label: "to book a lesson" },
          { value: "0.8 s", label: "first load on a phone" }
        ],
        gallery: [
          { src: "assets/study-1.svg", alt: "Abstract wireframe of the day view", caption: "The day view, sketched before any code." },
          { src: "assets/study-3.svg", alt: "Abstract stack of booking cards", caption: "Booking cards, one per lesson." }
        ]
      },
      {
        slug: "ledgerly",
        title: "Ledgerly",
        year: "2025",
        role: "Solo designer and engineer",
        client: "Personal project",
        description: "A personal budgeting tool that turns bank exports into clear monthly reports.",
        image: "assets/project-2.svg",
        imageAlt: "Abstract bar chart illustration for the Ledgerly project",
        tags: ["TypeScript", "Charts", "CSV"],
        live: "https://example.com",
        code: "https://github.com/",
        story: [
          "Bank apps show transactions, not answers. I wanted to know, in one glance, where a month's money went and whether it was more than usual.",
          "Ledgerly reads the CSV export every bank offers, sorts spending into a few plain categories and draws one report per month. Everything runs in the browser, so no bank data leaves the device.",
          "It now has a few hundred regular users who found it through word of mouth."
        ],
        results: [
          { value: "100%", label: "runs in the browser" },
          { value: "12", label: "bank formats read" },
          { value: "1 page", label: "per monthly report" }
        ],
        gallery: [
          { src: "assets/study-2.svg", alt: "Abstract line chart of monthly spending", caption: "Spending over the year, one line." },
          { src: "assets/study-4.svg", alt: "Abstract grid of categories", caption: "Categories kept to a handful." }
        ]
      },
      {
        slug: "fieldnotes",
        title: "Fieldnotes",
        year: "2024",
        role: "Frontend engineer",
        client: "University research group",
        description: "An offline first notes app for researchers working in places with poor signal.",
        image: "assets/project-3.svg",
        imageAlt: "Abstract stacked sheets illustration for the Fieldnotes project",
        tags: ["PWA", "IndexedDB", "Sync"],
        live: "",
        code: "https://github.com/",
        story: [
          "Field researchers lost notes when a laptop died or a phone had no signal for days.",
          "Fieldnotes saves every keystroke on the device first and syncs when a connection appears. Conflicts are shown side by side, never silently overwritten.",
          "The group has used it on three field trips without losing a single note."
        ],
        results: [
          { value: "0", label: "notes lost on three trips" },
          { value: "Offline", label: "by default" },
          { value: "2 MB", label: "install size" }
        ],
        gallery: [
          { src: "assets/study-3.svg", alt: "Abstract stack of notes", caption: "Notes stack up locally, then sync." },
          { src: "assets/study-1.svg", alt: "Abstract wireframe of the editor", caption: "A plain editor that loads instantly." }
        ]
      },
      {
        slug: "kindred-ui",
        title: "Kindred UI",
        year: "2023",
        role: "Design systems engineer",
        client: "Brightpath",
        description: "A small accessible component library used across four products.",
        image: "assets/project-4.svg",
        imageAlt: "Abstract grid of shapes for the Kindred UI project",
        tags: ["Design system", "Accessibility", "CSS"],
        live: "https://example.com",
        code: "",
        story: [
          "Four product teams had built four slightly different buttons, dialogs and forms, and each one had its own accessibility bugs.",
          "Kindred UI is twenty components with one set of design tokens, tested with a keyboard and a screen reader before every release.",
          "Teams now build new screens in days instead of weeks, and accessibility issues in audits fell sharply."
        ],
        results: [
          { value: "20", label: "components" },
          { value: "4", label: "products using it" },
          { value: "AA", label: "contrast everywhere" }
        ],
        gallery: [
          { src: "assets/study-4.svg", alt: "Abstract grid of components", caption: "One grid, one set of tokens." },
          { src: "assets/study-2.svg", alt: "Abstract chart of audit results", caption: "Audit issues falling release by release." }
        ]
      }
    ]
  },

  // The image gallery that reveals as you scroll. Mix tall and wide images.
  gallery: {
    heading: "Studio notes",
    intro: "Sketches, studies and small experiments from the last year.",
    items: [
      { src: "assets/study-1.svg", alt: "Abstract wireframe study", caption: "Wireframe study", shape: "tall" },
      { src: "assets/study-2.svg", alt: "Abstract chart study", caption: "Chart study", shape: "wide" },
      { src: "assets/study-3.svg", alt: "Abstract notes study", caption: "Notes study", shape: "wide" },
      { src: "assets/study-4.svg", alt: "Abstract grid study", caption: "Grid study", shape: "tall" }
    ]
  },

  experience: {
    heading: "Experience",
    items: [
      {
        role: "Senior product engineer",
        company: "Northwind Studio",
        period: "2023 to now",
        summary: "Lead engineer on a team of five. Rebuilt the customer dashboard and cut page load time by half."
      },
      {
        role: "Frontend engineer",
        company: "Brightpath",
        period: "2020 to 2023",
        summary: "Built the design system and onboarding flow used by more than 40,000 people a month."
      },
      {
        role: "Web developer",
        company: "Freelance",
        period: "2018 to 2020",
        summary: "Designed and built sites and small apps for local businesses, charities and artists."
      }
    ]
  },

  contact: {
    heading: "Let's work together",
    text: "Have a project in mind or just want to say hello? Send me an email and I will reply within two working days."
  },

  // Shown in the footer. Use "" to hide one.
  social: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Mastodon", href: "" }
  ],

  footer: {
    note: "Built with Leo's starter from Replore."
  }
};
