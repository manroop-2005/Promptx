import { useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomHeader = () => {

    const user  = useAppSelector((state:RootState)=>state.user)

    return (
        <View style={styles.headerContainer}>
            {/* Left side - Hamburger menu and App Name */}
            <View style={styles.leftContainer}>
                <Text style={styles.logoText}>PromptX</Text>
            </View>


            <TouchableOpacity
            onPress={()=>{
                router.replace('/(tabs)/profile')
            }} style={styles.rightContainer}>
                
                {user.profilePicture ? (
                    <Image 
                        source={{ uri: user.profilePicture }} 
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profilePlaceholder}>
                        <MaterialIcons name="person" size={20} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F7FF',

    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuButton: {
        marginRight: 5,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6941C6',
        fontFamily: 'Inter-Bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchButton: {
        padding: 6,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profilePlaceholder: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: '#6941C6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    notificationBadge: {
        position: 'absolute',
        right: -1,
        top: -5,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default CustomHeader;