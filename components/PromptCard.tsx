import { Bookmark, BookmarkCheck, Heart, Star, ThumbsDown } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PromptCardProps {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	rating: number;
	likes: number;
	dislikes: number;
	author: string;
	isPurched: boolean;
	reaction: "like" | "dislike" | null;
	isWishlisted: boolean;
	onPress: () => void;
	onLike: () => void;
	onDislike: () => void;
	onToggleWishlist: () => void;
}

export default function PromptCard({
	title,
	description,
	category,
	price,
	rating,
	likes,
	dislikes,
	author,
	isPurched,
	reaction,
	isWishlisted,
	onPress,
	onLike,
	onDislike,
	onToggleWishlist,
}: PromptCardProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.container}
			activeOpacity={0.9}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<View style={styles.categoryBadge}>
						<Text style={styles.categoryText}>{category}</Text>
					</View>
					<View style={styles.pricePill}>
						<Text style={styles.priceText}>{price > 0 ? `₹${price}` : "Free"}</Text>
					</View>
				</View>

				<View style={styles.headerRight}>
					<View style={styles.ratingSection}>
						<Star
							size={14}
							color='#F59E0B'
							fill='#F59E0B'
						/>
						<Text style={styles.rating}>{rating.toFixed(1)}</Text>
					</View>
					<TouchableOpacity
						onPress={onToggleWishlist}
						style={styles.wishlistButton}>
						{isWishlisted ?
							<BookmarkCheck
								size={17}
								color='#4F46E5'
							/>
						:	<Bookmark
								size={17}
								color='#64748B'
							/>
						}
					</TouchableOpacity>
				</View>
			</View>

			<Text style={styles.title}>{title}</Text>
			<Text
				style={styles.description}
				numberOfLines={2}>
				{description}
			</Text>

			<View style={styles.metaRow}>
				<Text style={styles.author}>by {author}</Text>
				<View style={[styles.statusPill, isPurched ? styles.statusSaved : styles.statusFree]}>
					<Text style={[styles.statusText, isPurched ? styles.statusSavedText : styles.statusFreeText]}>
						{isPurched ? "Saved" : "Free"}
					</Text>
				</View>
			</View>

			<View style={styles.actionsRow}>
				<TouchableOpacity
					onPress={onLike}
					style={[styles.reactionButton, reaction === "like" && styles.reactionActive]}>
					<Heart
						size={16}
						color={reaction === "like" ? "#DC2626" : "#64748B"}
						fill={reaction === "like" ? "#DC2626" : "none"}
					/>
					<Text style={[styles.reactionText, reaction === "like" && styles.reactionTextActive]}>{likes}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={onDislike}
					style={[styles.reactionButton, reaction === "dislike" && styles.reactionActive]}>
					<ThumbsDown
						size={16}
						color={reaction === "dislike" ? "#DC2626" : "#64748B"}
					/>
					<Text style={[styles.reactionText, reaction === "dislike" && styles.reactionTextActive]}>{dislikes}</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 14,
		padding: 14,
		borderRadius: 16,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	categoryBadge: {
		backgroundColor: "#EEF2FF",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	categoryText: {
		color: "#4F46E5",
		fontSize: 12,
		fontFamily: "Inter-Medium",
	},
	pricePill: {
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	priceText: {
		color: "#334155",
		fontSize: 12,
		fontFamily: "Inter-SemiBold",
	},
	wishlistButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	title: {
		color: "#1E293B",
		fontSize: 17,
		fontFamily: "Inter-SemiBold",
		marginBottom: 6,
	},
	description: {
		color: "#64748B",
		fontSize: 14,
		fontFamily: "Inter-Regular",
		lineHeight: 20,
		marginBottom: 10,
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	author: {
		color: "#64748B",
		fontSize: 13,
		fontFamily: "Inter-Regular",
	},
	ratingSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFBEB",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	rating: {
		color: "#B45309",
		fontSize: 13,
		fontFamily: "Inter-Medium",
		marginLeft: 4,
	},
	actionsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#EEF2F7",
	},
	reactionButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		borderRadius: 16,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	reactionActive: {
		backgroundColor: "#FEE2E2",
	},
	reactionText: {
		fontSize: 12,
		color: "#475569",
		fontFamily: "Inter-Medium",
		marginLeft: 4,
	},
	reactionTextActive: {
		color: "#DC2626",
	},
	statusPill: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1,
	},
	statusSaved: {
		backgroundColor: "#DCFCE7",
		borderColor: "#BBF7D0",
	},
	statusFree: {
		backgroundColor: "#EEF2FF",
		borderColor: "#C7D2FE",
	},
	statusText: {
		fontSize: 12,
		fontFamily: "Inter-SemiBold",
	},
	statusSavedText: {
		color: "#166534",
	},
	statusFreeText: {
		color: "#4338CA",
	},
});
