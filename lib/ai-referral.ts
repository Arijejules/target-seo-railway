export const CONTENT_SIGNAL = "search=yes, ai-train=no, use=reference";

export const AI_REFERENCE_CRAWLER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
] as const;

export const AI_TRAINING_CRAWLER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "meta-externalagent",
  "Diffbot",
  "ImagesiftBot",
  "omgilibot",
  "omgili",
  "YouBot",
  "Timpibot",
  "PanguBot",
] as const;
