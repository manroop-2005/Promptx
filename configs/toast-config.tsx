import { Ionicons } from '@expo/vector-icons';

import { Text, View } from 'react-native';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View
      style={{
        position: 'absolute',
        top: 10,
        left: '5%',
        right: '5%',
        minHeight: 52,
        zIndex:15,
        backgroundColor: '#ECFDF3',
        borderLeftColor: '#12B76A',
        borderLeftWidth: 4,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Ionicons name="checkmark-circle" size={20} color="#12B76A" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        {text1 && <Text style={{ color: '#067647', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>{text1}</Text>}
        {text2 && <Text style={{ color: '#067647', fontSize: 13, fontFamily: 'Inter-Regular', marginTop: 4 }}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View
      style={{
        position: 'absolute',
         top: 10,
        left: '5%',
        right: '5%',
        minHeight: 52,
        backgroundColor: '#FEF3F2',
        borderLeftColor: '#F04438',
        borderLeftWidth: 4,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Ionicons name="alert-circle" size={20} color="#F04438" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        {text1 && <Text style={{ color: '#D92D20', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>{text1}</Text>}
        {text2 && <Text style={{ color: '#D92D20', fontSize: 13, fontFamily: 'Inter-Regular', marginTop: 4 }}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View
      style={{
        position: 'absolute',
        top: 10,
        left: '5%',
        right: '5%',
        minHeight: 40,
        backgroundColor: '#EEF4FF',
        borderLeftColor: '#3E7BFA',
        borderLeftWidth: 4,
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Ionicons name="information-circle" size={20} color="#3E7BFA" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        {text1 && <Text style={{ color: '#3E7BFA', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>{text1}</Text>}
        {text2 && <Text style={{ color: '#3E7BFA', fontSize: 13, fontFamily: 'Inter-Regular', marginTop: 4 }}>{text2}</Text>}
      </View>
    </View>
  ),
  delete: ({ text1, text2 }: any) => (
    <View
      style={{
        position: 'absolute',
         top: 10,
        left: '5%',
        right: '5%',
        minHeight: 52,
        backgroundColor: '#FEF3F2',
        borderLeftColor: '#F04438',
        borderLeftWidth: 4,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Ionicons name="trash-bin" size={20} color="#F04438" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        {text1 && <Text style={{ color: '#D92D20', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>{text1}</Text>}
        {text2 && <Text style={{ color: '#D92D20', fontSize: 13, fontFamily: 'Inter-Regular', marginTop: 4 }}>{text2}</Text>}
      </View>
    </View>
  ),
};
