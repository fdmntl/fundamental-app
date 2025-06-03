// ~/components/OnboardingSceen/OnboardingScreen.tsx
import { Modal, View, Text, TouchableOpacity } from 'react-native';

export const OnboardingScreen = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 20,
            width: '90%',
            maxWidth: 360,
          }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
            Welcome to Your Wallet
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 12 }}>
            This app helps you easily access and manage your crypto assets. Here's what you can do:
          </Text>

          <Text style={{ marginBottom: 8 }}>
            📈 Check live crypto trends with interactive charts
          </Text>
          <Text style={{ marginBottom: 8 }}>💼 View your detailed asset balances</Text>
          <Text style={{ marginBottom: 8 }}>📜 Browse your full transaction history</Text>
          <Text style={{ marginBottom: 8 }}>🌍 Enjoy simple, decentralized access</Text>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, alignSelf: 'flex-end' }}>
            <Text style={{ color: '#8435E0', fontWeight: 'bold' }}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
