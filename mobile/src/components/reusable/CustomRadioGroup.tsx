import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Label, RadioGroup, XStack } from 'tamagui';
import { getRandomString } from '~/src/utils/utilFuncs';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type radioProps = {
  items: string[];
  selectedItem?: string;
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
};

const CustomRadioGroup = ({
  items,
  selectedItem,
  onChange,
  orientation = 'vertical',
}: radioProps) => {
  const { theme } = useAppTheme();
  return (
    <View>
      <RadioGroup value={selectedItem} gap="$2" onValueChange={(val: string) => onChange(val)}>
        <View
          style={[
            styles.radioItemCont,
            { flexDirection: `${orientation === 'horizontal' ? 'row' : 'column'}` },
          ]}>
          {items?.map((item: string, index: number) => {
            const radioId = getRandomString(5);
            return (
              <XStack alignItems="center" space="$2" key={index}>
                <RadioGroup.Item
                  value={item}
                  id={radioId}
                  backgroundColor={theme.white}
                  borderColor={theme.border}
                  size={'$3'}>
                  <RadioGroup.Indicator backgroundColor={theme.primary} />
                </RadioGroup.Item>
                <Label color={theme.silver} style={styles.labelText} htmlFor={radioId}>
                  {item}
                </Label>
              </XStack>
            );
          })}
        </View>
      </RadioGroup>
    </View>
  );
};

export default CustomRadioGroup;

const styles = StyleSheet.create({
  labelText: { fontFamily: 'InterBold' },
  radioButton: {
    justifyContent: 'center',
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    flexDirection: 'row',
  },
  radioItemCont: {
    gap: 10,
    marginTop: 10,
  },
});
