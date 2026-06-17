export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  llmModel: process.env.LLM_MODEL || 'anthropic/claude-3.5-sonnet',
};
