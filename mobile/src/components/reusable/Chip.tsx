import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
interface Props {
  label: string;
  onClose?: (val: string) => void;
  isDisplay?: boolean;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const Chip = ({
  label,
  onClose,
  isDisplay = false,
  bgColor = colors.bg,
  textColor = colors.textDark,
  borderColor = colors.border,
}: Props) => {
  return (
    <View
      style={[
        styles.chipContainer,
        {
          justifyContent: isDisplay ? 'center' : 'space-between',
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
      ]}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'InterBold',
          fontSize: 13,
          marginRight: isDisplay ? 0 : 10,
          color: colors.textDark,
        }}>
        {label}
      </Text>
      {!isDisplay && (
        <Pressable onPress={() => (onClose ? onClose(label) : {})}>
          <Ionicons name="close" size={20} color={textColor} />
        </Pressable>
      )}
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
    margin: 3,
    borderWidth: 1,
  },
});
