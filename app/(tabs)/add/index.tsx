import { MarketPlaceService } from "@/api/MarketPlace";
import CustomHeader from "@/components/CustomHeader";
import useCloudinaryUpload from "@/hooks/upload";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud, X } from "lucide-react-native";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");

const MODELS = [
	{ label: "GPT-4", value: "gpt-4" },
	{ label: "Llama 3", value: "llama-3" },
	{ label: "Anthropic", value: "anthropic" },
	{ label: "Gemini", value: "gemini" },
	{ label: "Other", value: "other" },
];

const CATEGORIES = ["Writing", "Coding", "Productivity", "Education", "Design", "Marketing", "Fun", "Other"];

export default function AddPromptScreen() {
	const [userPrompt, setUserPrompt] = useState("");
	const [systemPrompt, setSystemPrompt] = useState("");
	const [promptTitle, setPromptTitle] = useState("");
	const [promptDescription, setPromptDescription] = useState("");
	const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
	const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
	const [price, setPrice] = useState("");
	const [isFree, setIsFree] = useState(true);
	const [outputImages, setOutputImages] = useState<string[]>([]);
	const [outputText, setOutputText] = useState("");
	const [niche, setNiche] = useState("");
	const [outcomeTitle, setOutcomeTitle] = useState("");
	const [outcomeMetric, setOutcomeMetric] = useState("");
	const [outcomeValue, setOutcomeValue] = useState("");
	const [outcomeProof, setOutcomeProof] = useState("");
	const [isLoading, setIsloading] = useState(false);
	const { uploadToCloudinary, isUploading } = useCloudinaryUpload();

	const handleImageUpload = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsMultipleSelection: true,
			allowsEditing: false,
			quality: 1,
		});

		if (!result.canceled && result.assets) {
			// Append new images to the existing ones
			Toast.show({ type: "info", text1: "Uploading...", text2: "Uploading files to Cloudinary" });
			const uploadedUrls: string[] = [];
			for (const asset of result.assets) {
				try {
					const uploadResult = await uploadToCloudinary(asset.uri);
					if (uploadResult?.secure_url) {
						uploadedUrls.push(uploadResult.secure_url);
					}
				} catch {
					Toast.show({ type: "error", text1: "Upload failed", text2: "Some files could not be uploaded." });
				}
			}
			setOutputImages((prev) => [...prev, ...uploadedUrls]);
			Toast.show({ type: "success", text1: "Upload complete", text2: "Files uploaded successfully." });
		}
	};

	const handleRemoveImage = (idx: number) => {
		setOutputImages((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleSubmit = async () => {
		if (!promptTitle.trim()) {
			Toast.show({
				type: "error",
				text1: "Enter all the details",
				text2: "Prompt Title is required ",
			});
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			return;
		}
		if (!promptDescription.trim()) {
			Toast.show({
				type: "error",
				text1: "Enter all the details",
				text2: "Prompt Description is required ",
			});
			return;
		}

		if (!userPrompt.trim()) {
			Toast.show({
				type: "error",
				text1: "Enter all the details",
				text2: "User prompt is required ",
			});
			return;
		}
		setIsloading(true);
		try {
			const priceFloat = parseFloat(price);
			const promptData = {
				promptTitle,
				promptDescription,
				userPrompt,
				systemPrompt,
				selectedCategory,
				selectedModel,
				isFree,
				price: priceFloat,
				outputText,
				outputImages,
				niche,
				outcomeTitle,
				outcomeMetric,
				outcomeValue,
				outcomeProof,
			};
			const response = await MarketPlaceService.AddPrompt(promptData);
			if (response.success) {
				Toast.show({
					type: "success",
					text1: "Prompt added successfully",
					text2: "Your prompt has been added to the market!",
				});
			}
			setIsloading(false);

			setPromptTitle("");
			setOutputImages([]);
			setIsFree(false);
			setOutputText("");
			setNiche("");
			setOutcomeTitle("");
			setOutcomeMetric("");
			setOutcomeValue("");
			setOutcomeProof("");
			setPromptDescription("");
			setSelectedCategory(CATEGORIES[0]);
			setSystemPrompt("");
			setUserPrompt("");
			setIsFree(true);
			setSelectedModel(MODELS[0].value);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "failed to add prompt",
				text2: error.message,
			});
			setIsloading(false);
		}
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<CustomHeader />
				<KeyboardAvoidingView
					style={{ flex: 1, paddingBottom: 30 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps='handled'>
						<Text style={styles.title}>Add Your Prompt</Text>

						<View style={styles.section}>
							<View>
								<Text style={styles.label}>
									Prompt Title <Text style={{ color: "#EF4444" }}>*</Text>
								</Text>
								<TextInput
									style={styles.input}
									placeholder='Enter prompt title...'
									value={promptTitle}
									onChangeText={setPromptTitle}
									multiline
									maxLength={500}
									placeholderTextColor='#94A3B8'
								/>
							</View>

							<View style={{ marginTop: height * 0.006 }}>
								<Text style={styles.label}>
									Prompt Description <Text style={{ color: "#EF4444" }}>*</Text>{" "}
								</Text>
								<TextInput
									style={styles.input}
									placeholder='Enter system prompt (optional)...'
									value={promptDescription}
									onChangeText={setPromptDescription}
									multiline
									maxLength={500}
									placeholderTextColor='#94A3B8'
								/>
							</View>
						</View>

						{/* User Prompt  and system prompt*/}
						<View style={styles.section}>
							<View>
								<Text style={styles.label}>
									User Prompt <Text style={{ color: "#EF4444" }}>*</Text>
								</Text>
								<TextInput
									style={styles.input}
									placeholder='Enter your prompt...'
									value={userPrompt}
									onChangeText={setUserPrompt}
									multiline
									placeholderTextColor='#94A3B8'
								/>
							</View>
							<View style={{ marginTop: height * 0.006 }}>
								<Text style={styles.label}>
									System Prompt <Text style={styles.optional}>(optional)</Text>
								</Text>
								<TextInput
									style={styles.input}
									placeholder='Enter system prompt (optional)...'
									value={systemPrompt}
									onChangeText={setSystemPrompt}
									multiline
									maxLength={500}
									placeholderTextColor='#94A3B8'
								/>
							</View>
						</View>

						{/* Model Selection */}
						<View style={styles.section}>
							<Text style={styles.label}>Model Used</Text>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}>
								<View style={styles.modelRow}>
									{MODELS.map((model) => (
										<TouchableOpacity
											key={model.value}
											style={[
												styles.modelButton,
												selectedModel === model.value &&
													styles.modelButtonSelected,
											]}
											onPress={() => setSelectedModel(model.value)}>
											<Text
												style={[
													styles.modelButtonText,
													selectedModel === model.value &&
														styles.modelButtonTextSelected,
												]}>
												{model.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>
						</View>

						{/* Category Selection */}
						<View style={styles.section}>
							<Text style={styles.label}>Category</Text>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}>
								<View style={styles.categoryRow}>
									{CATEGORIES.map((cat) => (
										<TouchableOpacity
											key={cat}
											style={[
												styles.categoryButton,
												selectedCategory === cat &&
													styles.categoryButtonSelected,
											]}
											onPress={() => setSelectedCategory(cat)}>
											<Text
												style={[
													styles.categoryButtonText,
													selectedCategory === cat &&
														styles.categoryButtonTextSelected,
												]}>
												{cat}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>
						</View>

						{/* Price Section */}
						<View style={styles.section}>
							<Text style={styles.label}>Price</Text>
							<View style={styles.priceRow}>
								<TouchableOpacity
									style={[styles.freeButton, isFree && styles.freeButtonActive]}
									onPress={() => setIsFree(true)}>
									<Text style={[styles.freeButtonText, isFree && styles.freeButtonTextActive]}>
										Free
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.freeButton, !isFree && styles.freeButtonActive]}
									onPress={() => setIsFree(false)}>
									<Text style={[styles.freeButtonText, !isFree && styles.freeButtonTextActive]}>
										Paid
									</Text>
								</TouchableOpacity>
								{!isFree && (
									<TextInput
										style={styles.priceInput}
										placeholder='₹ Price'
										value={price}
										onChangeText={setPrice}
										keyboardType='numeric'
										placeholderTextColor='#94A3B8'
									/>
								)}
							</View>
						</View>

						{/* Output Section */}
						<View style={styles.section}>
							<Text style={styles.label}>Output (optional)</Text>
							<View style={styles.outputRow}>
								{isUploading ?
									<View style={styles.uploadButton}>
										<UploadCloud
											size={width * 0.045}
											color='#6366F1'
										/>
										<Text style={styles.uploadButtonText}>Uploading...</Text>
										<View style={{ marginLeft: 8 }}>
											<ActivityIndicator
												size='small'
												color='#6366F1'
											/>
										</View>
									</View>
								:	<TouchableOpacity
										style={styles.uploadButton}
										onPress={handleImageUpload}>
										<UploadCloud
											size={width * 0.045}
											color='#6366F1'
										/>
										<Text style={styles.uploadButtonText}>Upload</Text>
									</TouchableOpacity>
								}
							</View>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								style={{ marginTop: height * 0.01 }}>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									{outputImages.map((img, idx) => (
										<View
											key={idx}
											style={{ marginRight: width * 0.02 }}>
											<Image
												source={{ uri: img }}
												style={styles.outputImage}
											/>
											<TouchableOpacity
												style={styles.cancelImageButton}
												onPress={() => handleRemoveImage(idx)}>
												<X
													size={16}
													color='#fff'
												/>
											</TouchableOpacity>
										</View>
									))}
								</View>
							</ScrollView>
							<TextInput
								style={[styles.input, { marginTop: height * 0.01 }]}
								placeholder='Output text (optional)...'
								value={outputText}
								onChangeText={setOutputText}
								multiline
								maxLength={500}
								placeholderTextColor='#94A3B8'
							/>
						</View>

						<View style={styles.section}>
							<Text style={styles.label}>Outcome-based Listing (optional)</Text>
							<TextInput
								style={styles.input}
								placeholder='Niche (e.g. cold-email, ecommerce, coding)'
								value={niche}
								onChangeText={setNiche}
								placeholderTextColor='#94A3B8'
							/>
							<TextInput
								style={styles.input}
								placeholder='Outcome title (e.g. 18% reply rate campaign)'
								value={outcomeTitle}
								onChangeText={setOutcomeTitle}
								placeholderTextColor='#94A3B8'
							/>
							<TextInput
								style={styles.input}
								placeholder='Outcome metric (e.g. reply_rate)'
								value={outcomeMetric}
								onChangeText={setOutcomeMetric}
								placeholderTextColor='#94A3B8'
							/>
							<TextInput
								style={styles.input}
								placeholder='Outcome value (e.g. 18)'
								value={outcomeValue}
								onChangeText={setOutcomeValue}
								keyboardType='numeric'
								placeholderTextColor='#94A3B8'
							/>
							<TextInput
								style={styles.input}
								placeholder='Outcome proof URL or note'
								value={outcomeProof}
								onChangeText={setOutcomeProof}
								placeholderTextColor='#94A3B8'
							/>
						</View>

						{!isLoading ?
							<TouchableOpacity
								style={styles.submitButton}
								onPress={handleSubmit}>
								<Text style={styles.submitButtonText}>Submit Prompt</Text>
							</TouchableOpacity>
						:	<TouchableOpacity>
								<Text style={styles.submitButtonText}>Submiting </Text>
								<View style={{ marginLeft: 8 }}>
									<ActivityIndicator
										size='small'
										color='#6366F1'
									/>
								</View>
							</TouchableOpacity>
						}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#FFFFFF" },
	safeArea: { flex: 1 },
	scrollContent: { paddingBottom: height * 0.055 },
	title: {
		fontSize: Math.max(width * 0.05, 20),
		color: "#1E293B",
		fontFamily: "Inter-Bold",
		marginLeft: width * 0.06,
		marginBottom: height * 0.009,
		marginTop: height * 0.015,
	},
	outputImage: {
		width: width * 0.12,
		height: width * 0.12,
		borderRadius: width * 0.02,
		marginRight: 0,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	cancelImageButton: {
		position: "absolute",
		top: 2,
		left: 2,
		backgroundColor: "rgba(0,0,0,0.6)",
		borderRadius: 10,
		padding: 2,
		zIndex: 2,
	},
	section: {
		marginBottom: height * 0.01,
		marginHorizontal: width * 0.05,
		borderRadius: width * 0.03,
		padding: width * 0.02,
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	label: {
		color: "#1E293B",
		fontSize: Math.max(width * 0.0375, 13),
		fontFamily: "Inter-SemiBold",
		marginBottom: height * 0.0075,
	},
	optional: {
		color: "#64748B",
		fontSize: Math.max(width * 0.0325, 11),
		fontFamily: "Inter-Regular",
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: width * 0.02,
		padding: width * 0.025,
		fontSize: Math.max(width * 0.0375, 13),
		color: "#1E293B",
		fontFamily: "Inter-Regular",
		minHeight: height * 0.055,
		marginBottom: height * 0.00125,
	},
	modelRow: {
		flexDirection: "row",
	},
	modelButton: {
		backgroundColor: "#E0E7FF",
		paddingHorizontal: width * 0.035,
		paddingVertical: height * 0.0075,
		borderRadius: width * 0.05,
		marginRight: width * 0.02,
		marginBottom: height * 0.005,
	},
	modelButtonSelected: {
		backgroundColor: "#6941C6",
	},
	modelButtonText: {
		color: "#6941C6",
		fontFamily: "Inter-Medium",
		fontSize: Math.max(width * 0.035, 12),
	},
	modelButtonTextSelected: {
		color: "#fff",
	},
	categoryRow: {
		flexDirection: "row",
	},
	categoryButton: {
		backgroundColor: "#E0E7FF",
		paddingHorizontal: width * 0.035,
		paddingVertical: height * 0.0075,
		borderRadius: width * 0.05,
		marginRight: width * 0.02,
		marginBottom: height * 0.005,
	},
	categoryButtonSelected: {
		backgroundColor: "#6941C6",
	},
	categoryButtonText: {
		color: "#6941C6",
		fontFamily: "Inter-Medium",
		fontSize: Math.max(width * 0.035, 12),
	},
	categoryButtonTextSelected: {
		color: "#fff",
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	freeButton: {
		backgroundColor: "#E0E7FF",
		paddingHorizontal: width * 0.04,
		paddingVertical: height * 0.0075,
		borderRadius: width * 0.05,
		marginRight: width * 0.02,
	},
	freeButtonActive: {
		backgroundColor: "#6941C6",
	},
	freeButtonText: {
		color: "#6941C6",
		fontFamily: "Inter-Medium",
		fontSize: Math.max(width * 0.035, 12),
	},
	freeButtonTextActive: {
		color: "#fff",
	},
	priceInput: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: width * 0.02,
		padding: width * 0.01,
		fontSize: Math.max(width * 0.0375, 13),
		color: "#6941C6",
		fontFamily: "Inter-Regular",
		width: width * 0.2,
		marginLeft: width * 0.01,
	},
	outputRow: {
		flexDirection: "row",
	},
	uploadButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E0E7FF",
		borderRadius: width * 0.05,
		paddingHorizontal: width * 0.03,
		paddingVertical: height * 0.0075,
		marginRight: width * 0.02,
	},
	uploadButtonText: {
		color: "#6941C6",
		fontFamily: "Inter-Medium",
		fontSize: Math.max(width * 0.035, 12),
		marginLeft: width * 0.01,
	},
	pdfBadge: {
		backgroundColor: "#F59E0B",
		borderRadius: width * 0.02,
		paddingHorizontal: width * 0.025,
		paddingVertical: height * 0.0075,
		marginRight: width * 0.02,
	},
	pdfBadgeText: {
		color: "#fff",
		fontFamily: "Inter-Bold",
		fontSize: Math.max(width * 0.0325, 11),
	},
	submitButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#6941C6",
		borderRadius: width * 0.06,
		paddingVertical: height * 0.015,
		justifyContent: "center",
		marginHorizontal: width * 0.1,
		marginTop: height * 0.0025,
		gap: width * 0.03,
	},
	submitButtonText: {
		color: "#fff",
		fontFamily: "Inter-SemiBold",
		fontSize: Math.max(width * 0.035, 12),
	},
	successBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#DCFCE7",
		borderRadius: width * 0.03,
		padding: width * 0.035,
		marginHorizontal: width * 0.075,
		marginTop: height * 0.0225,
		justifyContent: "center",
		gap: width * 0.025,
	},
	successText: {
		color: "#22C55E",
		fontFamily: "Inter-SemiBold",
		fontSize: Math.max(width * 0.0375, 13),
	},
});
