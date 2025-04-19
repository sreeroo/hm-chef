import React from 'react';
import { Modal, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { View } from '@/components/Themed'; // Use Themed View
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ visible, onClose, children }) => {
  const { themeColors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Semi-transparent background */}
        <Pressable style={styles.modalOverlay} onPress={onClose} />

        {/* Modal Content Container */}
        <View style={[styles.modalView, { backgroundColor: themeColors.background }]}>
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={28} color={themeColors.secondary} />
          </Pressable>

          {/* Content passed from parent */}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  modalView: {
    position: 'absolute', // Position over the overlay
    bottom: 0, // Stick to bottom
    left: 0,
    right: 0,
    maxHeight: '85%', // Limit height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 40, // Space for close button and content
    paddingBottom: 30, // Bottom padding
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 5, // Hit area
    zIndex: 1, // Ensure it's above content
  },
});

export default SimpleModal;