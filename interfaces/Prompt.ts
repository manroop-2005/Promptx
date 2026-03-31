
interface Author {
	name: string;
}

export interface Prompt {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    likesCount: number;
    author: Author;
    content: string;
    userPrompt: string;
    modelUsed: string;
    systemPrompt: string;
    outputImage: string[];
    outputText: string;
    isActivate: boolean;
    runCount?: number;
    consistencyScore?: number;
    hallucinationScore?: number;
    niche?: string;
    outcomeTitle?: string;
    outcomeMetric?: string;
    outcomeValue?: number;
    outcomeProof?: string;
    badges?: string[];
}