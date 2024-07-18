import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { IJob } from '~/src/graphql/operations/job';
import { isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { usePlaceBid } from '~/src/graphql/operations/jobBid';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import { Button, Circle, ScrollView, Spinner, TextArea, YStack } from 'tamagui';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InputWithLabel from '~/src/components/reusable/InputWithLabel';
import CustomDatePicker from '~/src/components/reusable/CustomDatePicker';
import { agreementTxt } from '~/src/config/data';
import CustCheckBox from '~/src/components/reusable/CustCheckBox';

type Props = {
  job: IJob;
  onDialogClose: () => void;
  contractorId?: string;
  contactorLoading: boolean;
};

const JobBidDialog = ({ job, onDialogClose, contractorId, contactorLoading }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const { placeBidAsync, loading: bidLoading } = usePlaceBid();
  const os = Platform?.OS;
  const isISO = os === 'ios';
  const [form, setForm] = useState<TForm>({
    quote: 200,
    startDate: new Date().toISOString(),
    endDate: '',
    proposal: '',
    agreementAccepted: false,
  });
  const [errors, setErrors] = useState<TErrors>({
    quote: '',
    startDate: '',
    endDate: '',
    proposal: '',
    agreementAccepted: '',
  });
  const loading = bidLoading || contactorLoading;
  const disableSubmit = loading;

  const onSubmit = () => {
    const error = validateErrors({ form, setErrors });
    if (error) return;
    if (contractorId) {
      placeBidAsync({
        variables: { input: { contractorId, jobId: job.id, ...form } },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: labels.bidPlaced,
            position: 'top',
          });
          onDialogClose();
        },
      });
    }
  };

  const handleAgreementCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setForm((prev) => ({ ...prev, agreementAccepted: checked }));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    // Check if the user has reached the bottom of the ScrollView
    const isBottomReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Adjust the threshold if needed
    if (isBottomReached) {
      setForm((prev) => ({ ...prev, agreementAccepted: true }));
    }
  };

  return (
    <View style={styles.pageCont}>
      <View style={[styles.headerBar, { marginTop: isISO ? top : 0 }]}>
        <Pressable style={styles.headerBackBtn} onPress={() => onDialogClose()}>
          <FontAwesome name="chevron-left" size={20} color="#fff" />
          <View>
            <Text style={styles.pageTitle}>{labels.bid}</Text>
          </View>
        </Pressable>
      </View>
      <ScrollView backgroundColor={theme.white} marginBottom={isISO ? 30 : 0} nestedScrollEnabled>
        <YStack space={'$2.5'} padding={20}>
          <InputWithLabel
            gap={2.5}
            isNumeric={true}
            isWithPostfix={true}
            isWithPrefix={true}
            prefixText={labels.dollar}
            labelText={labels.bidQuote}
            placeholder={labels.bidAmount}
            value={form.quote.toString()}
            onChange={(val: string) => setForm((prev) => ({ ...prev, quote: Number(val) }))}
            isError={!Boolean(errors?.quote)}
            errorText={errors?.quote}
          />
          <YStack space={'$2.5'}>
            <Text style={styles.labelText}>
              Start <Text style={{ color: theme.primary }}>*</Text>
            </Text>
            <CustomDatePicker
              seleDate={form?.startDate}
              setSeleDate={(seleDate: string) =>
                setForm((prev) => ({ ...prev, startDate: seleDate }))
              }
              isValidDate={!Boolean(errors?.startDate)}
              seleDateErrTxt={errors?.startDate}
            />
          </YStack>
          <YStack space={'$2.5'}>
            <Text style={styles.labelText}>End</Text>
            <CustomDatePicker
              isOptionalDate={true}
              seleDate={form?.endDate !== '' ? form?.endDate : undefined}
              setSeleDate={(seleDate: string) =>
                setForm((prev) => ({ ...prev, endDate: seleDate }))
              }
              isValidDate={!Boolean(errors.endDate)}
              seleDateErrTxt={errors.endDate}
            />
          </YStack>
          <YStack space={'$2.5'}>
            <Text style={styles.labelText}>
              {labels.yourProposal} <Text style={{ color: theme.primary }}>*</Text>
            </Text>
            <TextArea
              placeholder={proposalPlaceholder}
              size="$3"
              borderWidth={1}
              borderColor={theme.border}
              rows={7}
              style={[styles.inputText, { textAlignVertical: 'top' }]}
              defaultValue={form?.proposal}
              onChangeText={(e) => setForm((prev) => ({ ...prev, proposal: e }))}
            />
            <Text style={{ color: theme.primary, alignSelf: 'flex-end', marginTop: -5 }}>
              {labels.wordLimit}
            </Text>
            {Boolean(errors?.proposal) && (
              <Text style={{ color: theme.error }}>*{errors?.proposal}</Text>
            )}
          </YStack>
          <YStack space={'$2.5'}>
            <Text style={styles.labelText}>
              {labels.agreement} <Text style={{ color: theme.primary }}>*</Text>
            </Text>
            <ScrollView
              maxHeight={'$15'}
              onScroll={handleScroll}
              scrollEventThrottle={25}
              nestedScrollEnabled>
              <Text style={{ color: theme.textDark }}>{agreementTxt}</Text>
            </ScrollView>
            <CustCheckBox
              checked={form?.agreementAccepted}
              onChange={(val: boolean) => setForm((prev) => ({ ...prev, agreementAccepted: val }))}
              labelText={labels.agreeWithThis}
            />
            {Boolean(errors?.agreementAccepted) && (
              <Text style={{ color: theme.error }}>*{errors.agreementAccepted}</Text>
            )}
          </YStack>
        </YStack>
      </ScrollView>
      <Button
        style={[styles.bottomBtn, { bottom: bottom }]}
        icon={loading ? () => <Spinner /> : undefined}
        borderRadius={0}
        onPress={onSubmit}
        disabled={disableSubmit}>
        {labels.submitBid}
      </Button>
    </View>
  );
};

export default JobBidDialog;

const getStyles = (theme: any) =>
  StyleSheet.create({
    pageCont: {
      flex: 1,
    },
    headerBar: {
      backgroundColor: theme.secondaryDark,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    headerBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pageTitle: {
      fontFamily: 'InterExtraBold',
      fontSize: 18,
      color: '#fff',
      marginLeft: 10,
    },
    bottomBtn: {
      width: '100%',
      backgroundColor: theme.primary,
      color: '#fff',
      fontFamily: 'InterBold',
    },
    labelText: {
      fontFamily: 'InterBold',
      color: theme.textDark,
    },
    inputText: {
      fontFamily: 'InterSemiBold',
      color: theme.textDark,
      backgroundColor: 'transparent',
    },
  });

const configs = { minQuote: 14, maxProposal: 350, minProposal: 5 };

const proposalPlaceholder =
  'Describe your approach to the job, including key steps, materials, and timelines. Highlight your unique strengths or past experience relevant to this project.';

type TErrors = {
  quote: string;
  startDate: string;
  endDate: string;
  proposal: string;
  agreementAccepted: string;
};
type TForm = {
  quote: number;
  startDate: string;
  endDate: string;
  proposal: string;
  agreementAccepted: boolean;
};

type TValidateErrors = {
  form: TForm;
  setErrors: React.Dispatch<React.SetStateAction<TErrors>>;
};
const validateErrors = ({ form, setErrors }: TValidateErrors) => {
  let hasError = false;
  const errors: TErrors = {
    quote: '',
    startDate: '',
    endDate: '',
    proposal: '',
    agreementAccepted: '',
  };

  if (form.quote < configs.minQuote) {
    errors.quote = `Bid Quote must be more than ${configs.minQuote}.`;
    hasError = true;
  }

  const startDate = startOfDay(parseISO(form.startDate));
  const today = startOfDay(new Date());
  if (isBefore(startDate, today)) {
    errors.startDate = 'Start date must be today or in the future.';
    hasError = true;
  }
  if (form.endDate && !form.startDate) {
    errors.endDate = 'Start date must selected if end is selected';
    hasError = true;
  }
  if (form.startDate && form.endDate) {
    if (!isAfter(parseISO(form.endDate), parseISO(form.startDate))) {
      errors.endDate = 'End date must be after start date.';
      hasError = true;
    }
  }

  if (form.proposal !== undefined && form?.proposal?.length < configs.minProposal) {
    errors.proposal = `Proposal must be more than ${configs.minProposal} characters.`;
    hasError = true;
  }

  if (!form.agreementAccepted) {
    errors.agreementAccepted = 'Agreement must be accepted.';
    hasError = true;
  }

  setErrors(errors);
  return hasError;
};
