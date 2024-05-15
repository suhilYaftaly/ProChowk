import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IJobSteps } from './JobForm';
import InputWithLabel from '../reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';
import { YStack } from 'tamagui';
import SkillSelection from '../user/signUp/SkillSelection';
import { SkillInput } from '~/src/graphql/operations/skill';
import CustomDatePicker from '../reusable/CustomDatePicker';

const JobBasicDetails = ({ jobForm, setJobForm, errors }: IJobSteps) => {
  const onValueChange = (name: string, value: any): void => {
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <View style={styles.formCont}>
      <InputWithLabel
        gap={2.5}
        labelText={labels.jobTitleText}
        placeholder={labels.jobTitlePlace}
        value={jobForm.title}
        onChange={(val: string) => onValueChange('title', val)}
        isError={!Boolean(errors.title)}
        errorText={errors.title}
      />
      <YStack space={'$2.5'}>
        <Text style={styles.labelText}>
          {labels.addSkillsJobPost} <Text style={{ color: colors.primary }}>*</Text>
        </Text>
        <SkillSelection
          isLabelRequire={false}
          seleSkills={jobForm.skills}
          setSeleSkills={(val: SkillInput[]) => onValueChange('skills', val)}
          isError={!Boolean(errors.skills)}
          errorText={errors?.skills}
        />
      </YStack>
      <YStack space={'$2.5'}>
        <Text style={styles.subSectionText}>{labels.projectTimeline}</Text>
        <YStack space={'$2.5'}>
          <Text style={styles.labelText}>
            Start <Text style={{ color: colors.primary }}>*</Text>
          </Text>
          <CustomDatePicker
            seleDate={jobForm?.startDate}
            setSeleDate={(seleDate: string) => onValueChange('startDate', seleDate)}
            isValidDate={!Boolean(errors.startDate)}
            seleDateErrTxt={errors.startDate}
          />
        </YStack>
        <YStack space={'$2.5'}>
          <Text style={styles.labelText}>End</Text>
          <CustomDatePicker
            isOptionalDate={true}
            seleDate={jobForm?.endDate}
            setSeleDate={(seleDate: string) => onValueChange('endDate', seleDate)}
            isValidDate={!Boolean(errors.endDate)}
            seleDateErrTxt={errors.endDate}
          />
        </YStack>
      </YStack>
    </View>
  );
};

export default JobBasicDetails;

const styles = StyleSheet.create({
  formCont: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    rowGap: 30,
  },
  subSectionText: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 10,
  },
  labelText: {
    fontFamily: 'InterBold',
  },
});
