import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { Sheet } from 'tamagui';
import colors from '~/src/constants/colors';

const CustomSheet = (props: any) => {
  return (
    <Sheet
      modal={true}
      open={props?.isOpen}
      zIndex={100_000}
      onOpenChange={props?.setIsOpen}
      snapPoints={props?.snapPoints}
      position={0}
      snapPointsMode={'percent'}
      dismissOnSnapToBottom
      disableDrag={false}
      animation={'quick'}>
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        opacity={0.5}
        backgroundColor={'$black'}
      />

      <Sheet.Frame flex={1} backgroundColor={'$white'}>
        <Text style={styles.selectionText}>{props.sheetTitle}</Text>
        <Sheet.ScrollView paddingHorizontal={'$4'}>{props.children}</Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CustomSheet;

const styles = StyleSheet.create({
  selectionText: {
    fontFamily: 'InterBold',
    fontSize: 20,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
