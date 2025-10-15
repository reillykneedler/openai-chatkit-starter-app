export type Chatbot = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  workflowId?: string;
};

export const CHATBOTS: Chatbot[] = [
  {
    id: "default",
    name: "General Assistant",
    description: "A helpful AI assistant that can answer questions, help with tasks, and provide information on various topics.",
    icon: "💬",
    color: "bg-slate-900",
    category: "General",
  },
  {
    id: "objection-coach",
    name: "Objection Coach",
    description: "Master sales conversations with AI-powered objection handling strategies. Get instant responses to common objections and build confidence in your pitch.",
    icon: "🎯",
    color: "bg-amber-500",
    category: "Advertising",
  },
  {
    id: "campaign-builder",
    name: "Campaign Builder",
    description: "Design comprehensive advertising campaigns from concept to execution. Create messaging strategies, audience targeting, and multi-channel campaign plans.",
    icon: "🚀",
    color: "bg-yellow-600",
    category: "Advertising",
  },
  {
    id: "customer-needs-analysis",
    name: "Customer Needs Analysis",
    description: "Unlock deep customer insights and identify pain points. Develop targeted value propositions that resonate with your ideal audience.",
    icon: "🔍",
    color: "bg-amber-600",
    category: "Advertising",
  },
  {
    id: "prospect-research",
    name: "Prospect Research",
    description: "Research companies and contacts before meetings. Get insights on business challenges, recent news, key decision makers, and strategic talking points.",
    icon: "🔬",
    color: "bg-yellow-500",
    category: "Advertising",
    workflowId: "wf_68efd5420f7481909144b6fe71167b370dce823dce57ff5e",
  },
  {
    id: "press-release-rewriter",
    name: "Press Release Rewriter",
    description: "Transform press releases into compelling narratives. Refine messaging, enhance clarity, and adapt content for different audiences and media outlets.",
    icon: "📝",
    color: "bg-slate-800",
    category: "Newsroom",
  },
];

export const CHATBOTS_MAP: Record<string, Chatbot> = CHATBOTS.reduce(
  (acc, bot) => {
    acc[bot.id] = bot;
    return acc;
  },
  {} as Record<string, Chatbot>
);

