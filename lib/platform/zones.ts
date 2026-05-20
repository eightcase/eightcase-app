/** App zones — keep routes explicit for navigation and layouts. */
export const ROUTES = {
  marketing: {
    home: "/",
    demo: "/demo",
  },
  funnel: {
    visualisera: "/visualisera",
    drainage: "/drainage",
  },
  admin: {
    root: "/admin",
    campaigns: "/admin/kampanjer",
    campaignNew: "/admin/kampanj",
    leads: "/admin/leads",
    widget: "/admin/widget",
    settings: "/admin/installningar",
  },
  auth: {
    login: "/login",
  },
} as const;
