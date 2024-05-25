import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Input, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';

type Props = {
  fromVal: string;
  toVal: string;
  setFromVal: (val: string) => void;
  setToVal: (val: string) => void;
};
const PriceRangeSele = ({ fromVal, toVal, setFromVal, setToVal }: Props) => {
  const [priceRangeError, setPriceRangeError] = useState(false);
  const handleRangeChange = (val: string, type: 'from' | 'to') => {
    if (type === 'from') {
      if (!Number(val) || Number(val) < 10) setPriceRangeError(true);
      else setPriceRangeError(false);
      setFromVal(val);
    } else {
      if (!Number(val) || Number(val) > 50000) setPriceRangeError(true);
      else setPriceRangeError(false);
      setToVal(val);
    }
  };
  return (
    <YStack space={'$1.5'}>
      <Text style={{ fontFamily: 'InterBold' }}>
        {labels.priceRange}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <View style={styles.priceRangeCont}>
        <Input
          size={'$1'}
          inputMode="numeric"
          style={styles.inputText}
          value={fromVal}
          padding={'$2'}
          onChangeText={(e) => handleRangeChange(e, 'from')}
          textAlign="right"
        />
        <Input
          size={'$1'}
          inputMode="numeric"
          style={styles.inputText}
          value={toVal}
          onChangeText={(e) => handleRangeChange(e, 'to')}
          padding={'$2'}
          textAlign="right"
        />
      </View>
      {priceRangeError && <Text style={{ color: colors.error }}>*{labels.priceRangeError}</Text>}
    </YStack>
  );
};

export default PriceRangeSele;

const styles = StyleSheet.create({
  priceRangeCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputText: {
    backgroundColor: 'transparent',
    color: colors.textDark,
    fontFamily: 'InterBold',
    fontSize: 15,
    minHeight: 35,
    minWidth: 100,
  },
});
