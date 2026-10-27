export type InfoPage = {
  title: string
  eyebrow: string
  introduction: string
  sections: { heading: string; body: string }[]
  legalReview?: boolean
}

export const INFO_PAGES: Record<string, InfoPage> = {
  "/about-us": {
    title: "About Us",
    eyebrow: "Our mission",
    introduction:
      "Red Letter Jobs helps churches, ministries, and Christian organizations connect with people who are ready to serve.",
    sections: [
      {
        heading: "Purpose-driven hiring",
        body: "We built a focused place for ministry opportunities so employers can reach qualified candidates without getting lost on a general-purpose job board.",
      },
      {
        heading: "For candidates",
        body: "Explore roles by ministry category, denomination, and location to find an opportunity aligned with your experience, gifts, and calling.",
      },
      {
        heading: "For employers",
        body: "Share openings with a ministry-minded audience and give candidates the information they need to discern whether a role is the right fit.",
      },
    ],
  },
  "/pricing": {
    title: "Pricing",
    eyebrow: "Simple options",
    introduction:
      "Choose the level of visibility and support that fits your ministry search. Final pricing and included features are shown before a listing is published.",
    sections: [
      {
        heading: "Candidate access",
        body: "Searching and exploring ministry opportunities is free for job seekers.",
      },
      {
        heading: "Standard listings",
        body: "Publish a complete ministry opening with role details, location, denomination, and application instructions.",
      },
      {
        heading: "Featured visibility",
        body: "Increase exposure for priority searches with featured placement and enhanced visibility across the job board.",
      },
    ],
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    eyebrow: "Your choices",
    introduction:
      "This policy explains how Red Letter Jobs may use cookies and similar technologies to operate and improve the website.",
    sections: [
      {
        heading: "Essential cookies",
        body: "These technologies support core functions such as navigation, security, account access, and saved preferences.",
      },
      {
        heading: "Analytics",
        body: "We may use aggregated usage information to understand which pages and features are most helpful to visitors.",
      },
      {
        heading: "Managing cookies",
        body: "You can limit or remove cookies through your browser settings. Disabling essential cookies may affect some site features.",
      },
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "Protecting your information",
    introduction:
      "This draft placeholder outlines topics expected in a future privacy policy. It is not final legal language.",
    legalReview: true,
    sections: [
      {
        heading: "Information we collect",
        body: "We may collect account details, job-listing information, application activity, communications, and basic technical usage data.",
      },
      {
        heading: "How information is used",
        body: "Information helps us operate accounts, connect candidates and employers, respond to support requests, and protect the platform.",
      },
      {
        heading: "Your choices",
        body: "You may request access to, correction of, or deletion of eligible personal information by contacting our support team.",
      },
    ],
  },
  "/refund-policy": {
    title: "Refund Policy",
    eyebrow: "Fair and transparent",
    introduction:
      "We want employers to understand their purchase and listing options before a ministry opportunity is published.",
    sections: [
      {
        heading: "Before publication",
        body: "If a paid listing has not yet been published, contact us promptly so we can review cancellation and refund options.",
      },
      {
        heading: "Published listings",
        body: "Because publication provides immediate access to job-board visibility, completed listing purchases are generally non-refundable.",
      },
      {
        heading: "Billing issues",
        body: "Duplicate charges or technical billing errors will be reviewed and corrected when verified.",
      },
    ],
  },
  "/terms-of-use": {
    title: "Terms of Use",
    eyebrow: "Using Red Letter Jobs",
    introduction:
      "This draft placeholder outlines topics expected in future terms of use. It is not final legal language.",
    legalReview: true,
    sections: [
      {
        heading: "Accurate information",
        body: "Users are responsible for providing truthful account, organization, job, and application information.",
      },
      {
        heading: "Acceptable use",
        body: "The service may not be used for unlawful activity, misleading listings, harassment, unauthorized data collection, or platform disruption.",
      },
      {
        heading: "Listings and applications",
        body: "Employers make their own hiring decisions, and candidates are responsible for evaluating opportunities before applying or accepting a role.",
      },
    ],
  },
}

