import { useAppDispatch } from "@/redux/hook";
import { googleOauth, register } from "@/redux/slices/authSlice";
import { googleLogin } from "@/utils/GoogleSiginIn";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AuthScreen() {
	const dispatch = useAppDispatch();

	const router = useRouter();

	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleGoogleSignIn = async () => {
		try {
			setLoading(true);

			console.log("Starting Google Sign-In");
			const { idToken, user } = await googleLogin();
			console.log(" id toke and user is", idToken, user);

			const result = await dispatch(googleOauth({ idToken, user }));

			console.log(" result of google auth is", result);

			if (googleOauth.fulfilled.match(result)) {
				Toast.show({
					type: "success",
					text1: "Success",
					text2: "registe successful!",
					position: "top",
				});
			}
			setLoading(false);
			router.replace("/(tabs)");
		} catch (err: any) {
			console.error("Google Sign-In Error:", err);
			const errorMessage = err?.errors?.[0]?.message || err?.message || "Unable to sign in with Google.";
			Toast.show({
				type: "error",
				text1: "Google Auth Failed",
				text2: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	const HandleRegisterWithEmail = async () => {
		try {
			setLoading(true);
			if (!email || !password || !name) {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: "Please fill all fields",
				});
				return;
			}

			const response = await dispatch(
				register({
					email,
					password,
					name,
				}),
			);

			if (register.fulfilled.match(response)) {
				Toast.show({
					type: "success",
					text1: "Registration Successful",
					text2: "Welcome!",
				});
				router.replace("/(tabs)");
			} else {
				const payload = response.payload as any;
				const message = typeof payload === "string" ? payload : payload?.message || "Registration failed";
				Toast.show({
					type: "error",
					text1: "Registration Failed",
					text2: message,
				});
				return;
			}

			setLoading(false);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Registration Failed",
				text2: error?.message || "Unable to complete registration",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.authCard}>
					<View style={styles.header}>
						<Text style={styles.title}>Create account</Text>
						<Text style={styles.subtitle}>Join PromptX and start building with AI</Text>
					</View>

					<View style={styles.form}>
						<View style={styles.inputContainer}>
							<Ionicons
								name='person-outline'
								size={20}
								color='#64748B'
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder='Name'
								placeholderTextColor='#94A3B8'
								value={name}
								onChangeText={setName}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
						</View>
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
								keyboardType='email-address'
								autoCapitalize='none'
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
								placeholder='Password'
								placeholderTextColor='#94A3B8'
								value={password}
								onChangeText={setPassword}
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

						<TouchableOpacity
							style={styles.primaryButton}
							onPress={HandleRegisterWithEmail}
							disabled={loading}>
							<Text style={styles.primaryButtonText}>
								{loading ? "Creating account..." : "Create account"}
							</Text>
						</TouchableOpacity>

						<View style={styles.dividerContainer}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>OR</Text>
							<View style={styles.dividerLine} />
						</View>
						<TouchableOpacity
							style={styles.socialButton}
							onPress={handleGoogleSignIn}
							disabled={loading}>
							<Image
								source={require("../../../assets/images/googleicon.png")}
								style={styles.socialIcon}
							/>
							<Text style={styles.socialButtonText}>
								{loading ? "Signing in..." : "Continue with Google"}
							</Text>
						</TouchableOpacity>
					</View>
					<View>
						<Text style={styles.termsText}>
							If you already have an account, then Login
							<TouchableOpacity onPress={() => router.push("/(auth)/login")}>
								<Text
									style={{
										color: "#6366F1",
										marginLeft: 4,
										fontWeight: "bold",
										fontSize: 14,
									}}>
									Login
								</Text>
							</TouchableOpacity>
						</Text>
					</View>
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
		paddingHorizontal: 24,
		paddingBottom: 40,
		justifyContent: "center",
	},
	authCard: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 16,
		padding: 18,
	},
	header: {
		marginBottom: 20,
		alignItems: "center",
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#1E293B",
		fontFamily: "Inter-Bold",
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 14,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		textAlign: "center",
	},
	form: {
		width: "100%",
	},
	socialButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingVertical: 16,
	},
	socialIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	socialButtonText: {
		color: "#1E293B",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 2,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "#E2E8F0",
	},
	dividerText: {
		color: "#64748B",
		fontFamily: "Inter-Medium",
		fontSize: 14,
		marginHorizontal: 12,
	},
	localAuthOptions: {
		gap: 12,
	},
	localAuthButton: {
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
	},
	registerButton: {
		backgroundColor: "#6366F1",
		borderColor: "#6366F1",
	},
	localAuthButtonText: {
		color: "#1E293B",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	registerButtonText: {
		color: "#FFFFFF",
	},
	termsContainer: {
		marginTop: 20,
		paddingHorizontal: 24,
	},
	termsText: {
		color: "#64748B",
		fontFamily: "Inter-Regular",
		fontSize: 12,
		textAlign: "center",
		marginTop: 14,
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
		marginBottom: 8,
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
	primaryButton: {
		backgroundColor: "#6366F1",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		marginBottom: 2,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},

	githubButton: {
		backgroundColor: "#1E293B",
		borderColor: "#1E293B",
	},

	githubButtonText: {
		color: "#FFFFFF",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	footerText: {
		color: "#64748B",
		fontFamily: "Inter-Regular",
		fontSize: 14,
	},
	footerLink: {
		color: "#6366F1",
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		marginLeft: 4,
	},
});
