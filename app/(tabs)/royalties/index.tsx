import { InnovationService } from "@/api/Innovation";
import CustomHeader from "@/components/CustomHeader";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, Crown, Gavel, TrendingUp } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type DashboardData = {
	split?: { seller: number; platform: number };
	totals?: {
		purchases: number;
		gross: number;
		sellerAmount: number;
		platformAmount: number;
	};
	prompts?: {
		promptId: number;
		title: string;
		purchases: number;
		gross: number;
		sellerAmount: number;
		platformAmount: number;
	}[];
};

export default function RoyaltiesScreen() {
	const [loading, setLoading] = useState(true);
	const [dashboard, setDashboard] = useState<DashboardData | null>(null);
	const [rankings, setRankings] = useState<any[]>([]);
	const [ads, setAds] = useState<any[]>([]);
	const [battles, setBattles] = useState<any[]>([]);

	const [weakPrompt, setWeakPrompt] = useState("");
	const [niche, setNiche] = useState("");
	const [autoTuneResult, setAutoTuneResult] = useState("");

	const [goalText, setGoalText] = useState("");
	const [workflowResult, setWorkflowResult] = useState("");

	const [battlePromptA, setBattlePromptA] = useState("");
	const [battlePromptB, setBattlePromptB] = useState("");
	const [battleInput, setBattleInput] = useState("");
	const [activeBattle, setActiveBattle] = useState<any>(null);

	const [outcomeTitle, setOutcomeTitle] = useState("");
	const [outcomeDescription, setOutcomeDescription] = useState("");
	const [outcomeCategory, setOutcomeCategory] = useState("Marketing");
	const [outcomePrice, setOutcomePrice] = useState("99");
	const [outcomeMetric, setOutcomeMetric] = useState("");
	const [outcomeValue, setOutcomeValue] = useState("");
	const [outcomeProof, setOutcomeProof] = useState("");
	const [outcomeUserPrompt, setOutcomeUserPrompt] = useState("");
	const [outcomeSystemPrompt, setOutcomeSystemPrompt] = useState("");

	const [versionPromptId, setVersionPromptId] = useState("");
	const [versionName, setVersionName] = useState("");
	const [versionScore, setVersionScore] = useState("0");
	const [versionNotes, setVersionNotes] = useState("");
	const [versions, setVersions] = useState<any[]>([]);

	const [forkPromptId, setForkPromptId] = useState("");
	const [forkTitle, setForkTitle] = useState("");
	const [forkRoyalty, setForkRoyalty] = useState("10");

	const loadInitialData = async () => {
		try {
			setLoading(true);
			const [dashboardRes, rankingsRes, adsRes, battlesRes] = await Promise.all([
				InnovationService.getRoyaltyDashboard(),
				InnovationService.getRankings(),
				InnovationService.getSponsoredAds(),
				InnovationService.getBattleHistory(),
			]);

			setDashboard(dashboardRes?.data || null);
			setRankings(rankingsRes?.data || []);
			setAds(adsRes?.data || []);
			setBattles(battlesRes?.data || []);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Failed to load innovation hub",
				text2: error?.message || "Please try again",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadInitialData();
	}, []);

	const runAutoTune = async () => {
		if (!weakPrompt.trim()) return;
		try {
			const response = await InnovationService.autoTunePrompt({ weakPrompt, niche });
			setAutoTuneResult(response?.data?.optimizedResult || "No output");
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Auto-tune failed", text2: error?.message || "Try again" });
		}
	};

	const runVoiceWorkflow = async () => {
		if (!goalText.trim()) return;
		try {
			const response = await InnovationService.voiceToWorkflow({ goalText });
			setWorkflowResult(response?.data?.workflow || "No workflow");
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Workflow failed", text2: error?.message || "Try again" });
		}
	};

	const createBattle = async () => {
		if (!battlePromptA || !battlePromptB || !battleInput.trim()) return;
		try {
			const response = await InnovationService.createBattle({
				promptAId: Number(battlePromptA),
				promptBId: Number(battlePromptB),
				inputText: battleInput,
			});
			setActiveBattle(response?.data);
			Toast.show({ type: "success", text1: "Battle created" });
			loadInitialData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Battle failed", text2: error?.message || "Try again" });
		}
	};

	const voteBattle = async (promptId: number) => {
		if (!activeBattle?.id) return;
		try {
			await InnovationService.voteBattleWinner(activeBattle.id, promptId);
			Toast.show({ type: "success", text1: "Vote recorded" });
			loadInitialData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Vote failed", text2: error?.message || "Try again" });
		}
	};

	const createOutcome = async () => {
		if (!outcomeTitle.trim() || !outcomeDescription.trim()) return;
		try {
			await InnovationService.createOutcomeListing({
				title: outcomeTitle,
				description: outcomeDescription,
				category: outcomeCategory,
				price: Number(outcomePrice || 0),
				outcomeTitle,
				outcomeMetric,
				outcomeValue: Number(outcomeValue || 0),
				outcomeProof,
				userPrompt: outcomeUserPrompt,
				systemPrompt: outcomeSystemPrompt,
				niche,
			});
			Toast.show({ type: "success", text1: "Outcome listing created" });
			setOutcomeTitle("");
			setOutcomeDescription("");
			setOutcomeMetric("");
			setOutcomeValue("");
			setOutcomeProof("");
			setOutcomeUserPrompt("");
			setOutcomeSystemPrompt("");
			loadInitialData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Outcome listing failed", text2: error?.message || "Try again" });
		}
	};

	const createVersion = async () => {
		if (!versionPromptId || !versionName.trim()) return;
		try {
			await InnovationService.createPromptVersion({
				promptId: Number(versionPromptId),
				versionName,
				score: Number(versionScore || 0),
				notes: versionNotes,
				niche,
			});
			Toast.show({ type: "success", text1: "Version added" });
			const response = await InnovationService.getPromptVersionGraph(Number(versionPromptId));
			setVersions(response?.data || []);
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Version failed", text2: error?.message || "Try again" });
		}
	};

	const fetchVersions = async () => {
		if (!versionPromptId) return;
		try {
			const response = await InnovationService.getPromptVersionGraph(Number(versionPromptId));
			setVersions(response?.data || []);
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Graph failed", text2: error?.message || "Try again" });
		}
	};

	const createFork = async () => {
		if (!forkPromptId || !forkTitle.trim()) return;
		try {
			await InnovationService.forkPrompt({
				promptId: Number(forkPromptId),
				title: forkTitle,
				royaltyPercent: Number(forkRoyalty || 10),
			});
			Toast.show({ type: "success", text1: "Fork created" });
			setForkTitle("");
			setForkPromptId("");
			setForkRoyalty("10");
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Fork failed", text2: error?.message || "Try again" });
		}
	};

	return (
		<LinearGradient
			colors={["#F5F7FF", "#E8ECFF"]}
			style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<CustomHeader />
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}>
					{loading ?
						<View style={styles.loaderWrap}>
							<ActivityIndicator
								size='large'
								color='#6941C6'
							/>
						</View>
					:	<ScrollView contentContainerStyle={styles.content}>
							<View style={styles.heroCard}>
								<View style={styles.heroHeadRow}>
									<Crown
										size={18}
										color='#6941C6'
									/>
									<Text style={styles.heroTitle}>Creator Economy Hub</Text>
								</View>
								<Text style={styles.heroSub}>
									Seller gets 60% • Platform gets 40% • Ads show paid prompts
								</Text>
							</View>

							<View style={styles.gridRow}>
								<View style={styles.metricCard}>
									<Text style={styles.metricLabel}>Gross</Text>
									<Text style={styles.metricValue}>
										₹{Number(dashboard?.totals?.gross || 0).toFixed(2)}
									</Text>
								</View>
								<View style={styles.metricCard}>
									<Text style={styles.metricLabel}>Your 60%</Text>
									<Text style={styles.metricValue}>
										₹{Number(dashboard?.totals?.sellerAmount || 0).toFixed(2)}
									</Text>
								</View>
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Sponsored Paid Prompt Ads</Text>
								{ads.slice(0, 3).map((ad) => (
									<View
										key={ad.id}
										style={styles.rowItem}>
										<View style={{ flex: 1 }}>
											<Text style={styles.rowTitle}>{ad.title}</Text>
											<Text style={styles.rowSub}>
												by {ad.author?.name || "Creator"}
											</Text>
										</View>
										<Text style={styles.priceTag}>₹{ad.price}</Text>
									</View>
								))}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Prompt Battle Mode</Text>
								<TextInput
									style={styles.input}
									placeholder='Prompt A ID'
									keyboardType='numeric'
									value={battlePromptA}
									onChangeText={setBattlePromptA}
								/>
								<TextInput
									style={styles.input}
									placeholder='Prompt B ID'
									keyboardType='numeric'
									value={battlePromptB}
									onChangeText={setBattlePromptB}
								/>
								<TextInput
									style={styles.input}
									placeholder='Common input for both prompts'
									value={battleInput}
									onChangeText={setBattleInput}
									multiline
								/>
								<TouchableOpacity
									style={styles.primaryBtn}
									onPress={createBattle}>
									<Text style={styles.primaryBtnText}>Run Battle</Text>
								</TouchableOpacity>
								{activeBattle && (
									<View style={styles.compareWrap}>
										<Text style={styles.compareTitle}>Output A</Text>
										<Text style={styles.outputText}>{activeBattle.outputA}</Text>
										<TouchableOpacity
											style={styles.secondaryBtn}
											onPress={() => voteBattle(activeBattle.promptAId)}>
											<Text style={styles.secondaryBtnText}>Vote A</Text>
										</TouchableOpacity>
										<Text style={styles.compareTitle}>Output B</Text>
										<Text style={styles.outputText}>{activeBattle.outputB}</Text>
										<TouchableOpacity
											style={styles.secondaryBtn}
											onPress={() => voteBattle(activeBattle.promptBId)}>
											<Text style={styles.secondaryBtnText}>Vote B</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Auto-Tune My Prompt</Text>
								<TextInput
									style={styles.input}
									placeholder='Weak prompt'
									value={weakPrompt}
									onChangeText={setWeakPrompt}
									multiline
								/>
								<TextInput
									style={styles.input}
									placeholder='Niche (email, coding, etc.)'
									value={niche}
									onChangeText={setNiche}
								/>
								<TouchableOpacity
									style={styles.primaryBtn}
									onPress={runAutoTune}>
									<Text style={styles.primaryBtnText}>Auto Tune</Text>
								</TouchableOpacity>
								{!!autoTuneResult && <Text style={styles.outputText}>{autoTuneResult}</Text>}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Voice-to-Workflow</Text>
								<TextInput
									style={styles.input}
									placeholder='Goal text from voice input'
									value={goalText}
									onChangeText={setGoalText}
									multiline
								/>
								<TouchableOpacity
									style={styles.primaryBtn}
									onPress={runVoiceWorkflow}>
									<Text style={styles.primaryBtnText}>Generate Workflow</Text>
								</TouchableOpacity>
								{!!workflowResult && <Text style={styles.outputText}>{workflowResult}</Text>}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Outcome-Based Listing</Text>
								<TextInput
									style={styles.input}
									placeholder='Title'
									value={outcomeTitle}
									onChangeText={setOutcomeTitle}
								/>
								<TextInput
									style={styles.input}
									placeholder='Description'
									value={outcomeDescription}
									onChangeText={setOutcomeDescription}
									multiline
								/>
								<TextInput
									style={styles.input}
									placeholder='Category'
									value={outcomeCategory}
									onChangeText={setOutcomeCategory}
								/>
								<TextInput
									style={styles.input}
									placeholder='Price'
									value={outcomePrice}
									onChangeText={setOutcomePrice}
									keyboardType='numeric'
								/>
								<TextInput
									style={styles.input}
									placeholder='Outcome metric (e.g. reply_rate)'
									value={outcomeMetric}
									onChangeText={setOutcomeMetric}
								/>
								<TextInput
									style={styles.input}
									placeholder='Outcome value (e.g. 18)'
									value={outcomeValue}
									onChangeText={setOutcomeValue}
									keyboardType='numeric'
								/>
								<TextInput
									style={styles.input}
									placeholder='Outcome proof URL/text'
									value={outcomeProof}
									onChangeText={setOutcomeProof}
								/>
								<TextInput
									style={styles.input}
									placeholder='User prompt'
									value={outcomeUserPrompt}
									onChangeText={setOutcomeUserPrompt}
									multiline
								/>
								<TextInput
									style={styles.input}
									placeholder='System prompt'
									value={outcomeSystemPrompt}
									onChangeText={setOutcomeSystemPrompt}
									multiline
								/>
								<TouchableOpacity
									style={styles.primaryBtn}
									onPress={createOutcome}>
									<Text style={styles.primaryBtnText}>Create Outcome Listing</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Prompt Version Graph</Text>
								<TextInput
									style={styles.input}
									placeholder='Prompt ID'
									value={versionPromptId}
									onChangeText={setVersionPromptId}
									keyboardType='numeric'
								/>
								<TextInput
									style={styles.input}
									placeholder='Version name'
									value={versionName}
									onChangeText={setVersionName}
								/>
								<TextInput
									style={styles.input}
									placeholder='Score'
									value={versionScore}
									onChangeText={setVersionScore}
									keyboardType='numeric'
								/>
								<TextInput
									style={styles.input}
									placeholder='Notes'
									value={versionNotes}
									onChangeText={setVersionNotes}
									multiline
								/>
								<View style={styles.buttonRow}>
									<TouchableOpacity
										style={[styles.primaryBtn, styles.halfBtn]}
										onPress={createVersion}>
										<Text style={styles.primaryBtnText}>Add Version</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.secondaryBtn, styles.halfBtn]}
										onPress={fetchVersions}>
										<Text style={styles.secondaryBtnText}>Load Graph</Text>
									</TouchableOpacity>
								</View>
								{versions.map((version) => (
									<View
										key={version.id}
										style={styles.versionRow}>
										<TrendingUp
											size={14}
											color='#6941C6'
										/>
										<Text style={styles.versionText}>
											{version.versionName} • {version.modelUsed || "model"} • score{" "}
											{version.score}
										</Text>
									</View>
								))}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Creator Royalties + Forks</Text>
								<TextInput
									style={styles.input}
									placeholder='Original Prompt ID'
									value={forkPromptId}
									onChangeText={setForkPromptId}
									keyboardType='numeric'
								/>
								<TextInput
									style={styles.input}
									placeholder='Fork title'
									value={forkTitle}
									onChangeText={setForkTitle}
								/>
								<TextInput
									style={styles.input}
									placeholder='Royalty percent for origin creator'
									value={forkRoyalty}
									onChangeText={setForkRoyalty}
									keyboardType='numeric'
								/>
								<TouchableOpacity
									style={styles.primaryBtn}
									onPress={createFork}>
									<Text style={styles.primaryBtnText}>Create Fork</Text>
								</TouchableOpacity>
								<Text style={styles.noteText}>
									Revenue split baseline: 60% seller / 40% platform. Fork royalty applies on
									top-chain economics in your business rules.
								</Text>
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Public Ranking + Quality Badges</Text>
								{rankings.slice(0, 8).map((item) => (
									<View
										key={item.id}
										style={styles.rankRow}>
										<Text style={styles.rankNum}>#{item.rank}</Text>
										<View style={{ flex: 1 }}>
											<Text style={styles.rowTitle}>{item.title}</Text>
											<View style={styles.badgeRow}>
												{(item.badges || []).map((badge: string) => (
													<View
														key={badge}
														style={styles.badgePill}>
														<CheckCircle2
															size={12}
															color='#16A34A'
														/>
														<Text style={styles.badgeText}>
															{badge}
														</Text>
													</View>
												))}
											</View>
										</View>
									</View>
								))}
							</View>

							<View style={styles.sectionCard}>
								<Text style={styles.sectionTitle}>Recent Battles</Text>
								{battles.slice(0, 5).map((battle) => (
									<View
										key={battle.id}
										style={styles.battleRow}>
										<Gavel
											size={14}
											color='#7C3AED'
										/>
										<Text style={styles.battleText}>
											{battle.promptA?.title || "A"} vs{" "}
											{battle.promptB?.title || "B"}
											{battle.winner?.title ?
												`• Winner: ${battle.winner.title}`
											:	"• Not voted yet"}
										</Text>
									</View>
								))}
							</View>
						</ScrollView>
					}
				</KeyboardAvoidingView>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FF",
	},
	safeArea: {
		flex: 1,
	},
	loaderWrap: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		paddingHorizontal: 14,
		paddingBottom: 50,
		gap: 12,
	},
	heroCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	heroHeadRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	heroTitle: {
		fontSize: 16,
		color: "#0F172A",
		fontFamily: "Inter-SemiBold",
	},
	heroSub: {
		fontSize: 13,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		marginTop: 6,
	},
	gridRow: {
		flexDirection: "row",
		gap: 10,
	},
	metricCard: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		padding: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	metricLabel: {
		fontSize: 12,
		color: "#64748B",
		fontFamily: "Inter-Regular",
	},
	metricValue: {
		fontSize: 16,
		color: "#0F172A",
		fontFamily: "Inter-SemiBold",
		marginTop: 4,
	},
	sectionCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	sectionTitle: {
		fontSize: 15,
		color: "#0F172A",
		fontFamily: "Inter-SemiBold",
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#CBD5E1",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: Platform.OS === "ios" ? 12 : 10,
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#0F172A",
		marginBottom: 8,
		backgroundColor: "#F8FAFC",
	},
	primaryBtn: {
		backgroundColor: "#6941C6",
		paddingVertical: 11,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 4,
	},
	primaryBtnText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
	},
	secondaryBtn: {
		backgroundColor: "#EEF2FF",
		paddingVertical: 10,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 6,
	},
	secondaryBtnText: {
		color: "#4338CA",
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
	},
	rowItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	rowTitle: {
		fontSize: 14,
		color: "#0F172A",
		fontFamily: "Inter-Medium",
	},
	rowSub: {
		fontSize: 12,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		marginTop: 2,
	},
	priceTag: {
		fontSize: 13,
		color: "#166534",
		fontFamily: "Inter-SemiBold",
		backgroundColor: "#DCFCE7",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 999,
	},
	compareWrap: {
		marginTop: 10,
		gap: 6,
	},
	compareTitle: {
		fontSize: 13,
		color: "#334155",
		fontFamily: "Inter-SemiBold",
	},
	outputText: {
		fontSize: 13,
		lineHeight: 20,
		color: "#1E293B",
		fontFamily: "Inter-Regular",
		backgroundColor: "#F8FAFC",
		borderRadius: 10,
		padding: 10,
		marginTop: 4,
	},
	buttonRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 4,
	},
	halfBtn: {
		flex: 1,
	},
	versionRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingVertical: 6,
	},
	versionText: {
		fontSize: 13,
		color: "#334155",
		fontFamily: "Inter-Regular",
	},
	noteText: {
		fontSize: 12,
		lineHeight: 18,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		marginTop: 8,
	},
	rankRow: {
		flexDirection: "row",
		gap: 10,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	rankNum: {
		fontSize: 13,
		color: "#7C3AED",
		fontFamily: "Inter-SemiBold",
		width: 30,
	},
	badgeRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		marginTop: 4,
	},
	badgePill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: "#F0FDF4",
		borderColor: "#BBF7D0",
		borderWidth: 1,
		borderRadius: 999,
	},
	badgeText: {
		fontSize: 11,
		color: "#166534",
		fontFamily: "Inter-Medium",
	},
	battleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingVertical: 6,
	},
	battleText: {
		fontSize: 13,
		lineHeight: 18,
		color: "#334155",
		fontFamily: "Inter-Regular",
		flex: 1,
	},
});
