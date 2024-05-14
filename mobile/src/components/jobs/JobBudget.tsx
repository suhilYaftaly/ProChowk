import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IJobSteps } from './JobForm';
import colors from '~/src/constants/colors';
import { Circle, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import InputWithLabel from '../reusable/InputWithLabel';
import { JobInput } from '~/src/graphql/operations/job';
import { jobConfigs } from '~/src/config/configConst';

const JobBudget = ({ jobForm, setJobForm, errors }: IJobSteps) => {
  const resets = jobConfigs.defaults.budgetResets;
  const isFixed = jobForm?.budget?.type === 'Project';
  const isHourly = jobForm?.budget?.type === 'Hourly';
  const onTypeSelect = (type: JobInput['budget']['type']) => {
    setJobForm((prev) => {
      let values = { ...prev };

      if (type === 'Hourly') {
        values.budget.from = resets.hourly.from;
        values.budget.to = resets.hourly.to;
      } else if (type === 'Project') {
        values.budget.from = resets.project.from;
        values.budget.to = resets.project.to;
      }

      values.budget.type = type;

      return values;
    });
  };
  const onValueChange = (name: string, value: string): void => {
    const newValue = value === '' ? '' : Number(value);
    if (isFixed) {
      setJobForm((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          from: newValue as number,
          to: newValue as number,
        },
      }));
    } else
      setJobForm((prev) => ({
        ...prev,
        budget: { ...prev.budget, [name]: newValue },
      }));
  };
  return (
    <View style={styles.formCont}>
      <YStack space={'$2.5'}>
        <Text style={styles.labelText}>
          {labels.seleProjectBudget} <Text style={{ color: colors.primary }}>*</Text>
        </Text>
        <View style={styles.budgetTypeList}>
          <Pressable
            onPress={() => onTypeSelect('Project')}
            style={[
              styles.budgetTypeCont,
              {
                borderColor: isFixed ? colors.primary : colors.border,
                backgroundColor: isFixed ? colors.primary : colors.white,
              },
            ]}>
            <View style={styles.budgetTypeSymbol}>
              <Circle
                size={30}
                borderColor={isFixed ? colors.white : colors.textDark}
                borderWidth={2}>
                <FontAwesome
                  name="dollar"
                  size={18}
                  color={isFixed ? colors.white : colors.textDark}
                />
              </Circle>
              <Circle
                size={20}
                borderColor={isFixed ? colors.white : colors.textDark}
                borderWidth={1}>
                <Circle size={10} backgroundColor={colors.white} />
              </Circle>
            </View>
            <Text
              style={[styles.budgetTypeText, { color: isFixed ? colors.white : colors.textDark }]}>
              {labels.fixedBudget}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTypeSelect('Hourly')}
            style={[
              styles.budgetTypeCont,
              {
                borderColor: isHourly ? colors.primary : colors.border,
                backgroundColor: isHourly ? colors.primary : colors.white,
              },
            ]}>
            <View style={styles.budgetTypeSymbol}>
              <FontAwesome6
                name="clock"
                size={30}
                color={isHourly ? colors.white : colors.textDark}
              />
              <Circle
                size={20}
                borderColor={isHourly ? colors.white : colors.border}
                borderWidth={1}>
                <Circle size={10} backgroundColor={colors.white} />
              </Circle>
            </View>
            <Text
              style={[styles.budgetTypeText, { color: isHourly ? colors.white : colors.textDark }]}>
              {labels.hourlyRate}
            </Text>
          </Pressable>
        </View>
      </YStack>
      <View>
        <YStack space={'$2.5'}>
          {isHourly && (
            <InputWithLabel
              gap={2.5}
              isNumeric={true}
              isWithPostfix={true}
              isWithPrefix={true}
              prefixText={labels.dollar}
              postfixText={labels.perHour}
              labelText={labels.from}
              placeholder={labels.from}
              value={jobForm?.budget?.from?.toString()}
              onChange={(val: string) => onValueChange('from', val)}
              isError={!Boolean(errors.budget.from)}
              errorText={errors.budget.from}
            />
          )}
          <InputWithLabel
            gap={2.5}
            isNumeric={true}
            isWithPostfix={true}
            isWithPrefix={true}
            prefixText={labels.dollar}
            postfixText={isFixed ? '' : labels.perHour}
            labelText={isFixed ? labels.enterBudget : labels.to}
            placeholder={labels.to}
            value={jobForm?.budget?.to?.toString()}
            onChange={(val: string) => onValueChange('to', val)}
            isError={!Boolean(errors.budget.to)}
            errorText={errors.budget.to}
          />
          {isHourly && (
            <InputWithLabel
              gap={2.5}
              isNumeric={true}
              labelText={labels.maxHours}
              placeholder={labels.maxHours}
              value={jobForm?.budget?.maxHours?.toString()}
              onChange={(val: string) => onValueChange('maxHours', val)}
              isError={!Boolean(errors.budget.maxHours)}
              errorText={errors.budget.maxHours}
            />
          )}
        </YStack>
      </View>
    </View>
  );
};

export default JobBudget;

const styles = StyleSheet.create({
  formCont: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    rowGap: 20,
  },
  labelText: {
    fontFamily: 'InterBold',
  },
  budgetTypeList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetTypeSymbol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  budgetTypeCont: {
    borderWidth: 1,
    borderRadius: 10,
    width: '48%',
    padding: 15,
  },
  budgetTypeText: {
    fontFamily: 'InterSemiBold',
    fontSize: 17,
    textAlign: 'center',
  },
});
