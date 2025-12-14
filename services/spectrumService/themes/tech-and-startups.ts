import type { SpectrumCard } from "../../../types";

export const TECH_AND_STARTUPS_THEME: { name: string; image: string; cards: SpectrumCard[] } = {
  name: 'Tech & Startups',
  image: '/static/themes/tech-and-startups.png',
  cards: [
  { left: "Overengineered", right: "Elegant" },
  { left: "Disruptive", right: "Incremental" },
  { left: "Startup-y", right: "Enterprise-y" },
  { left: "More Buzzwords", right: "More Substance" },
  { left: "Fast to Build", right: "Built to Last" },
  { left: "Founder-Led", right: "Process-Led" },
  { left: "Move Fast", right: "Be Careful" },
  { left: "Nice-to-Have", right: "Must-Have" },
  { left: "Technical Debt", right: "Clean Architecture" },
  { left: "Hyped", right: "Actually Useful" },
  { left: "Scales Poorly", right: "Scales Well" },
  { left: "More Vision", right: "More Execution" },
  { left: "Premature Optimization", right: "Future-Proofing" },
  { left: "Impressive Demo", right: "Solid Product" },
  { left: "Founder Ego", right: "User-Centered" },
  { left: "Over-Abstracted", right: "Concrete" },
  { left: "Hacky", right: "Robust" },
  { left: "Shipped Too Soon", right: "Shipped Too Late" },
  { left: "More Meetings", right: "More Building" },
  { left: "VC-Friendly", right: "Customer-Friendly" }
  ]
};
