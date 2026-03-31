import { Tabs } from "expo-router";
import { Coins, MessageCircle, Plus, Store, User } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Platform, Pressable, View } from "react-native";

type TabName = "index" | "marketplace" | "add" | "royalties" | "profile";

export default function TabLayout() {
	const animationValues = {
		index: useRef(new Animated.Value(0)).current,
		marketplace: useRef(new Animated.Value(0)).current,
		add: useRef(new Animated.Value(0)).current,
		royalties: useRef(new Animated.Value(0)).current,
		profile: useRef(new Animated.Value(0)).current,
	};

	const bgPosition = useRef(new Animated.Value(0)).current;

	const animateTab = (tabName: TabName) => {
		// Reset all animations
		(Object.keys(animationValues) as TabName[]).forEach((key) => {
			Animated.spring(animationValues[key], {
				toValue: key === tabName ? 1 : 0,
				useNativeDriver: true,
			}).start();
		});

		// Animate background position
		const tabIndex = (["index", "marketplace", "add", "royalties", "profile"] as TabName[]).indexOf(tabName);
		Animated.spring(bgPosition, {
			toValue: tabIndex,
			useNativeDriver: true,
			damping: 15,
			stiffness: 100,
		}).start();
	};

	return (
		<View style={{ flex: 1 }}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: "#6941C6",
					tabBarInactiveTintColor: "#667085",
					tabBarStyle: {
						paddingBottom: Platform.OS === "ios" ? 20 : 1,
						height: Platform.OS === "ios" ? 80 : 70,
						borderRadius: 20,
						position: "relative",
						overflow: "visible",
					},
					tabBarLabelStyle: {
						fontSize: 11,
						fontFamily: "Inter-regular",
						marginBottom: Platform.OS === "ios" ? 0 : 5,
					},
					tabBarItemStyle: {
						borderRadius: 20,
						marginHorizontal: 4,
						marginBottom: Platform.OS === "ios" ? 10 : 0,
					},
				}}
				tabBar={({ state, descriptors, navigation }) => (
					<View
						style={{
							backgroundColor: "#F5F7FF",
							borderRadius: 20,
							marginBottom: Platform.OS === "ios" ? 20 : 5,
							height: Platform.OS === "ios" ? 80 : 72,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 4,
							elevation: 5,
							overflow: "visible",
						}}>
						{/* Animated background */}
						<Animated.View />

						<View style={{ flexDirection: "row", flex: 1 }}>
							{state.routes.map((route, index) => {
								const { options } = descriptors[route.key];
								const isFocused = state.index === index;
								const tabName = route.name as TabName;

								const onPress = () => {
									const event = navigation.emit({
										type: "tabPress",
										target: route.key,
										canPreventDefault: true,
									});

									if (!isFocused && !event.defaultPrevented) {
										navigation.navigate(route.name);
										animateTab(tabName);
									}
								};

								const translateY = animationValues[tabName].interpolate({
									inputRange: [0, 1],
									outputRange: [0, -10],
								});

								const scale = animationValues[tabName].interpolate({
									inputRange: [0, 1],
									outputRange: [1, 1.1],
								});

								return (
									<Pressable
										key={route.key}
										accessibilityRole='button'
										accessibilityState={isFocused ? { selected: true } : {}}
										accessibilityLabel={options.tabBarAccessibilityLabel}
										testID={(options as any).tabBarTestID}
										onPress={onPress}
										style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
										<Animated.View
											style={{
												transform: [{ translateY }, { scale }],
												alignItems: "center",
											}}>
											{options.tabBarIcon?.({
												focused: isFocused,
												color: isFocused ? "#6941C6" : "#667085",
												size: 24,
											})}
											<Animated.Text
												style={{
													fontSize: 11,
													fontFamily: "Inter-regular",
													marginTop: 4,
													color: isFocused ? "#6941C6" : "#667085",
													opacity: animationValues[tabName].interpolate(
														{
															inputRange: [0, 1],
															outputRange: [1, 1.2],
														},
													),
												}}>
												{options.title}
											</Animated.Text>
										</Animated.View>
									</Pressable>
								);
							})}
						</View>
					</View>
				)}>
				{/* Your tab screens remain the same */}
				<Tabs.Screen
					name='index'
					options={{
						title: "Chat",
						tabBarIcon: ({ size, color }) => (
							<MessageCircle
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='marketplace'
					options={{
						title: "Marketplace",
						tabBarIcon: ({ size, color }) => (
							<Store
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='add'
					options={{
						title: "",
						tabBarIcon: ({ size, color }) => (
							<View
								style={{
									width: size + 30,
									height: size + 30,
									borderRadius: (size + 30) / 2,
									backgroundColor: "#6941C6",
									justifyContent: "center",
									alignItems: "center",
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}>
								<Plus
									size={size}
									color={"#FFFFFF"}
								/>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='royalties'
					options={{
						title: "Royalties",
						tabBarIcon: ({ size, color }) => (
							<Coins
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: "Profile",
						tabBarIcon: ({ size, color }) => (
							<User
								size={size}
								color={color}
							/>
						),
					}}
				/>
			</Tabs>
		</View>
	);
}
