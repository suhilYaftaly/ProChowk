import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type LabelVal = {
  label: string;
  value: string;
};

interface Props {
  label?: string;
  dDItems: string[];
  seleVal: string;
  setSelectedDDItem: (value: string) => void;
  itemTextTransform?: boolean;
}

const CustomSelectMenu = ({
  label = 'Select',
  dDItems,
  seleVal,
  setSelectedDDItem,
  itemTextTransform = false,
}: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const itemList: LabelVal[] = [];
  dDItems?.map((item: string) =>
    itemList.push({ label: itemTextTransform ? item.toUpperCase() : item, value: item })
  );

  return (
    <Dropdown
      style={styles.dropdown}
      iconColor={theme.textDark}
      iconStyle={{ height: 25 }}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.ddContainerStyle}
      data={itemList}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={label}
      value={seleVal}
      onChange={(item) => {
        setSelectedDDItem(item?.value);
      }}
      renderItem={(item) => (
        <View style={styles.itemContainerStyle}>
          <Text style={styles.itemTextStyle}>{item.label}</Text>
          {seleVal === item.value && <FontAwesome name="check" size={17} color={theme.textBlue} />}
        </View>
      )}
    />
  );
};

export default React.memo(CustomSelectMenu);

const getStyles = (theme: any) =>
  StyleSheet.create({
    dropdown: {
      backgroundColor: theme.white,
      borderRadius: 7,
      padding: 5,
      borderColor: theme.border,
      borderWidth: 1,
      height: 40,
    },
    selectedTextStyle: {
      fontFamily: 'InterBold',
      fontSize: 13,
      marginLeft: 5,
      color: theme.textDark,
    },
    itemContainerStyle: { padding: 10, justifyContent: 'space-between', flexDirection: 'row' },
    ddContainerStyle: { borderRadius: 7 },
    itemTextStyle: { fontFamily: 'InterSemiBold', fontSize: 13 },
    dropdownIcon: { color: theme.textBlue, fontSize: 13 },
  });
