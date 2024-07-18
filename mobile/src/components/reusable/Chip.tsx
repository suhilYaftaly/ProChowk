import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
interface Props {
  label: string;
  onClose?: (val: string) => void;
  isDisplay?: boolean;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const Chip = ({ label, onClose, isDisplay = false, bgColor, textColor, borderColor }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <View
      style={[
        styles.chipContainer,
        {
          justifyContent: isDisplay ? 'center' : 'space-between',
          backgroundColor: bgColor || theme.bg,
          borderColor: borderColor || theme.border,
        },
      ]}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'InterBold',
          fontSize: 13,
          marginRight: isDisplay ? 0 : 10,
          color: theme.textDark,
        }}>
        {label}
      </Text>
      {!isDisplay && (
        <Pressable onPress={() => (onClose ? onClose(label) : {})}>
          <Ionicons name="close" size={20} color={textColor || theme.textDark} />
        </Pressable>
      )}
    </View>
  );
};

export default Chip;

const getStyles = (theme: any) =>
  StyleSheet.create({
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
