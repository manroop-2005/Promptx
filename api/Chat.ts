import { API_URL } from "@/configs/api";
import apiClient from "@/configs/client";
import { streamLLMResponse } from "@/utils/streaming";
import * as SecureStore from "expo-secure-store";

export const ChatService = {
   async getChatHistory() {
      const response = await apiClient.get('/api/v1/chat/history');
      return response.data;
  },

  async sendMessage(request:any) {
      const response = await apiClient.post('/api/v1/chat/send',  request );
      return response.data;
  },

  async sendMessageStream(
    request: any,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
  ) {
    const token = await SecureStore.getItemAsync('authToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = token;
    }

    await streamLLMResponse(
      `${API_URL}/api/v1/chat/send-stream`,
      request,
      onChunk,
      onComplete,
      headers,
    );
  },

  async getPrompts() {
    try {
      const response = await apiClient.get('/prompts');
      return response.data;
    } catch (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
  },
};

