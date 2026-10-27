export type Resource = {
  slug: string
  category: string
  title: string
  summary: string
  readTime: string
  sections: [string, string][]
}

export const RESOURCES: Resource[] = [
  {
    slug: "discerning-your-next-ministry-call",
    category: "Career discernment",
    title: "Discerning Your Next Ministry Call",
    summary:
      "A practical framework for evaluating fit, season, theology, and community as you consider a new ministry role.",
    readTime: "6 min read",
    sections: [
      [
        "Begin with clarity",
        "Before reviewing job descriptions, write down the kind of ministry work that gives you energy, the responsibilities you are equipped to carry, and the convictions that should shape your next community.",
      ],
      [
        "Evaluate the whole opportunity",
        "Role scope matters, but so do leadership culture, theological alignment, family considerations, location, expectations, and the health of the organization. Ask specific questions and allow time for honest conversations.",
      ],
      [
        "Invite trusted voices",
        "Discernment is stronger in community. Ask mentors, family members, and ministry peers to help you notice both opportunities and concerns that may be difficult to see on your own.",
      ],
    ],
  },
  {
    slug: "writing-a-clear-ministry-job-description",
    category: "Hiring guidance",
    title: "Writing a Clear Ministry Job Description",
    summary:
      "Help candidates understand your mission, expectations, leadership structure, and measures of success.",
    readTime: "5 min read",
    sections: [
      [
        "Lead with the mission",
        "Explain why the role exists and how it supports the organization’s ministry. A clear purpose gives candidates context for every responsibility that follows.",
      ],
      [
        "Separate needs from preferences",
        "Identify the qualifications that are truly required, then list preferred experience separately. This creates a more focused and accessible search.",
      ],
      [
        "Make expectations concrete",
        "Describe reporting relationships, weekly rhythms, team responsibilities, compensation, and the outcomes you hope to see during the first year.",
      ],
    ],
  },
  {
    slug: "questions-for-a-ministry-interview",
    category: "Interview preparation",
    title: "Questions to Ask in a Ministry Interview",
    summary:
      "Thoughtful prompts for discussing culture, doctrine, leadership, expectations, and congregational health.",
    readTime: "7 min read",
    sections: [
      [
        "Understand leadership culture",
        "Ask how decisions are made, how conflict is handled, and how staff members receive support and feedback. Examples are often more useful than general descriptions.",
      ],
      [
        "Discuss ministry philosophy",
        "Explore how the organization approaches discipleship, pastoral care, outreach, volunteers, and change. Look for alignment as well as room for healthy dialogue.",
      ],
      [
        "Clarify success and support",
        "Ask what success looks like after six and twelve months, which resources are available, and what challenges the previous or current team has experienced.",
      ],
    ],
  },
]

