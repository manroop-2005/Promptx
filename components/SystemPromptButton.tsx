import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SystemPromptButtonProps {
  title: string;
  icon: LucideIcon;
  onPress: () => void;
  isSelected: boolean;
  disabled?: boolean;
}

export default function SystemPromptButton({
  title,
  icon: Icon,
  onPress,
  isSelected,
  disabled = false,
}: SystemPromptButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          disabled ? ['#E5E7EB', '#D1D5DB'] :
          isSelected ? ['#6941C6', '#6941C6'] : 
          ['#A1A1AA', '#9CA3AF']
        }
        style={styles.button}
      >
        <View style={styles.iconContainer}>
          <Icon size={18} color={disabled ? "#9CA3AF" : "#fff"} />
        </View>
        <Text style={[
          styles.text,
          disabled && styles.disabledText,
          isSelected && styles.selectedText
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 50,
  },
  iconContainer: {
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  premiumBorder: {
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});