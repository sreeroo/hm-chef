const tintColorLight = '#ff6b6b'; // Modern red for light mode
const tintColorDark = '#ff4d4d'; // Modern red for dark mode

export default {
  light: {
    text: '#000',
    background: '#fff5f5', // Light red background
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#ff6b6b', // Modern red
    primaryLight: '#ffecec', // Light red
    primaryDark: '#d64545', // Darker red
    secondary: '#a33a3a', // Muted red
    white: '#fff',
    black: '#000',
  },
  dark: {
    text: '#fff',
    background: '#1a1a1a', // Dark background
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#ff4d4d', // Modern red
    primaryLight: '#ff9999', // Light red for dark mode
    primaryDark: '#b22222', // Darker red
    secondary: '#a33a3a', // Muted red
    white: '#fff',
    black: '#000',
  },
};