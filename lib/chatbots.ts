export type Chatbot = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export const CHATBOTS: Chatbot[] = [
  {
    id: "default",
    name: "General Assistant",
    description: "A helpful AI assistant that can answer questions, help with tasks, and provide information on various topics.",
    icon: "💬",
    color: "bg-blue-500",
  },
];

export const CHATBOTS_MAP: Record<string, Chatbot> = CHATBOTS.reduce(
  (acc, bot) => {
    acc[bot.id] = bot;
    return acc;
  },
  {} as Record<string, Chatbot>
);

