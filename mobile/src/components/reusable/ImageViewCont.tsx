import { Modal, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'tamagui';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  imageUrls: IImageInfo[];
};

const ImageViewCont = ({ isOpen, setIsOpen, imageUrls }: Props) => {
  const { theme } = useAppTheme();
  return (
    <Modal
      animationType="fade"
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}
      transparent={true}>
      <ImageViewer
        imageUrls={imageUrls}
        enableSwipeDown={true}
        maxScale={2}
        onSwipeDown={() => setIsOpen(false)}
        backgroundColor={theme.secondary50}
      />
      <Button
        onPress={() => setIsOpen(false)}
        backgroundColor={theme.primary}
        color={theme.white}
        style={styles.closeButton}>
        Close
      </Button>
    </Modal>
  );
};

export default ImageViewCont;

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: '80%',
    left: '40%',
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
