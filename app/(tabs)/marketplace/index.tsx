import { InnovationService } from "@/api/Innovation";
import { MarketPlaceService } from "@/api/MarketPlace";
import CustomHeader from "@/components/CustomHeader";
import FilterModal from "@/components/FilterModal";
import PromptCard from "@/components/PromptCard";
import { Prompt } from "@/interfaces/Prompt";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { Bookmark, BookmarkCheck, Check, Filter, Search, Star, TrendingUp } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const categories = ["All", "Writing", "Coding", "Productivity", "Education", "Design", "Marketing", "Fun", "Other"];

const LIKED_PROMPTS_KEY = "marketplace_liked_prompts";
const DISLIKED_PROMPTS_KEY = "marketplace_disliked_prompts";
const WISHLIST_PROMPTS_KEY = "marketplace_wishlist_prompts";

type ReactionFilter = "all" | "liked" | "disliked";
type SaveFilter = "all" | "saved" | "unsaved";

const toNumberSet = (rawValue: string | null): Set<number> => {
	if (!rawValue) return new Set<number>();
	try {
		const parsed = JSON.parse(rawValue);
		if (!Array.isArray(parsed)) return new Set<number>();
		return new Set(parsed.map((item) => Number(item)).filter((item) => !Number.isNaN(item)));
	} catch {
		return new Set<number>();
	}
};

export default function MarketplaceScreen() {
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
	const [showPromptModal, setShowPromptModal] = useState(false);
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [loading, setLoading] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [copiedSection, setCopiedSection] = useState<"user" | "system" | null>(null);
	const [sponsoredAds, setSponsoredAds] = useState<any[]>([]);

	const [likedPrompts, setLikedPrompts] = useState<Set<number>>(new Set());
	const [dislikedPrompts, setDislikedPrompts] = useState<Set<number>>(new Set());
	const [wishlistedPrompts, setWishlistedPrompts] = useState<Set<number>>(new Set());

	const [currentFilters, setCurrentFilters] = useState({
		sortBy: "newest",
		price: "all",
		rating: "all",
		category: "All",
		reaction: "all" as ReactionFilter,
		saveState: "all" as SaveFilter,
	});

	const persistPromptState = async (key: string, values: Set<number>) => {
		await SecureStore.setItemAsync(key, JSON.stringify(Array.from(values)));
	};

	useEffect(() => {
		const loadLocalMarketplaceState = async () => {
			const [likedRaw, dislikedRaw, wishlistRaw] = await Promise.all([
				SecureStore.getItemAsync(LIKED_PROMPTS_KEY),
				SecureStore.getItemAsync(DISLIKED_PROMPTS_KEY),
				SecureStore.getItemAsync(WISHLIST_PROMPTS_KEY),
			]);

			setLikedPrompts(toNumberSet(likedRaw));
			setDislikedPrompts(toNumberSet(dislikedRaw));
			setWishlistedPrompts(toNumberSet(wishlistRaw));
		};

		loadLocalMarketplaceState();
	}, []);

	useEffect(() => {
		const loadSponsoredAds = async () => {
			try {
				const response = await InnovationService.getSponsoredAds();
				setSponsoredAds(response?.data || []);
			} catch {
				setSponsoredAds([]);
			}
		};

		loadSponsoredAds();
	}, []);

	const fetchPrompts = useCallback(async () => {
		setLoading(true);
		try {
			const response = await MarketPlaceService.getPromptByQuery(selectedCategory, searchQuery.trim());
			setPrompts(response?.data || []);
		} catch (error: any) {
			if (error?.response?.status === 429) {
				Toast.show({
					type: "error",
					text1: "Rate limit exceeded",
					text2: "You are sending requests too quickly. Please wait and try again.",
				});
			} else {
				Toast.show({
					type: "error",
					text1: "Error fetching prompts",
					text2: "Check your internet connection",
				});
			}
		} finally {
			setLoading(false);
		}
	}, [selectedCategory, searchQuery]);

	useEffect(() => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			fetchPrompts();
		}, 450) as unknown as NodeJS.Timeout;

		return () => {
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		};
	}, [fetchPrompts]);

	const handlePromptPress = (prompt: Prompt) => {
		setSelectedPrompt(prompt);
		setShowPromptModal(true);
	};

	const handleLike = async (promptId: number) => {
		let nextLiked = new Set<number>();
		let nextDisliked = new Set<number>();

		setLikedPrompts((previousLiked) => {
			nextLiked = new Set(previousLiked);
			if (nextLiked.has(promptId)) nextLiked.delete(promptId);
			else nextLiked.add(promptId);
			return nextLiked;
		});

		setDislikedPrompts((previousDisliked) => {
			nextDisliked = new Set(previousDisliked);
			nextDisliked.delete(promptId);
			return nextDisliked;
		});

		await Promise.all([persistPromptState(LIKED_PROMPTS_KEY, nextLiked), persistPromptState(DISLIKED_PROMPTS_KEY, nextDisliked)]);
	};

	const handleDislike = async (promptId: number) => {
		let nextLiked = new Set<number>();
		let nextDisliked = new Set<number>();

		setDislikedPrompts((previousDisliked) => {
			nextDisliked = new Set(previousDisliked);
			if (nextDisliked.has(promptId)) nextDisliked.delete(promptId);
			else nextDisliked.add(promptId);
			return nextDisliked;
		});

		setLikedPrompts((previousLiked) => {
			nextLiked = new Set(previousLiked);
			nextLiked.delete(promptId);
			return nextLiked;
		});

		await Promise.all([persistPromptState(LIKED_PROMPTS_KEY, nextLiked), persistPromptState(DISLIKED_PROMPTS_KEY, nextDisliked)]);
	};

	const handleToggleWishlist = async (promptId: number) => {
		let nextWishlist = new Set<number>();
		setWishlistedPrompts((previousWishlist) => {
			nextWishlist = new Set(previousWishlist);
			if (nextWishlist.has(promptId)) nextWishlist.delete(promptId);
			else nextWishlist.add(promptId);
			return nextWishlist;
		});
		await persistPromptState(WISHLIST_PROMPTS_KEY, nextWishlist);
	};

	const handleCopyPromptText = async (text: string, section: "user" | "system") => {
		const trimmedText = text?.trim();
		if (!trimmedText) return;

		await Clipboard.setStringAsync(trimmedText);
		setCopiedSection(section);
		setTimeout(() => setCopiedSection(null), 1200);

		Toast.show({
			type: "success",
			text1: "Copied",
			text2: `${section === "user" ? "User" : "System"} prompt copied`,
		});
	};

	const handleSavePrompt = () => {
		if (!selectedPrompt) return;
		handleToggleWishlist(selectedPrompt.id);
		Toast.show({
			type: "success",
			text1: "Updated",
			text2: wishlistedPrompts.has(selectedPrompt.id) ? "Removed from watchlist" : "Added to watchlist",
		});
	};

	const filteredPrompts = useMemo(() => {
		let next = [...prompts];

		if (currentFilters.price === "free") {
			next = next.filter((prompt) => Number(prompt.price) === 0);
		} else if (currentFilters.price === "paid") {
			next = next.filter((prompt) => Number(prompt.price) > 0);
		}

		if (currentFilters.rating !== "all") {
			const threshold = Number(currentFilters.rating.replace("+", ""));
			next = next.filter((prompt) => Number(prompt.rating) >= threshold);
		}

		if (currentFilters.reaction === "liked") {
			next = next.filter((prompt) => likedPrompts.has(prompt.id));
		} else if (currentFilters.reaction === "disliked") {
			next = next.filter((prompt) => dislikedPrompts.has(prompt.id));
		}

		if (currentFilters.saveState === "saved") {
			next = next.filter((prompt) => wishlistedPrompts.has(prompt.id));
		} else if (currentFilters.saveState === "unsaved") {
			next = next.filter((prompt) => !wishlistedPrompts.has(prompt.id));
		}

		if (currentFilters.sortBy === "highestRated") {
			next.sort((first, second) => Number(second.rating) - Number(first.rating));
		} else if (currentFilters.sortBy === "mostLiked") {
			next.sort((first, second) => Number(second.likesCount) - Number(first.likesCount));
		} else if (currentFilters.sortBy === "oldest") {
			next.sort((first, second) => first.id - second.id);
		} else {
			next.sort((first, second) => second.id - first.id);
		}

		if (currentFilters.price === "lowToHigh") {
			next.sort((first, second) => Number(first.price) - Number(second.price));
		} else if (currentFilters.price === "highToLow") {
			next.sort((first, second) => Number(second.price) - Number(first.price));
		}

		return next;
	}, [prompts, currentFilters, likedPrompts, dislikedPrompts, wishlistedPrompts]);

	return (
		<LinearGradient
			colors={["#F5F7FF", "#E8ECFF"]}
			style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<CustomHeader />

				<View style={styles.searchContainer}>
					<View style={styles.searchBox}>
						<Search
							size={20}
							color='#64748B'
						/>
						<TextInput
							style={styles.searchInput}
							placeholder='Search prompts...'
							placeholderTextColor='#64748B'
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</View>
					<TouchableOpacity
						style={styles.filterButton}
						onPress={() => setShowFilterModal(true)}>
						<Filter
							size={20}
							color='#8B5CF6'
						/>
					</TouchableOpacity>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.categoriesContainer}
					contentContainerStyle={styles.categoriesContent}>
					{categories.map((category) => (
						<TouchableOpacity
							key={category}
							onPress={() => setSelectedCategory(category)}
							style={[
								styles.categoryButton,
								selectedCategory === category && styles.selectedCategoryButton,
							]}>
							<Text
								style={[
									styles.categoryText,
									selectedCategory === category && styles.selectedCategoryText,
								]}>
								{category}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<TrendingUp
							size={16}
							color='#10B981'
						/>
						<Text style={styles.statText}>{filteredPrompts.length} prompts found</Text>
					</View>
				</View>

				{sponsoredAds.length > 0 && (
					<View style={styles.sponsoredSection}>
						<Text style={styles.sponsoredTitle}>Sponsored Paid Prompts</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.sponsoredContent}>
							{sponsoredAds.slice(0, 6).map((ad) => (
								<TouchableOpacity
									key={ad.id}
									style={styles.sponsoredCard}
									onPress={() => {
										const selected = prompts.find((prompt) => prompt.id === ad.id);
										if (selected) handlePromptPress(selected);
									}}>
									<Text
										style={styles.sponsoredCardTitle}
										numberOfLines={1}>
										{ad.title}
									</Text>
									<Text
										style={styles.sponsoredCardMeta}
										numberOfLines={1}>
										₹{ad.price} • {ad.author?.name || "Creator"}
									</Text>
									{!!ad.outcomeTitle && (
										<Text
											style={styles.sponsoredOutcome}
											numberOfLines={1}>
											{ad.outcomeTitle}
										</Text>
									)}
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				)}

				{loading ?
					<View style={styles.loaderContainer}>
						<ActivityIndicator
							size='large'
							color='#6941C6'
						/>
					</View>
				:	<ScrollView
						style={styles.promptsList}
						contentContainerStyle={styles.promptsContent}>
						{filteredPrompts.map((prompt) => (
							<PromptCard
								key={prompt.id}
								id={prompt.id}
								title={prompt.title}
								description={prompt.description}
								category={prompt.category}
								price={Number(prompt.price || 0)}
								rating={prompt.rating}
								likes={prompt.likesCount + (likedPrompts.has(prompt.id) ? 1 : 0)}
								dislikes={dislikedPrompts.has(prompt.id) ? 1 : 0}
								author={prompt.author.name}
								isPurched={wishlistedPrompts.has(prompt.id)}
								reaction={
									likedPrompts.has(prompt.id) ? "like"
									: dislikedPrompts.has(prompt.id) ?
										"dislike"
									:	null
								}
								isWishlisted={wishlistedPrompts.has(prompt.id)}
								onPress={() => handlePromptPress(prompt)}
								onLike={() => handleLike(prompt.id)}
								onDislike={() => handleDislike(prompt.id)}
								onToggleWishlist={() => handleToggleWishlist(prompt.id)}
							/>
						))}
						{filteredPrompts.length === 0 && (
							<View style={styles.emptyState}>
								<Text style={styles.emptyStateText}>No prompts found.</Text>
							</View>
						)}
					</ScrollView>
				}

				<Modal
					visible={showPromptModal}
					transparent
					animationType='slide'
					onRequestClose={() => setShowPromptModal(false)}>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<View style={styles.modalHandle} />

							<ScrollView style={styles.modalScroll}>
								<Text style={styles.modalTitle}>{selectedPrompt?.title}</Text>

								<View style={styles.modalTagRow}>
									<View style={styles.modalCategory}>
										<Text style={styles.modelCategoryText}>
											{selectedPrompt?.category}
										</Text>
									</View>
									<View style={styles.modalCategory}>
										<Text style={styles.modelCategoryText}>
											{selectedPrompt?.modelUsed || "AI"}
										</Text>
									</View>
								</View>

								<View style={styles.metaGrid}>
									<View style={styles.metaItem}>
										<Text style={styles.metaLabel}>Author</Text>
										<Text style={styles.metaValue}>
											{selectedPrompt?.author?.name || "Unknown"}
										</Text>
									</View>
									<View style={styles.metaItem}>
										<Text style={styles.metaLabel}>Rating</Text>
										<View style={styles.metaRatingRow}>
											<Star
												size={14}
												color='#F59E0B'
												fill='#F59E0B'
											/>
											<Text style={styles.metaValue}>
												{Number(selectedPrompt?.rating || 0).toFixed(1)}
											</Text>
										</View>
									</View>
									<View style={styles.metaItem}>
										<Text style={styles.metaLabel}>Price</Text>
										<Text style={styles.metaValue}>
											{Number(selectedPrompt?.price || 0) > 0 ?
												`₹${selectedPrompt?.price}`
											:	"Free"}
										</Text>
									</View>
								</View>

								{(selectedPrompt?.outcomeTitle ||
									selectedPrompt?.outcomeMetric ||
									selectedPrompt?.outcomeValue) && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>Outcome</Text>
										<View style={styles.menuItem}>
											<Text style={styles.menuText}>
												{selectedPrompt?.outcomeTitle ||
													"Result-driven listing"}
												{selectedPrompt?.outcomeMetric ?
													`\nMetric: ${selectedPrompt.outcomeMetric}`
												:	""}
												{typeof selectedPrompt?.outcomeValue === "number" ?
													`\nValue: ${selectedPrompt.outcomeValue}`
												:	""}
												{selectedPrompt?.outcomeProof ?
													`\nProof: ${selectedPrompt.outcomeProof}`
												:	""}
											</Text>
										</View>
									</View>
								)}

								<View style={styles.section}>
									<Text style={styles.sectionTitle}>Description</Text>
									<View style={styles.menuItem}>
										<Text style={styles.menuText}>{selectedPrompt?.description}</Text>
									</View>
								</View>

								{Boolean(selectedPrompt?.outputText?.trim()) && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>Text Output</Text>
										<View style={styles.menuItem}>
											<Text style={styles.menuText}>
												{selectedPrompt?.outputText}
											</Text>
										</View>
									</View>
								)}

								{Array.isArray(selectedPrompt?.outputImage) &&
									selectedPrompt.outputImage.length > 0 && (
										<View style={styles.section}>
											<Text style={styles.sectionTitle}>Image Output</Text>
											<ScrollView
												horizontal
												showsHorizontalScrollIndicator={false}>
												{selectedPrompt.outputImage.map((imageUrl, index) => (
													<Image
														key={`image-${index}`}
														source={{ uri: imageUrl }}
														style={styles.outputImage}
														resizeMode='cover'
													/>
												))}
											</ScrollView>
										</View>
									)}

								{Boolean(selectedPrompt?.userPrompt?.trim()) && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>User Prompt</Text>
										<View style={styles.menuItem}>
											<Text style={styles.menuText}>
												{selectedPrompt?.userPrompt}
											</Text>
											<TouchableOpacity
												onPress={() =>
													handleCopyPromptText(
														selectedPrompt?.userPrompt || "",
														"user",
													)
												}
												style={styles.copyButton}>
												{copiedSection === "user" ?
													<Check
														size={16}
														color='#22C55E'
													/>
												:	<Text style={styles.copyButtonText}>Copy</Text>}
											</TouchableOpacity>
										</View>
									</View>
								)}

								{Boolean(selectedPrompt?.systemPrompt?.trim()) && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>System Prompt</Text>
										<View style={styles.menuItem}>
											<Text style={styles.menuText}>
												{selectedPrompt?.systemPrompt}
											</Text>
											<TouchableOpacity
												onPress={() =>
													handleCopyPromptText(
														selectedPrompt?.systemPrompt || "",
														"system",
													)
												}
												style={styles.copyButton}>
												{copiedSection === "system" ?
													<Check
														size={16}
														color='#22C55E'
													/>
												:	<Text style={styles.copyButtonText}>Copy</Text>}
											</TouchableOpacity>
										</View>
									</View>
								)}
							</ScrollView>

							<View style={styles.modalActions}>
								<TouchableOpacity
									onPress={() => setShowPromptModal(false)}
									style={styles.cancelButton}>
									<Text style={styles.cancelButtonText}>Close</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleSavePrompt}
									style={styles.useButton}>
									<LinearGradient
										colors={["#4F46E5", "#4338CA"]}
										style={styles.useGradient}>
										<View style={styles.saveButtonInner}>
											{selectedPrompt && wishlistedPrompts.has(selectedPrompt.id) ?
												<BookmarkCheck
													size={16}
													color='#FFFFFF'
												/>
											:	<Bookmark
													size={16}
													color='#FFFFFF'
												/>
											}
											<Text style={styles.useButtonText}>
												{(
													selectedPrompt &&
													wishlistedPrompts.has(selectedPrompt.id)
												) ?
													"Added"
												:	"Add to Watchlist"}
											</Text>
										</View>
									</LinearGradient>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<FilterModal
					visible={showFilterModal}
					onClose={() => setShowFilterModal(false)}
					onApply={(filters: any) => {
						setCurrentFilters(filters);
						if (filters?.category && filters.category !== selectedCategory) setSelectedCategory(filters.category);
						setShowFilterModal(false);
					}}
					currentFilters={currentFilters}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	safeArea: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	searchContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		marginBottom: 10,
		marginTop: 4,
		gap: 8,
	},
	searchBox: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 14,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	searchInput: {
		flex: 1,
		color: "#1E293B",
		fontSize: 16,
		fontFamily: "Inter-Regular",
		marginLeft: 10,
	},
	filterButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		padding: 12,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	categoriesContainer: {
		maxHeight: 40,
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	categoriesContent: {
		paddingRight: 20,
	},
	categoryButton: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 18,
		backgroundColor: "#F1F5F9",
		marginRight: 10,
	},
	selectedCategoryButton: {
		backgroundColor: "#4F46E5",
	},
	categoryText: {
		color: "#475569",
		fontSize: 13,
		fontFamily: "Inter-Medium",
	},
	selectedCategoryText: {
		color: "#FFFFFF",
	},
	statsContainer: {
		paddingHorizontal: 18,
		marginBottom: 12,
	},
	sponsoredSection: {
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	sponsoredTitle: {
		fontSize: 14,
		color: "#1E293B",
		fontFamily: "Inter-SemiBold",
		marginBottom: 8,
	},
	sponsoredContent: {
		paddingRight: 10,
	},
	sponsoredCard: {
		width: 210,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 10,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	sponsoredCardTitle: {
		fontSize: 13,
		color: "#0F172A",
		fontFamily: "Inter-SemiBold",
	},
	sponsoredCardMeta: {
		fontSize: 12,
		color: "#64748B",
		fontFamily: "Inter-Regular",
		marginTop: 4,
	},
	sponsoredOutcome: {
		fontSize: 12,
		color: "#166534",
		fontFamily: "Inter-Medium",
		marginTop: 6,
	},
	statItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	statText: {
		color: "#10B981",
		fontSize: 14,
		fontFamily: "Inter-Medium",
		marginLeft: 8,
	},
	promptsList: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: "#F8FAFC",
	},
	promptsContent: {
		paddingBottom: 120,
	},
	loaderContainer: {
		backgroundColor: "#F8FAFC",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyState: {
		alignItems: "center",
		marginTop: 40,
	},
	emptyStateText: {
		color: "#64748B",
		fontSize: 16,
		fontFamily: "Inter-Medium",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.45)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 22,
		borderTopRightRadius: 22,
		maxHeight: "88%",
		paddingBottom: 16,
	},
	modalHandle: {
		width: 44,
		height: 5,
		backgroundColor: "#E2E8F0",
		borderRadius: 3,
		alignSelf: "center",
		marginTop: 8,
		marginBottom: 4,
	},
	modalScroll: {
		paddingHorizontal: 18,
	},
	modalTitle: {
		color: "#0F172A",
		fontSize: 22,
		fontFamily: "Inter-Bold",
		marginBottom: 10,
	},
	modalTagRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 10,
	},
	modalCategory: {
		backgroundColor: "#EEF2FF",
		minWidth: 90,
		paddingVertical: 7,
		paddingHorizontal: 10,
		borderRadius: 16,
	},
	modelCategoryText: {
		color: "#4338CA",
		fontSize: 13,
		fontFamily: "Inter-Medium",
		alignSelf: "center",
	},
	metaGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
		marginBottom: 10,
	},
	metaItem: {
		flex: 1,
		backgroundColor: "#F8FAFC",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 8,
	},
	metaLabel: {
		color: "#64748B",
		fontSize: 12,
		fontFamily: "Inter-Medium",
		marginBottom: 4,
	},
	metaValue: {
		color: "#1E293B",
		fontSize: 13,
		fontFamily: "Inter-SemiBold",
	},
	metaRatingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	section: {
		marginBottom: 10,
		borderRadius: 12,
		padding: 10,
		backgroundColor: "#F8FAFC",
	},
	sectionTitle: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-SemiBold",
		marginBottom: 8,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
	},
	menuText: {
		color: "#1E293B",
		fontSize: 14,
		fontFamily: "Inter-Regular",
		flex: 1,
		lineHeight: 20,
	},
	outputImage: {
		width: 220,
		height: 220,
		borderRadius: 14,
		backgroundColor: "#E2E8F0",
		marginRight: 10,
	},
	copyButton: {
		backgroundColor: "#E0E7FF",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginLeft: 8,
	},
	copyButtonText: {
		color: "#4338CA",
		fontFamily: "Inter-Medium",
		fontSize: 12,
	},
	modalActions: {
		flexDirection: "row",
		paddingHorizontal: 18,
		gap: 10,
		marginTop: 2,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
		backgroundColor: "#EEF2FF",
	},
	cancelButtonText: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Medium",
	},
	useButton: {
		flex: 1.4,
	},
	useGradient: {
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
	},
	saveButtonInner: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	useButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
	},
});
