import { AuthService } from "@/api/Auth";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
	const router = useRouter();
	const params = useLocalSearchParams<{ email?: string }>();

	const [email, setEmail] = useState((params?.email as string) || "");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleRequestOtp = async () => {
		if (!email) {
			Toast.show({
				type: "error",
				text1: "Email required",
				text2: "Enter your email to request OTP",
			});
			return;
		}

		try {
			setLoading(true);
			const response = await AuthService.requestResetOtp(email);
			const responseData = response?.data ?? response;
			const generatedOtp = responseData?.otp;
			Toast.show({
				type: "success",
				text1: "OTP generated",
				text2: generatedOtp ? `Use OTP: ${generatedOtp}` : "OTP generated successfully",
			});
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "OTP failed",
				text2: error?.message || "Could not generate OTP",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (!email || !otp || !newPassword || !confirmPassword) {
			Toast.show({
				type: "error",
				text1: "Missing fields",
				text2: "Fill email, OTP and both password fields",
			});
			return;
		}

		if (newPassword.length < 6) {
			Toast.show({
				type: "error",
				text1: "Weak password",
				text2: "Password must be at least 6 characters",
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			Toast.show({
				type: "error",
				text1: "Mismatch",
				text2: "New password and confirm password do not match",
			});
			return;
		}

		try {
			setLoading(true);
			await AuthService.resetPasswordWithOtp(email, otp, newPassword);
			Toast.show({
				type: "success",
				text1: "Password updated",
				text2: "You can now login with your new password",
			});
			router.replace("/(auth)/login");
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Reset failed",
				text2: error?.message || "Could not reset password",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.card}>
					<Text style={styles.title}>Reset Password</Text>
					<Text style={styles.subtitle}>Request OTP and set your new password</Text>

					<View style={styles.inputContainer}>
						<Ionicons
							name='mail-outline'
							size={20}
							color='#64748B'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder='Email'
							placeholderTextColor='#94A3B8'
							value={email}
							onChangeText={setEmail}
							autoCapitalize='none'
							keyboardType='email-address'
						/>
					</View>

					<TouchableOpacity
						style={styles.secondaryButton}
						onPress={handleRequestOtp}
						disabled={loading}>
						<Text style={styles.secondaryButtonText}>Request OTP</Text>
					</TouchableOpacity>

					<View style={styles.inputContainer}>
						<Ionicons
							name='key-outline'
							size={20}
							color='#64748B'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder='OTP'
							placeholderTextColor='#94A3B8'
							value={otp}
							onChangeText={setOtp}
							keyboardType='number-pad'
							maxLength={6}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Ionicons
							name='lock-closed-outline'
							size={20}
							color='#64748B'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder='New password'
							placeholderTextColor='#94A3B8'
							value={newPassword}
							onChangeText={setNewPassword}
							secureTextEntry={!showPassword}
						/>
						<TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
							<Ionicons
								name={showPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color='#64748B'
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.inputContainer}>
						<Ionicons
							name='shield-checkmark-outline'
							size={20}
							color='#64748B'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder='Confirm new password'
							placeholderTextColor='#94A3B8'
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!showConfirmPassword}
						/>
						<TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
							<Ionicons
								name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color='#64748B'
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.primaryButton}
						onPress={handleResetPassword}
						disabled={loading}>
						<Text style={styles.primaryButtonText}>{loading ? "Updating..." : "Update Password"}</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
						<Text style={styles.backText}>Back to Login</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	container: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 16,
		padding: 18,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#1E293B",
		fontFamily: "Inter-Bold",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		textAlign: "center",
		marginTop: 6,
		marginBottom: 18,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginBottom: 10,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		color: "#1E293B",
		fontFamily: "Inter-Medium",
		fontSize: 16,
	},
	secondaryButton: {
		backgroundColor: "#EEF2FF",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginBottom: 12,
	},
	secondaryButtonText: {
		color: "#4F46E5",
		fontFamily: "Inter-SemiBold",
		fontSize: 15,
	},
	primaryButton: {
		backgroundColor: "#6366F1",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 4,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	backText: {
		marginTop: 14,
		textAlign: "center",
		color: "#6366F1",
		fontFamily: "Inter-Medium",
	},
});
