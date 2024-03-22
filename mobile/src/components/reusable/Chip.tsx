import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
interface Props {
  label: string;
  onClose: (val: string) => void;
}

const Chip = ({ label, onClose }: Props) => {
  return (
    <View style={styles.chipContainer}>
      <Text style={{ textAlign: 'center', fontFamily: 'InterBold', fontSize: 13, marginRight: 10 }}>
        {label}
      </Text>
      <Pressable onPress={() => onClose(label)}>
        <Ionicons name="close" size={20} color="black" />
      </Pressable>
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chipContainer: {
    backgroundColor: colors.bg,
    color: colors.textBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
    margin: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
