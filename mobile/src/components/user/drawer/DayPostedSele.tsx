import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { formatISO, subDays, subHours, subMonths } from 'date-fns';
import { YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import CustomRadioGroup from '../../reusable/CustomRadioGroup';
import colors from '~/src/constants/colors';

const DayPostedOptions = ['24 Hr', 'This Week', 'This Month', 'More than 1 month'];

export interface IDateRange {
  startDate?: string;
  endDate?: string;
}

type Props = {
  onDateChange: ({ startDate, endDate }: IDateRange) => void;
  seleOption?: string;
  setSeleOption: (option: string) => void;
};

const DayPostedSele = ({ onDateChange, seleOption, setSeleOption }: Props) => {
  useEffect(() => {
    const { startDate, endDate } = getDateRange();
    onDateChange({ startDate, endDate });
  }, [seleOption]);

  const getDateRange = () => {
    const now = new Date();
    switch (seleOption) {
      case '24 Hr':
        return {
          startDate: formatISO(subHours(now, 24)),
          endDate: formatISO(now),
        };
      case 'This Week':
        return {
          startDate: formatISO(subDays(now, 7)),
          endDate: formatISO(now),
        };
      case 'This Month':
        return {
          startDate: formatISO(subMonths(now, 1)),
          endDate: formatISO(now),
        };
      case 'More than 1 month':
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };
  return (
    <YStack space={'$1.5'}>
      <Text style={{ fontFamily: 'InterBold' }}>
        {labels.dayPosted}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <CustomRadioGroup
        items={DayPostedOptions}
        selectedItem={seleOption}
        onChange={(val: string) => setSeleOption(val)}
      />
    </YStack>
  );
};

export default DayPostedSele;
