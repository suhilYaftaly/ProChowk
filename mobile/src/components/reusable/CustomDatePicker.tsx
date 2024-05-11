import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { parseISO } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
import DatePicker from 'react-native-date-picker';
import labels from '~/src/constants/labels';

interface Props {
  seleDate?: string;
  setSeleDate: (date: string) => void;
  seleDateErrTxt: string;
  isValidDate: boolean;
  isOptionalDate?: boolean;
}
const CustomDatePicker = ({
  seleDate = new Date().toISOString(),
  setSeleDate,
  seleDateErrTxt,
  isValidDate,
  isOptionalDate,
}: Props) => {
  const [open, setOpen] = useState(false);
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  return (
    <View>
      <Pressable style={styles.dateBtnCont} onPress={() => setOpen(!open)}>
        <Text>
          {!isOptionalDate
            ? parseISO(seleDate).toLocaleDateString()
            : seleDate !== new Date().toISOString()
              ? parseISO(seleDate).toLocaleDateString()
              : labels.seleDate}
        </Text>
        <FontAwesome name="calendar-o" size={20} color={colors.textDark} />
      </Pressable>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={parseISO(seleDate)}
        minimumDate={new Date()}
        onConfirm={(date: Date) => {
          setOpen(false);
          setSeleDate(date.toISOString());
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {!isValidDate && <Text style={{ color: colors.error }}>*{seleDateErrTxt}</Text>}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  dateBtnCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
