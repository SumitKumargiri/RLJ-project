import { CandidateState } from "@/types/candidate.types";

export const INITIAL_CANDIDATE_STATE: CandidateState = {
  profile: {
    name: "Jordan Ellis",
    city: "Denver",
    state: "Colorado",
    headline: "Discipleship and Community Ministry Leader",
    biography:
      "Ministry leader with eight years of experience developing volunteers, leading small-group systems, and creating welcoming pathways for people to grow in faith and community.",
    denomination: "Non-Denominational",
    theologicalBackground:
      "Evangelical ministry background with an emphasis on biblical formation, collaborative leadership, and local church discipleship.",
    experience:
      "Community Ministry Director — Front Range Fellowship, 2021–Present\nDiscipleship Coordinator — Mercy Hill Church, 2018–2021",
    education: "M.A. in Christian Ministry — Northbridge Seminary, 2021",
    skills:
      "Volunteer development, discipleship strategy, pastoral care, teaching, program leadership",
    credentials:
      "Ordained ministry credential — sample credential for demonstration",
    preferredRoles:
      "Discipleship Pastor, Associate Pastor, Community Outreach Pastor",
    preferredLocations: "Colorado, Texas, Tennessee",
    preferredTypes: ["FULL TIME"],
    portfolio: "https://jordan-ellis.example",
    profileVisible: false,
    resumeVisible: false,
  },
  savedJobIds: [1, 2, 4],
  preferredCategories: [],
  preferredStates: [],
  recommendationsConfigured: false,
  resumeName: "Jordan-Ellis-Ministry-Resume.pdf",
  alertFrequency: "Off",
  applicationUpdates: true,
  messageNotifications: false,
  applications: [
    {
      id: 1,
      jobId: 2,
      applied: "2026-10-10",
      status: "Reviewing",
      note: "Your sample application has been received and is shown here for staging review.",
      candidateName: "Jordan Ellis",
      resumeName: "Jordan-Ellis-Ministry-Resume.pdf",
      message:
        "Hello, my name is Jordan Ellis from Denver, Colorado. I am interested in the Associate Pastor of Discipleship position at Redeemer Fellowship. Thank you for considering my application and resume.",
    },
    {
      id: 2,
      jobId: 1002,
      applied: "2026-10-06",
      status: "New",
      note: "This simulated application has not been delivered to a real employer.",
      candidateName: "Jordan Ellis",
      resumeName: "Jordan-Ellis-Ministry-Resume.pdf",
      message:
        "Hello, my name is Jordan Ellis from Denver, Colorado. I am interested in the Worship Ministry Director position at Harbor City Church. Thank you for considering my application and resume.",
    },
  ],
}