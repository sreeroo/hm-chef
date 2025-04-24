import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const RecipeImage = ({ uri, height = 200, style,}: { uri: string | null, height?: number, style?:{} }) => (
  <Image
    style={[style, styles.image, { height }]}
    source={{ uri: uri || undefined }}
    placeholder={{ blurhash }}
    contentFit="cover"
    transition={300} 
    priority="high"
  />
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    backgroundColor: '#eee',
  },
});

export default RecipeImage;