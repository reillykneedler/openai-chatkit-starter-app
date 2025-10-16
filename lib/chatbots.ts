export type Chatbot = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  workflowId?: string;
  inDevelopment?: boolean;
  greeting?: string;
};

export const CHATBOTS: Chatbot[] = [
  {
    id: "prospect-research",
    name: "Prospect Research",
    description: "Research prospective clients before your big meeting. You'll receive a business analysis and suggested talking points.",
    icon: "🔬",
    color: "bg-yellow-500",
    category: "Advertising",
    workflowId: "wf_68efd5420f7481909144b6fe71167b370dce823dce57ff5e",
    greeting: "Send me the business name and location to get started.",
  },
  {
    id: "objections-coach",
    name: "Objections Coach",
    description: "Master the art of handling customer objections. Get strategic responses and coaching to overcome common sales objections effectively.",
    icon: "🎯",
    color: "bg-yellow-700",
    category: "Advertising",
    workflowId: "wf_68f004636080819086d40674036907200ed2b4abbf1c03c1",
    greeting: "Share the objection you're facing and I'll help you craft the perfect response.",
  },
  {
    id: "ad-interest-form",
    name: "Ad Interest Form",
    description: "Collect and qualify potential customer interest for advertising opportunities. Gather key information and assess fit for advertising services.",
    icon: "📋",
    color: "bg-yellow-500",
    category: "Advertising",
    workflowId: "wf_68f0c05b19c881909b7184f39704b93904c38c7b4419bdc9",
  },
  {
    id: "campaign-builder",
    name: "Campaign Builder",
    description: "Design comprehensive advertising campaigns from concept to execution. Create messaging strategies, audience targeting, and multi-channel campaign plans.",
    icon: "🚀",
    color: "bg-yellow-600",
    category: "Advertising",
    inDevelopment: true,
  },
  {
    id: "customer-needs-analysis",
    name: "Customer Needs Analysis",
    description: "Unlock deep customer insights and identify pain points. Develop targeted value propositions that resonate with your ideal audience.",
    icon: "🔍",
    color: "bg-amber-600",
    category: "Advertising",
    inDevelopment: true,
  },
  {
    id: "press-release-rewriter",
    name: "Press Release Rewriter",
    description: "Transform press releases into compelling narratives. Refine messaging, enhance clarity, and adapt content for different audiences and media outlets.",
    icon: "📝",
    color: "bg-slate-800",
    category: "Newsroom",
    inDevelopment: true,
  },
  {
    id: "default",
    name: "General Assistant",
    description: "A helpful AI assistant that can answer questions, help with tasks, and provide information on various topics.",
    icon: "💬",
    color: "bg-slate-900",
    category: "General",
    workflowId: "wf_68f01103f2908190a300e5260375387107ffb45d1cf62c9c",
    greeting: "Hello! I'm here to help you with any questions or tasks. How can I assist you today?",
  },
];

export const CHATBOTS_MAP: Record<string, Chatbot> = CHATBOTS.reduce(
  (acc, bot) => {
    acc[bot.id] = bot;
    return acc;
  },
  {} as Record<string, Chatbot>
);

