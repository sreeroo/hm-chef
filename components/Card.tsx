import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

interface CardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  buttonText?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}



const Card: React.FC<CardProps> = ({
  title,
  description,
  onPress,
  style,
  titleStyle,
  descriptionStyle,
  buttonText,
  buttonStyle,
  buttonTextStyle,
}) => {

  useFonts({Poppins_400Regular,Poppins_700Bold});

  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.cardTitle, titleStyle, {fontFamily:'Poppins_700Bold'}]}>{title}</Text>
      {description && <Text style={[styles.cardDescription, descriptionStyle, {fontFamily:'Poppins_400Regular'}]}>{description}</Text>}
      {onPress && buttonText && (
        <TouchableOpacity style={[styles.button, buttonStyle, ]} onPress={onPress}>
          <Text style={[styles.buttonText, buttonTextStyle]}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    color: Colors.light.primaryDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Card;