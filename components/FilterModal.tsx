import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FilterModal = ({ visible, onClose, onApply, currentFilters }: any) => {
	const [filters, setFilters] = useState({
		sortBy: currentFilters.sortBy || "newest",
		price: currentFilters.price || "all",
		rating: currentFilters.rating || "all",
		category: currentFilters.category || "All",
		reaction: currentFilters.reaction || "all",
		saveState: currentFilters.saveState || "all",
	});

	const categoryOptions = ["All", "Writing", "Coding", "Productivity", "Education", "Design", "Marketing", "Fun", "Other"];

	const handleReset = () => {
		const defaultFilters = {
			sortBy: "newest",
			price: "all",
			rating: "all",
			category: "All",
			reaction: "all",
			saveState: "all",
		};
		setFilters(defaultFilters);
		onApply(defaultFilters);
		onClose();
	};
	const slideAnim = useRef(new Animated.Value(0)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		setFilters({
			sortBy: currentFilters.sortBy || "newest",
			price: currentFilters.price || "all",
			rating: currentFilters.rating || "all",
			category: currentFilters.category || "All",
			reaction: currentFilters.reaction || "all",
			saveState: currentFilters.saveState || "all",
		});
	}, [currentFilters, visible]);

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
					easing: Easing.out(Easing.ease),
				}),
				Animated.timing(slideAnim, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
					easing: Easing.out(Easing.back(0.7)),
				}),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
					easing: Easing.in(Easing.ease),
				}),
			]).start();
		}
	}, [visible]);

	const modalTranslateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-600, 0], // Starts 600px above, moves to 0
	});

	const modalScale = slideAnim.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0.9, 1.05, 1],
	});

	const modalOpacity = slideAnim.interpolate({
		inputRange: [0, 0.7, 1],
		outputRange: [0, 0.5, 1],
	});

	const sortOptions = [
		{ id: "newest", label: "Newest First" },
		{ id: "oldest", label: "Oldest First" },
		{ id: "highestRated", label: "Highest Rated" },
		{ id: "mostLiked", label: "Most Liked" },
	];

	const priceOptions = [
		{ id: "all", label: "All Prices" },
		{ id: "free", label: "Free Only" },
		{ id: "paid", label: "Paid Only" },
		{ id: "lowToHigh", label: "Price: Low to High" },
		{ id: "highToLow", label: "Price: High to Low" },
	];

	const ratingOptions = [
		{ id: "all", label: "All Ratings" },
		{ id: "4+", label: "4 Stars & Up" },
		{ id: "3+", label: "3 Stars & Up" },
		{ id: "2+", label: "2 Stars & Up" },
	];

	const reactionOptions = [
		{ id: "all", label: "All Reactions" },
		{ id: "liked", label: "Liked" },
		{ id: "disliked", label: "Disliked" },
	];

	const saveOptions = [
		{ id: "all", label: "All Prompts" },
		{ id: "saved", label: "Saved" },
		{ id: "unsaved", label: "Not Saved" },
	];

	const handleFilterChange = (filterType: any, value: any) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value,
		}));
	};

	const handleApply = () => {
		onApply(filters);
		onClose();
	};

	return (
		<Modal
			transparent={true}
			visible={visible}
			onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<TouchableOpacity
					style={styles.overlayTouchable}
					activeOpacity={1}
					onPress={onClose}
				/>

				<Animated.View
					style={[
						styles.modalContainer,
						{
							transform: [{ translateY: modalTranslateY }, { scale: modalScale }],
							opacity: modalOpacity,
						},
					]}>
					<ScrollView style={styles.modalContent}>
						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Sort By</Text>
							<View style={styles.optionsContainer}>
								{sortOptions.map((option) => (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionButton,
											filters.sortBy === option.id && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("sortBy", option.id)}>
										<Text
											style={[
												styles.optionText,
												filters.sortBy === option.id &&
													styles.selectedOptionText,
											]}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Price Section */}
						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Price</Text>
							<View style={styles.optionsContainer}>
								{priceOptions.map((option) => (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionButton,
											filters.price === option.id && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("price", option.id)}>
										<Text
											style={[
												styles.optionText,
												filters.price === option.id &&
													styles.selectedOptionText,
											]}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Rating Section */}
						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Rating</Text>
							<View style={styles.optionsContainer}>
								{ratingOptions.map((option) => (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionButton,
											filters.rating === option.id && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("rating", option.id)}>
										<Text
											style={[
												styles.optionText,
												filters.rating === option.id &&
													styles.selectedOptionText,
											]}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Category</Text>
							<View style={styles.optionsContainer}>
								{categoryOptions.map((option) => (
									<TouchableOpacity
										key={option}
										style={[
											styles.optionButton,
											filters.category === option && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("category", option)}>
										<Text
											style={[
												styles.optionText,
												filters.category === option &&
													styles.selectedOptionText,
											]}>
											{option}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Reaction</Text>
							<View style={styles.optionsContainer}>
								{reactionOptions.map((option) => (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionButton,
											filters.reaction === option.id && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("reaction", option.id)}>
										<Text
											style={[
												styles.optionText,
												filters.reaction === option.id &&
													styles.selectedOptionText,
											]}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.sectionTitle}>Watchlist</Text>
							<View style={styles.optionsContainer}>
								{saveOptions.map((option) => (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionButton,
											filters.saveState === option.id && styles.selectedOption,
										]}
										onPress={() => handleFilterChange("saveState", option.id)}>
										<Text
											style={[
												styles.optionText,
												filters.saveState === option.id &&
													styles.selectedOptionText,
											]}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</ScrollView>

					<View style={styles.modalFooter}>
						<TouchableOpacity
							style={styles.resetButton}
							onPress={handleReset}>
							<Text style={styles.resetButtonText}>Reset</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.applyButton}
							onPress={handleApply}>
							<LinearGradient
								colors={["#8B5CF6", "#7C3AED"]}
								style={styles.applyGradient}>
								<Text style={styles.applyButtonText}>Apply Filters</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
					<View style={styles.modalHandle} />
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-start",
	},
	overlayTouchable: {
		flex: 1,
		width: "100%",
	},
	modalContainer: {
		backgroundColor: "#FFFFFF",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		maxHeight: "85%",
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
		position: "absolute",
		top: 0,
		left: 0,
		overflow: "hidden",
	},
	modalHandle: {
		width: 40,
		height: 5,
		backgroundColor: "#E2E8F0",
		borderRadius: 3,
		alignSelf: "center",
		marginTop: 5,
		marginBottom: 10,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
	},
	modalTitle: {
		fontSize: 18,
		fontFamily: "Inter-Bold",
		color: "#1E293B",
	},
	closeButton: {
		fontSize: 24,
		color: "#64748B",
	},
	modalContent: {
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	filterSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
		color: "#1E293B",
		marginBottom: 10,
	},
	optionsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	optionButton: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: "#F1F5F9",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	selectedOption: {
		backgroundColor: "#8B5CF6",
		borderColor: "#7C3AED",
	},
	optionText: {
		fontSize: 14,
		fontFamily: "Inter-Medium",
		color: "#475569",
	},
	selectedOptionText: {
		color: "#FFFFFF",
	},
	modalFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#E2E8F0",
	},
	resetButton: {
		flex: 1,
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
		marginRight: 10,
		alignItems: "center",
	},
	resetButtonText: {
		color: "#1E293B",
		fontFamily: "Inter-Medium",
	},
	applyButton: {
		flex: 1,
	},
	applyGradient: {
		padding: 12,
		borderRadius: 12,
		alignItems: "center",
	},
	applyButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-Medium",
	},
});

export default FilterModal;
