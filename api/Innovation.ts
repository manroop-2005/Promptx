import apiClient from "@/configs/client";

export const InnovationService = {
	async getRankings() {
		const response = await apiClient.get("/api/v1/innovation/rankings");
		return response.data;
	},

	async getSponsoredAds() {
		const response = await apiClient.get("/api/v1/innovation/ads/sponsored");
		return response.data;
	},

	async createBattle(payload: { promptAId: number; promptBId: number; inputText: string }) {
		const response = await apiClient.post("/api/v1/innovation/battle", payload);
		return response.data;
	},

	async voteBattleWinner(battleId: number, votedPromptId: number) {
		const response = await apiClient.post(`/api/v1/innovation/battle/${battleId}/vote`, { votedPromptId });
		return response.data;
	},

	async getBattleHistory() {
		const response = await apiClient.get("/api/v1/innovation/battle");
		return response.data;
	},

	async autoTunePrompt(payload: { weakPrompt: string; niche?: string }) {
		const response = await apiClient.post("/api/v1/innovation/autotune", payload);
		return response.data;
	},

	async voiceToWorkflow(payload: { goalText: string }) {
		const response = await apiClient.post("/api/v1/innovation/voice-workflow", payload);
		return response.data;
	},

	async createOutcomeListing(payload: {
		title: string;
		description: string;
		category: string;
		price: number;
		userPrompt?: string;
		systemPrompt?: string;
		modelUsed?: string;
		outcomeTitle?: string;
		outcomeMetric?: string;
		outcomeValue?: number;
		outcomeProof?: string;
		niche?: string;
	}) {
		const response = await apiClient.post("/api/v1/innovation/prompts/outcome", payload);
		return response.data;
	},

	async createPromptVersion(payload: {
		promptId: number;
		versionName: string;
		systemPrompt?: string;
		userPrompt?: string;
		modelUsed?: string;
		niche?: string;
		score?: number;
		notes?: string;
	}) {
		const response = await apiClient.post("/api/v1/innovation/prompts/version", payload);
		return response.data;
	},

	async getPromptVersionGraph(promptId: number) {
		const response = await apiClient.get(`/api/v1/innovation/prompts/${promptId}/versions`);
		return response.data;
	},

	async forkPrompt(payload: {
		promptId: number;
		title: string;
		description?: string;
		userPrompt?: string;
		systemPrompt?: string;
		modelUsed?: string;
		royaltyPercent?: number;
	}) {
		const response = await apiClient.post("/api/v1/innovation/prompts/fork", payload);
		return response.data;
	},

	async getRoyaltyDashboard() {
		const response = await apiClient.get("/api/v1/innovation/royalties/dashboard");
		return response.data;
	},
};
