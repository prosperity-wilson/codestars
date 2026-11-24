export const ORG = {
  email: "codestars.work@gmail.com",
  github: "https://github.com/prosperity-wilson",
  location: "Paynesville, Liberia",
};

export const NAV = [
  { label: "About", to: "/about" },
  { label: "Creative", to: "/creative", children: [
    { label: "Overview", to: "/creative" },
    { label: "Services", to: "/creative/services" },
    { label: "Portfolio", to: "/creative/portfolio" },
    { label: "Hire us", to: "/creative/hire" },
  ] },
  { label: "School", to: "/school", children: [
    { label: "Overview", to: "/school" },
    { label: "Programs", to: "/school/programs" },
    { label: "Apply", to: "/school/apply" },
    { label: "Financial aid", to: "/school/financial-aid" },
  ] },
  { label: "Impact", to: "/impact", children: [
    { label: "Overview", to: "/impact" },
    { label: "Partners", to: "/impact/partners" },
    { label: "Promotions", to: "/promotions" },
    { label: "Submit a promotion", to: "/promotions/submit" },
  ] },
  { label: "Community", to: "/community" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;
