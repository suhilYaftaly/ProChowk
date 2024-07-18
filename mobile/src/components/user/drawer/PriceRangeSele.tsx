import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Input, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  fromVal: string;
  toVal: string;
  setFromVal: (val: string) => void;
  setToVal: (val: string) => void;
};
const PriceRangeSele = ({ fromVal, toVal, setFromVal, setToVal }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [priceRangeError, setPriceRangeError] = useState(false);
  const handleRangeChange = (val: string, type: 'from' | 'to') => {
    if (type === 'from') {
      if (!Number(val) || Number(val) < 10 || Number(val) > Number(toVal)) setPriceRangeError(true);
      else setPriceRangeError(false);
      setFromVal(val);
    } else {
      if (!Number(val) || Number(val) < Number(fromVal)) setPriceRangeError(true);
      else setPriceRangeError(false);
      setToVal(val);
    }
  };
  return (
    <YStack space={'$1.5'}>
      <Text style={{ fontFamily: 'InterBold', color: theme.textDark }}>
        {labels.priceRange}
        <Text style={{ color: theme.primary }}>*</Text>
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
      {priceRangeError && <Text style={{ color: theme.error }}>*{labels.priceRangeError}</Text>}
    </YStack>
  );
};

export default PriceRangeSele;

const getStyles = (theme: any) =>
  StyleSheet.create({
    priceRangeCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputText: {
      backgroundColor: 'transparent',
      color: theme.textDark,
      fontFamily: 'InterBold',
      fontSize: 15,
      minHeight: 35,
      minWidth: 100,
    },
  });
