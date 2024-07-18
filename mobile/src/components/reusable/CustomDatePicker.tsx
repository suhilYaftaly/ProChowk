import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { parseISO } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

interface Props {
  seleDate?: string;
  setSeleDate: (date: string) => void;
  seleDateErrTxt: string;
  isValidDate: boolean;
  isOptionalDate?: boolean;
}
const CustomDatePicker = ({
  seleDate,
  setSeleDate,
  seleDateErrTxt,
  isValidDate,
  isOptionalDate,
}: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString();
  return (
    <View>
      <Pressable style={styles.dateBtnCont} onPress={() => setOpen(!open)}>
        <Text style={{ color: theme.silver }}>
          {!isOptionalDate
            ? parseISO(seleDate || today).toLocaleDateString()
            : seleDate && seleDate !== new Date().toISOString()
              ? parseISO(seleDate).toLocaleDateString()
              : labels.seleDate}
        </Text>
        <FontAwesome name="calendar-o" size={20} color={theme.textDark} />
      </Pressable>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={parseISO(seleDate || today)}
        minimumDate={new Date()}
        onConfirm={(date: Date) => {
          setOpen(false);
          setSeleDate(date.toISOString());
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {!isValidDate && <Text style={{ color: theme.error }}>*{seleDateErrTxt}</Text>}
    </View>
  );
};

export default CustomDatePicker;

const getStyles = (theme: any) =>
  StyleSheet.create({
    dateBtnCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.white,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
