import { NativeModules, Platform } from 'react-native';

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin').GoogleSignin;

const getGoogleSigninModule = (): GoogleSigninModule | null => {
	if (Platform.OS === 'web') {
		return null;
	}

	if (!NativeModules.RNGoogleSignin) {
		return null;
	}

	try {
		const { GoogleSignin } = require('@react-native-google-signin/google-signin');
		return GoogleSignin;
	} catch {
		return null;
	}
};



export const configureGoogleSignIn = () => {
	const GoogleSignin = getGoogleSigninModule();
	if (!GoogleSignin) {
		return;
	}

	console.log("google sigin in configred")
	GoogleSignin.configure({
		webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
	});
};


export const googleLogin = async () => {
	const GoogleSignin = getGoogleSigninModule();
	if (!GoogleSignin) {
		throw new Error('Google Sign-In is not available in this build. Use a native development build with Google Sign-In linked.');
	}

	await GoogleSignin.hasPlayServices();
	await GoogleSignin.signOut();
	const userInfo = await GoogleSignin.signIn();
	console.log(" user info in utils function", userInfo)

	const idToken = userInfo.data?.idToken;
	if (!idToken) {
		throw new Error('Google Sign-In failed: missing idToken.');
	}
	
	return {
		idToken,
		user: userInfo.data?.user
	};
};