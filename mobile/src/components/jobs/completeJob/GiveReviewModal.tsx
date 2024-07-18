import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useUserStates } from '~/src/redux/reduxStates';
import { useSubmitReview } from '~/src/graphql/operations/review';
import Toast from 'react-native-toast-message';
import CustomModal from '../../reusable/CustomModal';
import { Button, Spinner, TextArea, YStack } from 'tamagui';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import CustomRating from '../../reusable/CustomRating';

type Props = {
  open: boolean;
  onClose: (close: boolean) => void;
  reviewedId: string;
};

const GiveReviewModal = ({ open, onClose, reviewedId }: Props) => {
  const { userId } = useUserStates();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [form, setForm] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState('');
  const { submitReviewAsync, loading } = useSubmitReview();

  const handleSubmitReview = () => {
    if (form.rating < 1) {
      setError(labels.reviewError);
      return;
    } else setError('');

    if (userId) {
      submitReviewAsync({
        variables: { reviewerId: userId, reviewedId, ...form },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: labels.reviewSuccess,
            position: 'top',
          });
          onClose(false);
        },
      });
    }
  };
  return (
    <CustomModal
      headerText={labels.giveReview}
      isOpen={open}
      setIsOpen={() => onClose(!open)}
      width={'80%'}
      dialogCom={
        <View style={{ alignItems: 'center', rowGap: 10 }}>
          <CustomRating
            starRating={form.rating}
            setStarRating={(rating: number) => setForm((prev) => ({ ...prev, rating: rating }))}
            size={30}
          />
          <YStack space={'$2.5'} width={'100%'}>
            <Text style={styles.labelText}>
              {labels.shareYourDetails} <Text style={{ color: theme.primary }}>*</Text>
            </Text>
            <TextArea
              placeholder={labels.reviewPlaceholder}
              size="$3"
              borderWidth={1}
              borderColor={theme.border}
              rows={5}
              style={[styles.inputText, { textAlignVertical: 'top' }]}
              defaultValue={form?.comment}
              onChangeText={(e) => setForm((prev) => ({ ...prev, comment: e }))}
            />
            <Text style={{ color: theme.primary, alignSelf: 'flex-end', marginTop: -5 }}>
              {labels.wordLimit}
            </Text>
            {Boolean(error) && <Text style={{ color: theme.error }}>*{error}</Text>}
          </YStack>
          <Button
            backgroundColor={loading ? theme.border : theme.primary}
            color={loading ? theme.silver : theme.white}
            style={styles.button}
            onPress={() => handleSubmitReview()}
            disabled={loading}
            icon={loading ? () => <Spinner /> : undefined}>
            {labels?.submitNow}
          </Button>
        </View>
      }
    />
  );
};

export default GiveReviewModal;

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
  });
