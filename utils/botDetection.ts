const BOT_PATTERNS: RegExp[] = [
  /googlebot/i,
  /bingbot/i,
  /msnbot/i,
  /slurp/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /facebookexternalhit/i,
  /facebookbot/i,
  /twitterbot/i,
  /linkedinbot/i,
  /pinterest/i,
  /applebot/i,
  /petalbot/i,
  /mj12bot/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /rogerbot/i,
  /screaming frog/i,
  /gptbot/i,
  /claudebot/i,
  /anthropic-ai/i,
  /bytespider/i,
  /slackbot/i,
  /discordbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /crawler/i,
  /spider/i,
  /bot\//i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
];

export function isLikelyBot(ua?: string | null): boolean {
  if (!ua) return false;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

export function countBotSignals(): number {
  let signals = 0;
  try {
    if (navigator.webdriver) signals++;
    if (!navigator.languages || navigator.languages.length === 0) signals++;
    if ((navigator as unknown as Record<string, unknown>).plugins !== undefined && (navigator.plugins?.length ?? 0) === 0) signals++;
    if (window.outerWidth === 0 && window.outerHeight === 0) signals++;
    if (!(window as unknown as Record<string, unknown>).chrome && /chrome/i.test(navigator.userAgent)) signals++;
    if (typeof (window as unknown as Record<string, unknown>).__nightmare === "object") signals++;
    if (typeof (window as unknown as Record<string, unknown>).callPhantom === "function") signals++;
    if (typeof (window as unknown as Record<string, unknown>)._phantom === "object") signals++;
    if ((document as unknown as Record<string, unknown>).__selenium_unwrapped !== undefined) signals++;
    if ((document as unknown as Record<string, unknown>).__webdriver_evaluate !== undefined) signals++;
    if ((document as unknown as Record<string, unknown>).__driver_evaluate !== undefined) signals++;
  } catch {}
  return signals;
}
