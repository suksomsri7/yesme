export interface OpenClawPackage {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  youtubeId: string;
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
  isOnline: boolean;
  brain: {
    model: string;
    provider: string;
  } | null;
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
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet in real-time",
    longDescription: "Give your AI agent the ability to search the web in real-time. It can find current information, verify facts, research topics, and pull data from across the internet to provide accurate, up-to-date responses to user queries.",
    features: ["Real-time Google & Bing search", "Auto-summarize search results", "Source citation with URLs", "Safe search filtering", "Rate limiting & caching"],
    youtubeId: "dQw4w9WgXcQ",
    price: 9,
    manualUrl: "https://docs.openclaw.io/packages/web-search",
    enabled: false,
  },
  {
    id: "code-runner",
    name: "Code Runner",
    description: "Execute code in sandboxed environment",
    longDescription: "Enable your AI agent to write and execute code in a secure sandboxed environment. Supports Python, JavaScript, and more. Perfect for data processing, calculations, and automation tasks that require actual code execution.",
    features: ["Python & JavaScript runtime", "Sandboxed execution environment", "File I/O within sandbox", "Package installation support", "Execution timeout protection"],
    youtubeId: "dQw4w9WgXcQ",
    price: 12,
    manualUrl: "https://docs.openclaw.io/packages/code-runner",
    enabled: false,
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyze data and generate insights",
    longDescription: "Transform raw data into actionable insights. Your AI agent can process CSV files, databases, and APIs to create charts, summaries, and detailed analytical reports. Ideal for business intelligence and reporting automation.",
    features: ["CSV & Excel file parsing", "Statistical analysis", "Chart & visualization generation", "Trend detection", "Export reports as PDF"],
    youtubeId: "dQw4w9WgXcQ",
    price: 15,
    manualUrl: "https://docs.openclaw.io/packages/data-analysis",
    enabled: false,
  },
  {
    id: "image-gen",
    name: "Image Generation",
    description: "Generate images from text prompts",
    longDescription: "Let your AI agent create images from text descriptions using state-of-the-art diffusion models. Generate marketing assets, illustrations, product mockups, and creative content on demand through simple conversation.",
    features: ["Text-to-image generation", "Multiple style presets", "Image editing & variations", "Batch generation", "Commercial usage rights"],
    youtubeId: "dQw4w9WgXcQ",
    price: 18,
    manualUrl: "https://docs.openclaw.io/packages/image-gen",
    enabled: false,
  },
  {
    id: "file-manager",
    name: "File Manager",
    description: "Read, write and manage files",
    longDescription: "Give your AI agent access to read, write, and organize files. It can process documents, manage folder structures, convert file formats, and handle file uploads from users in conversation.",
    features: ["Read & write files", "PDF & document parsing", "File format conversion", "Cloud storage integration", "Drag & drop upload handling"],
    youtubeId: "dQw4w9WgXcQ",
    price: 8,
    manualUrl: "https://docs.openclaw.io/packages/file-manager",
    enabled: false,
  },
  {
    id: "voice-synth",
    name: "Voice Synthesis",
    description: "Convert text to natural speech",
    longDescription: "Add a voice to your AI agent. Convert text responses into natural-sounding speech with multiple voice options and languages. Perfect for voice bots, accessibility features, and audio content creation.",
    features: ["50+ natural voices", "Multi-language support", "Adjustable speed & pitch", "SSML markup support", "Streaming audio output"],
    youtubeId: "dQw4w9WgXcQ",
    price: 14,
    manualUrl: "https://docs.openclaw.io/packages/voice-synth",
    enabled: false,
  },
  {
    id: "translator",
    name: "Translator",
    description: "Translate between 100+ languages",
    longDescription: "Break language barriers with real-time translation. Your AI agent can translate messages, documents, and conversations across 100+ languages while preserving context, tone, and cultural nuances.",
    features: ["100+ language pairs", "Context-aware translation", "Document translation", "Auto language detection", "Glossary & terminology support"],
    youtubeId: "dQw4w9WgXcQ",
    price: 7,
    manualUrl: "https://docs.openclaw.io/packages/translator",
    enabled: false,
  },
  {
    id: "email-sender",
    name: "Email Sender",
    description: "Send and manage emails automatically",
    longDescription: "Automate email workflows with your AI agent. Send transactional emails, newsletters, and notifications. Your agent can compose, schedule, and track emails based on conversation triggers and business logic.",
    features: ["SMTP & API integration", "HTML email templates", "Scheduled sending", "Open & click tracking", "Attachment support"],
    youtubeId: "dQw4w9WgXcQ",
    price: 10,
    manualUrl: "https://docs.openclaw.io/packages/email-sender",
    enabled: false,
  },
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
