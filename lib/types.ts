export interface OpenClawPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  manualUrl: string;
  enabled: boolean;
}

export interface ChannelConfig {
  id: string;
  type: "telegram" | "whatsapp" | "discord" | "line";
  name: string;
  token: string;
  enabled: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  brain: {
    model: string;
    provider: string;
  };
  limbs: OpenClawPackage[];
  chat: ChannelConfig[];
}

export interface Workspace {
  id: string;
  name: string;
  agents: AIAgent[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
}

export const AI_MODELS: AIModel[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPrice: 2.5, outputPrice: 10 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.6 },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", inputPrice: 10, outputPrice: 30 },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPrice: 3, outputPrice: 15 },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", inputPrice: 15, outputPrice: 75 },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", inputPrice: 0.25, outputPrice: 1.25 },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", inputPrice: 1.25, outputPrice: 5 },
  { id: "gemini-flash", name: "Gemini Flash", provider: "Google", inputPrice: 0.075, outputPrice: 0.3 },
];

export const OPENCLAW_PACKAGES: OpenClawPackage[] = [
  { id: "web-search", name: "Web Search", description: "Search the internet in real-time", price: 9, manualUrl: "https://docs.openclaw.io/packages/web-search", enabled: false },
  { id: "code-runner", name: "Code Runner", description: "Execute code in sandboxed environment", price: 12, manualUrl: "https://docs.openclaw.io/packages/code-runner", enabled: false },
  { id: "data-analysis", name: "Data Analysis", description: "Analyze data and generate insights", price: 15, manualUrl: "https://docs.openclaw.io/packages/data-analysis", enabled: false },
  { id: "image-gen", name: "Image Generation", description: "Generate images from text prompts", price: 18, manualUrl: "https://docs.openclaw.io/packages/image-gen", enabled: false },
  { id: "file-manager", name: "File Manager", description: "Read, write and manage files", price: 8, manualUrl: "https://docs.openclaw.io/packages/file-manager", enabled: false },
  { id: "voice-synth", name: "Voice Synthesis", description: "Convert text to natural speech", price: 14, manualUrl: "https://docs.openclaw.io/packages/voice-synth", enabled: false },
  { id: "translator", name: "Translator", description: "Translate between 100+ languages", price: 7, manualUrl: "https://docs.openclaw.io/packages/translator", enabled: false },
  { id: "email-sender", name: "Email Sender", description: "Send and manage emails automatically", price: 10, manualUrl: "https://docs.openclaw.io/packages/email-sender", enabled: false },
];

export const CHANNEL_TYPES = [
  { type: "telegram" as const, name: "Telegram", color: "#2AABEE" },
  { type: "whatsapp" as const, name: "WhatsApp", color: "#25D366" },
  { type: "discord" as const, name: "Discord", color: "#5865F2" },
  { type: "line" as const, name: "Line", color: "#06C755" },
];

export const AGENT_AVATARS = [
  "/avatars/robot-1.svg",
  "/avatars/robot-2.svg",
  "/avatars/robot-3.svg",
  "/avatars/robot-4.svg",
  "/avatars/robot-5.svg",
  "/avatars/robot-6.svg",
];
