import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MultiSelect } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import { Button, Input } from 'tamagui';
import colors from '~/src/constants/colors';

type LabelVal = {
  label: string;
  value: string;
};

interface Props {
  label?: string;
  dDItems: string[];

  itemTextTransform?: boolean;
  placeholder: string;
}

const MultiSelectDD = ({
  label = 'Select',
  dDItems,

  itemTextTransform,
  placeholder,
}: Props) => {
  const itemList: LabelVal[] = [];
  dDItems?.map((item: string) =>
    itemList.push({ label: itemTextTransform ? item.toUpperCase() : item, value: item })
  );
  const onChange = (val: string) => {};
  return (
    <View>
      <View>
        <Input
          size={'$3'}
          placeholder={placeholder}
          style={styles.inputText}
          value={''}
          onChangeText={(e) => onChange(e)}
        />
        <FontAwesome name="chevron-down" size={15} color={colors.textBlue} />
      </View>
    </View>
  );
};

export default MultiSelectDD;

const styles = StyleSheet.create({
  menuButton: {
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    borderColor: colors.border,
    borderWidth: 1,
  },
  passwordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingRight: 10,
  },
  inputText: {
    color: 'black',
    fontFamily: 'Inter',
    backgroundColor: 'transparent',
  },
});
