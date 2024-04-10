import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
interface Props {
  label: string;
  onClose?: (val: string) => void;
  isDisplay?: boolean;
}

const Chip = ({ label, onClose, isDisplay = false }: Props) => {
  return (
    <View
      style={[styles.chipContainer, { justifyContent: isDisplay ? 'center' : 'space-between' }]}>
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
          <Ionicons name="close" size={20} color={colors.textDark} />
        </Pressable>
      )}
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chipContainer: {
    backgroundColor: colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
    margin: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
