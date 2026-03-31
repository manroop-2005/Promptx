import apiClient from "@/configs/client";

export const MarketPlaceService = {
    async AddPrompt(promptData: any) {
        const response = await apiClient.post('/api/v1/marketplace/add-prompt', promptData)
        return response.data
    },
    async getPrompts() {
        const response = await apiClient.get('/api/v1/marketplace/get-prompt');
        return response.data;
    },

    async getPromptById(id: string) {
        const response = await apiClient.get(`/api/v1/marketplace/prompt-by-id/${id}`);
        return response.data;
    },

    async getPromptByQuery(category: string, searchQuery: string) {
        const response = await apiClient.get('/api/v1/marketplace/get-prompt', {
            params: { category, search: searchQuery }
        });
        return response.data;
    },
    async purchasePrompt(promptId: number) {
        const response = await apiClient.post('/api/v1/marketplace/prompts/purchase',
            { promptId }
        );
        return response.data;
    },
    async createRazorpayOrder(orderData: {
    amount: number;
    currency: string;
    receipt: string;
   }) {
    const response =  await apiClient.post('/payments/create-order', orderData);
    return response.data;
  },

  async verifyRazorpayPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    promptId: number;
  }) {
    const response  = await apiClient.post('/payments/verify', paymentData);
    return response.data;
  }

}