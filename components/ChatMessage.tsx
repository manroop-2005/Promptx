import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { Copy, Volume2, VolumeX } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [copiedText, setCopiedText] = useState("");
	const speakingRef = useRef(false);

	const speakMessage = () => {
		if (!isUser && !isSpeaking) {
			const cleanMessage = message
				.replace(/```[\s\S]*?```/g, "")
				.replace(/`([^`]+)`/g, "$1")
				.replace(/[>#*_~-]/g, "")
				.replace(/\n\s+/g, "\n")
				.replace(/^\d+\.\s/gm, "")
				.replace(/^[-*+]\s/gm, "")
				.replace(/^---$/gm, "")
				.trim();

			setIsSpeaking(true);
			speakingRef.current = true;

			Speech.speak(cleanMessage, {
				language: "en-US",
				pitch: 1,
				rate: 0.8,
				onDone: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
				onStopped: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
				onError: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
			});
		}
	};

	const stopSpeaking = () => {
		if (isSpeaking || speakingRef.current) {
			Speech.stop();
			setIsSpeaking(false);
			speakingRef.current = false;
		}
	};

	const copyToClipBoard = async (data: string) => {
		await Clipboard.setStringAsync(data);
	};

	return (
		<View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
			{isUser ?
				<View style={styles.userBubble}>
					<Text style={styles.userMessage}>{message}</Text>
				</View>
			:	<View style={styles.aiBubble}>
					<View style={styles.aiMessageContent}>
						<Markdown style={markdownStyles}>{message}</Markdown>
					</View>
					<View style={styles.aiActionsRow}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={isSpeaking ? stopSpeaking : speakMessage}>
							{isSpeaking ?
								<VolumeX
									size={16}
									color='#8B5CF6'
								/>
							:	<Volume2
									size={16}
									color='#8B5CF6'
								/>
							}
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.actionButton, styles.actionButtonSpacing]}
							onPress={() => {
								copyToClipBoard(message);
								setCopiedText("copied");
								setTimeout(() => setCopiedText(""), 1200);
							}}>
							<Copy
								size={16}
								color={copiedText === "copied" ? "#10B981" : "#8B5CF6"}
							/>
						</TouchableOpacity>
					</View>
				</View>
			}
			<Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
				{timestamp.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 6,
		width: "100%",
	},
	userContainer: {
		alignSelf: "stretch",
		alignItems: "flex-end",
	},
	aiContainer: {
		alignSelf: "stretch",
		alignItems: "flex-start",
	},
	userBubble: {
		maxWidth: "90%",
		backgroundColor: "#4F46E5",
		borderRadius: 22,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	aiBubble: {
		width: "100%",
		maxWidth: "98%",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	aiMessageContent: {
		width: "100%",
	},
	aiActionsRow: {
		marginTop: 8,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	actionButton: {
		padding: 6,
		borderRadius: 10,
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	actionButtonSpacing: {
		marginLeft: 6,
	},
	userMessage: {
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Inter-Medium",
		lineHeight: 22,
	},
	timestamp: {
		color: "#9CA3AF",
		fontSize: 11,
		fontFamily: "Inter-Regular",
		marginTop: 5,
	},
	userTimestamp: {
		marginRight: 8,
	},
	aiTimestamp: {
		marginLeft: 6,
	},
});

const markdownStyles = StyleSheet.create({
	body: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Regular",
		lineHeight: 23,
		marginTop: 0,
		marginBottom: 0,
	},
	paragraph: {
		marginTop: 0,
		marginBottom: 8,
	},
	strong: {
		fontFamily: "Inter-SemiBold",
		color: "#0F172A",
	},
	em: {
		fontStyle: "italic",
	},
	code_inline: {
		fontFamily: "Inter-Medium",
		backgroundColor: "#EEF2FF",
		color: "#4F46E5",
		borderRadius: 6,
		paddingHorizontal: 4,
		paddingVertical: 1,
	},
	fence: {
		fontFamily: "Courier New",
		fontSize: 13,
		color: "#374151",
		lineHeight: 18,
	},
	code_block: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderLeftWidth: 3,
		borderLeftColor: "#E2E8F0",
		marginVertical: 6,
	},
	blockquote: {
		borderLeftWidth: 2,
		borderLeftColor: "#D1D5DB",
		paddingLeft: 12,
		marginVertical: 6,
	},
	heading1: {
		fontFamily: "Inter-SemiBold",
		fontSize: 20,
		lineHeight: 28,
		color: "#0F172A",
		marginTop: 2,
		marginBottom: 8,
	},
	heading2: {
		fontFamily: "Inter-SemiBold",
		fontSize: 18,
		lineHeight: 26,
		color: "#0F172A",
		marginTop: 2,
		marginBottom: 8,
	},
	heading3: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		lineHeight: 24,
		color: "#1E293B",
		marginTop: 2,
		marginBottom: 6,
	},
	bullet_list: {
		marginVertical: 4,
	},
	ordered_list: {
		marginVertical: 4,
	},
	hr: {
		backgroundColor: "#E2E8F0",
		height: 1,
		marginVertical: 10,
	},
});
