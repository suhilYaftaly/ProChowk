import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { YStack } from 'tamagui';
import CustomRadioGroup from '../../reusable/CustomRadioGroup';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';
import { TTypeOption } from './ProjectFilterDrawer';

const TypeOptions: TTypeOption[] = ['All', 'Hourly', 'Project'];
type Props = {
  seleProjectType: string;
  handleProTypeChange: (val: string) => void;
};
const ProjectTypeSele = ({ seleProjectType, handleProTypeChange }: Props) => {
  return (
    <YStack space={'$1.5'}>
      <Text style={{ fontFamily: 'InterBold' }}>
        {labels.projectType}
        <Text style={{ color: colors.primary }}>*</Text>
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
