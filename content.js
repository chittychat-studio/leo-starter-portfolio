/*
  content.js: every word, link and project on the site lives here.
  Edit this file, save, and refresh the page. You do not need to touch
  index.html, styles.css or main.js unless you want to change the design.

  Tips
  - Text is shown as plain text, so you can type anything safely.
  - Images can be any file in the assets/ folder (SVG, PNG, JPG, WebP).
  - Leave a link as "" to hide its button.
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

  projects: {
    heading: "Selected work",
    intro: "A few things I have designed and built recently.",
    items: [
      {
        title: "Tidewater",
        year: "2026",
        description: "A booking app for small surf schools. Lessons, instructors and payments in one simple screen.",
        image: "assets/project-1.svg",
        imageAlt: "Abstract illustration of waves for the Tidewater project",
        tags: ["React", "Node.js", "Stripe"],
        live: "https://example.com",
        code: "https://github.com/"
      },
      {
        title: "Ledgerly",
        year: "2025",
        description: "A personal budgeting tool that turns bank exports into clear monthly reports.",
        image: "assets/project-2.svg",
        imageAlt: "Abstract bar chart illustration for the Ledgerly project",
        tags: ["TypeScript", "Charts", "CSV"],
        live: "https://example.com",
        code: "https://github.com/"
      },
      {
        title: "Fieldnotes",
        year: "2024",
        description: "An offline first notes app for researchers working in places with poor signal.",
        image: "assets/project-3.svg",
        imageAlt: "Abstract stacked sheets illustration for the Fieldnotes project",
        tags: ["PWA", "IndexedDB", "Sync"],
        live: "",
        code: "https://github.com/"
      },
      {
        title: "Kindred UI",
        year: "2023",
        description: "A small accessible component library used across four products.",
        image: "assets/project-4.svg",
        imageAlt: "Abstract grid of shapes for the Kindred UI project",
        tags: ["Design system", "Accessibility", "CSS"],
        live: "https://example.com",
        code: ""
      }
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
