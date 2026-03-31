// import { Audio } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

export default function VoiceInput({ onTranscription }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  const startRecording = async () => {
    try {
      // const permission = await Audio.requestPermissionsAsync();
      
      // if (permission.status !== 'granted') {
      //   Alert.alert('Permission required', 'Please grant microphone permission to use voice input.');
      //   return;
      // }

      // await Audio.setAudioModeAsync({
      //   allowsRecordingIOS: true,
      //   playsInSilentModeIOS: true,
      // });

      // const { recording } = await Audio.Recording.createAsync(
      //   Audio.RecordingOptionsPresets.HIGH_QUALITY
      // );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    // if (!recording) return;

    // setIsRecording(false);
    // await recording.stopAndUnloadAsync();
    
    // const uri = recording.getURI();
    // setRecording(null);

    // In a real app, you would send this audio to a speech-to-text service
    // For demo purposes, we'll simulate a transcription
    simulateTranscription();
  };

  const simulateTranscription = () => {
    // Simulate speech-to-text conversion
    const sampleTranscriptions = [
      "What is the latest technology trend?",
      "How do I create a responsive website?",
      "Explain machine learning concepts",
      "Help me write a professional email",
      "Design tips for mobile apps"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    onTranscription(randomTranscription);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <TouchableOpacity onPress={toggleRecording}>
      <LinearGradient
        colors={isRecording ? ['#EF4444', '#DC2626'] : ['#8B5CF6', '#7C3AED']}
        style={styles.button}
      >
        <View style={styles.content}>
          {isRecording ? <MicOff size={24} color="#FFFFFF" /> : <Mic size={24} color="#FFFFFF" />}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
    
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
});