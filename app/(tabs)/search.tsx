import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { SearchBar } from '@rneui/themed';

export default function SearchScreen() {

  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <View style={styles.container}>
      <SearchBar/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
