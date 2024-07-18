import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { YStack } from 'tamagui';
import CustomRadioGroup from '../../reusable/CustomRadioGroup';
import labels from '~/src/constants/labels';
import { TTypeOption } from './ProjectFilterDrawer';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const TypeOptions: TTypeOption[] = ['All', 'Hourly', 'Project'];
type Props = {
  seleProjectType: string;
  handleProTypeChange: (val: string) => void;
};
const ProjectTypeSele = ({ seleProjectType, handleProTypeChange }: Props) => {
  const { theme } = useAppTheme();
  return (
    <YStack space={'$1.5'}>
      <Text style={{ fontFamily: 'InterBold', color: theme.textDark }}>
        {labels.projectType}
        <Text style={{ color: theme.primary }}>*</Text>
      </Text>
      <CustomRadioGroup
        items={TypeOptions}
        selectedItem={seleProjectType}
        onChange={(val: string) => handleProTypeChange(val)}
      />
    </YStack>
  );
};

export default ProjectTypeSele;

const styles = StyleSheet.create({});
