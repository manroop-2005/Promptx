import { toastConfig } from "@/configs/toast-config";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { checkAuth } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { configureGoogleSignIn } from "@/utils/GoogleSiginIn";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

function AppContent() {
	useFrameworkReady();
	const dispatch = useAppDispatch();
	const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

	useEffect(() => {
		configureGoogleSignIn();
		dispatch(checkAuth());
	}, [dispatch]);

	const [fontsLoaded, fontError] = useFonts({
		"Inter-Regular": Inter_400Regular,
		"Inter-Medium": Inter_500Medium,
		"Inter-SemiBold": Inter_600SemiBold,
		"Inter-Bold": Inter_700Bold,
	});

	console.log("Auth Debug:", {
		isAuthenticated,
		loading,
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	console.log("Rendering navigation - isAuthenticated:", isAuthenticated);

	return (
		<View style={{ flex: 1 }}>
			<Stack
				key={isAuthenticated ? "authed" : "guest"}
				initialRouteName={isAuthenticated ? "(tabs)" : "(auth)"}
				screenOptions={{ headerShown: false }}>
				<Stack.Screen name='(auth)' />
				<Stack.Screen name='(tabs)' />
			</Stack>
			<Toast
				config={toastConfig}
				position='top'
				visibilityTime={4000}
				autoHide={true}
			/>
		</View>
	);
}

export default function RootLayout() {
	return (
		<Provider store={store}>
			<AppContent />
		</Provider>
	);
}
