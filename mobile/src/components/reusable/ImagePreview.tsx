import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { Circle, Image } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { IImage } from '~/src/types/commonTypes';
import colors from '~/src/constants/colors';
type imagePrevProps = {
  image: IImage;
  imgHeight: number;
  imgWidth: number;
  isEditable?: boolean;
  handleRemoveImage?: (name: string) => void;
};

const ImagePreview = ({
  image,
  imgHeight,
  imgWidth,
  handleRemoveImage,
  isEditable = false,
}: imagePrevProps) => {
  return (
    <View style={styles.jobImage}>
      <Image
        source={{
          uri: `${image?.url}`,
        }}
        style={[{ height: imgHeight, width: imgWidth }]}
        resizeMode="contain"
      />
      {isEditable && handleRemoveImage && (
        <Pressable
          style={{ position: 'absolute', right: -10, top: -10 }}
          onPress={() => handleRemoveImage(image?.name)}>
          <Circle size={25} backgroundColor={colors.primary}>
            <Ionicons name="close" size={20} color={colors?.white} />
          </Circle>
        </Pressable>
      )}
    </View>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  jobImage: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 7,
  },
});
