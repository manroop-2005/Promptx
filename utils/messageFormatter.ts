// utils/messageFormatter.ts

export const formatLLMResponse = (rawResponse: any) => {
	if (!rawResponse || typeof rawResponse !== "string") {
		return "I received your message. How can I help you?";
	}

	let formattedText = rawResponse;

	formattedText = formattedText.replace(/<think>[\s\S]*?<\/think>/gi, "");
	formattedText = formattedText.replace(/<\/?answer>/gi, "");
	formattedText = formattedText.replace(/\r\n/g, "\n");
	formattedText = formattedText.replace(/\\n/g, "\n");
	formattedText = formattedText.replace(/\u00A0/g, " ");
	formattedText = formattedText.replace(/\n{3,}/g, "\n\n");
	formattedText = formattedText.trim();

	if (!formattedText) {
		return "I received your message. How can I assist you?";
	}

	return formattedText;
};

// Advanced formatting for code blocks with syntax highlighting info
export const formatCodeBlock = (code: string, language?: string) => {
	const normalizedLanguage = language ? language.trim().toLowerCase() : "";
	const languagePrefix = normalizedLanguage ? normalizedLanguage : "text";

	return `\n\n\`\`\`${languagePrefix}\n${code}\n\`\`\`\n`;
};