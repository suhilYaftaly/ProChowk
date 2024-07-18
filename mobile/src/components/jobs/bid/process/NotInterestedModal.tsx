import { KeyboardAvoidingView, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useRejectBid } from '~/src/graphql/operations/jobBid';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import CustomModal from '~/src/components/reusable/CustomModal';
import labels from '~/src/constants/labels';
import { Button, ScrollView, Spinner, TextArea } from 'tamagui';
import { YStack } from 'tamagui';
import CustomRadioGroup from '~/src/components/reusable/CustomRadioGroup';
type Props = { bidId: string; openRejected: boolean; setOpenRejected: (val: boolean) => void };

const NotInterestedModal = ({ bidId, openRejected, setOpenRejected }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { rejectBidAsync, loading } = useRejectBid();
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [errors, setErrors] = useState({ otherReason: '' });

  const isOtherReasonActive = selectedReason === 'Other';

  const onSubmit = () => {
    const error = validateFileds();
    if (error) return;

    const rejectionReason = isOtherReasonActive ? otherReason : selectedReason;
    rejectBidAsync({
      variables: { bidId, rejectionReason },
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Bid Rejected Successfully.',
          position: 'top',
        });
        setOpenRejected(false);
      },
    });
  };

  const validateFileds = () => {
    let hasErrors = false;
    let errs = { otherReason: '' };
    if (isOtherReasonActive && otherReason?.length < configs.minOtherReason) {
      errs.otherReason = `Must be more than ${configs.minOtherReason} characters.`;
      hasErrors = true;
    }
    setErrors(errs);
    return hasErrors;
  };
  return (
    <Modal
      animationType="fade"
      visible={openRejected}
      onRequestClose={() => {
        setOpenRejected(!openRejected);
      }}
      transparent={true}>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <YStack space={'$1.5'} marginBottom={10}>
                <Text style={styles.labelText}>
                  {labels.seleReason}
                  <Text style={{ color: theme.primary }}> *</Text>
                </Text>
                <CustomRadioGroup
                  items={reasons}
                  selectedItem={selectedReason}
                  onChange={(val: string) => setSelectedReason(val)}
                />
              </YStack>
              {isOtherReasonActive && (
                <YStack space={'$2.5'}>
                  <Text style={styles.labelText}>
                    {labels.yourProposal} <Text style={{ color: theme.primary }}>*</Text>
                  </Text>
                  <TextArea
                    placeholder={labels.reasonPlaceholder}
                    size="$3"
                    borderWidth={1}
                    borderColor={theme.border}
                    rows={5}
                    style={[styles.inputText, { textAlignVertical: 'top' }]}
                    defaultValue={otherReason}
                    onChangeText={(e) => setOtherReason(e)}
                  />
                  <Text style={{ color: theme.primary, alignSelf: 'flex-end', marginTop: -5 }}>
                    {labels.wordLimit}
                  </Text>
                  {Boolean(errors?.otherReason) && (
                    <Text style={{ color: theme.error }}>*{errors?.otherReason}</Text>
                  )}
                </YStack>
              )}
              <View style={styles.buttonContainer}>
                <Button
                  backgroundColor={theme.primary}
                  color={theme.white}
                  style={styles.button}
                  icon={loading ? <Spinner /> : undefined}
                  disabled={loading}
                  onPress={onSubmit}>
                  {labels.submitNow}
                </Button>
                <Button onPress={() => setOpenRejected(false)} style={styles.transBtn} unstyled>
                  {labels.cancelGoBack}
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NotInterestedModal;

const getStyles = (theme: any) =>
  StyleSheet.create({
    labelText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    inputText: {
      fontFamily: 'InterSemiBold',
      color: theme.textDark,
      backgroundColor: 'transparent',
    },
    buttonContainer: {},
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginTop: 10,
      marginBottom: 10,
      width: '100%',
      color: theme.white,
    },
    transBtn: {
      fontFamily: 'InterBold',
      fontSize: 15,
      width: '100%',
      color: theme.textDark,
      textAlign: 'center',
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary50,
    },
    modalView: {
      minHeight: '40%',
      width: '80%',
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.white,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      rowGap: 10,
    },
  });

const reasons = [
  'Price',
  'Lead Time',
  'Not Professional',
  "Don't match with required skills",
  'Other',
];

const configs = { maxOtherReason: 350, minOtherReason: 5 };
