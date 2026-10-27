import { EmployerState } from "@/types/employee.types";

export const INITIAL_EMPLOYER_STATE: EmployerState = {
  organization: {
    name: "Harbor City Church",
    city: "Portland",
    state: "Oregon",
    denomination: "Non-Denominational",
    website: "https://harbor-city-church.example",
    overview:
      "Harbor City Church is a fictional multigenerational congregation serving its neighbors through worship, discipleship, community partnerships, and practical care.",
    verification: "Pending Review",
  },
  listings: [
    {
      id: 1001,
      title: "Community Life Pastor",
      category: "Adult-Ministry",
      city: "Portland",
      state: "Oregon",
      workplace: "Hybrid",
      type: "FULL TIME",
      denomination: "Non-Denominational",
      description:
        "Lead community formation, small groups, and pathways that help people find belonging and grow as disciples.",
      responsibilities:
        "Develop group leaders\nGuide community formation strategy\nPartner with pastoral staff\nSupport care and connection systems",
      qualifications:
        "Five years of ministry leadership\nStrong volunteer development skills\nClear communication and pastoral maturity",
      salaryMin: "62000",
      salaryMax: "74000",
      benefits: "Health stipend, retirement contribution, and paid ministry leave",
      deadline: "2026-12-15",
      applicationInstructions:
        "Submit a resume and optional message through Red Letter Jobs.",
      status: "Draft",
      created: "2026-10-13",
    },
    {
      id: 1002,
      title: "Worship Ministry Director",
      category: "Worship-Arts",
      city: "Portland",
      state: "Oregon",
      workplace: "On-site",
      type: "FULL TIME",
      denomination: "Non-Denominational",
      description:
        "Guide worship gatherings and develop volunteer musicians within a collaborative pastoral team.",
      responsibilities:
        "Plan weekly gatherings\nDevelop musicians and vocalists\nCoordinate worship production",
      qualifications:
        "Local church worship leadership experience\nPastoral and musical maturity",
      salaryMin: "58000",
      salaryMax: "68000",
      benefits: "Health stipend and paid time off",
      deadline: "2026-12-01",
      applicationInstructions:
        "Submit a resume and optional message through Red Letter Jobs.",
      status: "Published",
      created: "2026-10-05",
    },
  ],
  internalNotes: {},
  moderationHistory: {},
}