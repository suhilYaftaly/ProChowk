import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Checkbox, Label, XStack } from 'tamagui';
import { getRandomString } from '~/src/utils/utilFuncs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  labelText: string;
  checked: boolean;
  onChange: (val: boolean) => void;
};

const CustCheckBox = ({ checked, labelText, onChange }: Props) => {
  const id = getRandomString(5);
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <XStack width={300} alignItems="center" space="$4">
      <Checkbox
        id={id}
        checked={checked}
        backgroundColor={theme.bg}
        onPress={() => onChange(!checked)}>
        <Checkbox.Indicator>
          <FontAwesome5 name="check" size={12} color={theme.textDark} />
        </Checkbox.Indicator>
      </Checkbox>
      <Label htmlFor={id} style={styles.labelText} onPress={() => onChange(!checked)}>
        {labelText}
      </Label>
    </XStack>
  );
};

export default CustCheckBox;

const getStyles = (theme: any) =>
  StyleSheet.create({
    labelText: { fontFamily: 'InterBold', color: theme.textDark, fontSize: 15 },
  });
