
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface SignOutButtonProps {
    style?: StyleProp<ViewStyle>
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ style }) => {
    // Use `useClerk()` to access the `signOut()` function


    const handleSignOut = async (): Promise<void> => {
        
    }

    return (
        <TouchableOpacity style={style} onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    )
}