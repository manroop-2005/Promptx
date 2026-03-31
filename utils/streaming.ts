// utils/streaming.ts
export const streamLLMResponse = async (
  endpoint: string,
  body: object,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  headers: Record<string, string> = {}
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Stream failed (${response.status}): ${message || 'Unknown error'}`);
  }

  const reader = response.body && typeof response.body.getReader === 'function' ? response.body.getReader() : null;
  if (!reader) {
    const rawText = await response.text();

    if (rawText) {
      let normalized = rawText;

      try {
        const parsed = JSON.parse(rawText);
        normalized =
          parsed?.data?.response ||
          parsed?.response ||
          parsed?.data?.aiResponse ||
          parsed?.aiResponse ||
          parsed?.data?.chat?.aiResponse ||
          parsed?.chat?.aiResponse ||
          parsed?.data?.savedPrompt?.aiResponse ||
          parsed?.savedPrompt?.aiResponse ||
          rawText;
      } catch {
        normalized = rawText;
      }

      onChunk(normalized);
    }

    onComplete();
    return;
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      onComplete();
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};