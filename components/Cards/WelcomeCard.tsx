import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { View, Text } from '@/components/Themed';
import Card from './Card'; 
import { useTheme } from '@/context/ThemeContext';

interface WelcomeCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>; // For Card container
  contentStyle?: StyleProp<ViewStyle>; // For inner content padding
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  buttonText,
  onPress,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
  buttonStyle,
  buttonTextStyle,
}) => {
  const { themeColors } = useTheme(); // Get theme colors

  return (
    <Card style={style}>
      <View style={[styles.content, contentStyle]}>
        <Text style={[styles.title, { color: themeColors.primaryDark }, titleStyle]}>{title}</Text>
        <Text style={[styles.description, { color: themeColors.text }, descriptionStyle]}>{description}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }, buttonStyle]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: themeColors.white }, buttonTextStyle]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20, // Default padding for content inside the card
    alignItems: 'center', // Center content by default
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded button
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeCard;