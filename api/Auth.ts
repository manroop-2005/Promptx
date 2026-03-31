import apiClient from "@/configs/client";

const postWithFallback = async (paths: string[], payload: Record<string, any>) => {
    let lastError: any = null;

    for (const path of paths) {
        try {
            const response = await apiClient.post(path, payload);
            return response.data;
        } catch (error: any) {
            lastError = error;
            if (error?.response?.status !== 404) {
                throw error;
            }
        }
    }

    throw lastError;
};

export const AuthService = {
    async register(data: any) {
    try {
            const response = await apiClient.post("/api/v1/users/register", data);
            console.log(" response from backend is ", response.data)
            return response.data;
    } catch (error: any) {
        const backendMessage = error?.response?.data?.message;
        throw new Error(backendMessage || error?.message || "Registration failed");
    }
    },

    async login(data: any) {
        try {
            const response = await apiClient.post("/api/v1/users/login", data);
            return response.data;
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            throw new Error(backendMessage || error?.message || "Login failed");
        }
    },

    async googleLogin(idToken: string, user: any) {
            const response = await apiClient.post("/api/v1/users/auth/google", { idToken ,user});
            return response.data;
    },


    requestResetOtp: async (email: string) => {
        try {
            return await postWithFallback(
                [
                    "/api/v1/users/forgot-password/request-otp",
                    "/api/v1/users/forgot-password",
                ],
                { email },
            );
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            throw new Error(backendMessage || error?.message || "Failed to request OTP");
        }
    },

    resetPasswordWithOtp: async (email: string, otp: string, newPassword: string) => {
        try {
            return await postWithFallback(
                [
                    "/api/v1/users/forgot-password/reset",
                ],
                {
                    email,
                    otp,
                    newPassword,
                },
            );
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message;
            throw new Error(backendMessage || error?.message || "Failed to reset password");
        }
    },

    forgotPassword: async (email: string) => {
        return AuthService.requestResetOtp(email);
    },
    checkAuthentication: async () => {
            const response = await apiClient.get("/api/v1/check");
            return response.data;
    },
    getUserStatistics:async()=>{
        const response = await apiClient.get('/api/v1/users/getUserStatistics')
        return response.data
    }
}