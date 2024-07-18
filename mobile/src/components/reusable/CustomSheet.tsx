import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { Separator, Sheet } from 'tamagui';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const CustomSheet = (props: any) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Sheet
      modal={true}
      open={props?.isOpen}
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
        backgroundColor={theme.secondary50}
      />

      <Sheet.Frame flex={1} backgroundColor={theme.white}>
        <Text style={styles.selectionText}>
          {props.sheetTitle}
          {props.counter && <Text style={{ color: theme.primary }}>({props.counter})</Text>}
        </Text>
        <Separator borderColor={theme.border} />
        <Sheet.ScrollView paddingHorizontal={10}>{props.children}</Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CustomSheet;

const getStyles = (theme: any) =>
  StyleSheet.create({
    selectionText: {
      fontFamily: 'InterBold',
      fontSize: 18,
      color: theme.textDark,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
  });
