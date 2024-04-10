import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Label, RadioGroup, XStack } from 'tamagui';
import colors from '~/src/constants/colors';

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
  return (
    <View>
      <RadioGroup value={selectedItem} gap="$2" onValueChange={(val: string) => onChange(val)}>
        <View
          style={[
            styles.radioItemCont,
            { flexDirection: `${orientation === 'horizontal' ? 'row' : 'column'}` },
          ]}>
          {items?.map((item: string, index: number) => {
            return (
              <XStack alignItems="center" space="$2" key={index}>
                <RadioGroup.Item
                  value={item}
                  id={index + '-radio'}
                  backgroundColor={colors.white}
                  borderColor={colors.border}
                  size={'$3'}>
                  <RadioGroup.Indicator backgroundColor={colors.primary} />
                </RadioGroup.Item>
                <Label color={colors.silver} style={styles.labelText} htmlFor={index + '-radio'}>
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
