import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import colors from '~/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IJobPost } from './JobForm';
import { Button, Circle, Spinner } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/src/config/ToastConfig';
interface Props {
  children: ReactNode;
  steps: IJobPost['step'][];
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  onNavChange: (index: number) => void;
  showLeftCont: boolean;
  nextBtnTitle?: string;
  loading: boolean;
  sectionDesc?: string;
}
const PostJobCont = ({
  children,
  steps,
  stepIndex,
  onNext,
  onBack,
  onNavChange,
  showLeftCont,
  nextBtnTitle,
  loading,
  sectionDesc,
}: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const os = Platform?.OS;
  const isISO = os === 'ios';
  const currStep = steps[stepIndex];
  const nextStep = steps[stepIndex + 1];
  return (
    <View style={styles.pageCont}>
      <View style={[styles.headerBar, { marginTop: isISO ? top : 0 }]}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => {
            if (stepIndex > 0) onNavChange(stepIndex - 1);
          }}>
          {stepIndex > 0 && <FontAwesome name="chevron-left" size={20} color={colors.white} />}
          <View>
            <Text style={styles.pageTitle}>{currStep?.label}</Text>
            <Text style={styles.subHeader}>Next: {nextBtnTitle || nextStep?.label}</Text>
          </View>
        </Pressable>
        <Circle size={40} backgroundColor={colors.white}>
          <Text style={styles.stepInidicator}>
            {stepIndex + 1}/{steps?.length}
          </Text>
        </Circle>
      </View>
      <Toast config={toastConfig} />
      <ScrollView style={{ flex: 1, marginTop: top + 60, marginBottom: bottom + 50 }}>
        {children}
      </ScrollView>
      <View style={styles.footerBar}>
        <Button
          style={styles.cancelBtn}
          borderColor={colors.primary}
          paddingHorizontal={15}
          paddingVertical={5}
          onPress={onBack}>
          Cancel
        </Button>
        <Button
          style={styles.nextBtn}
          paddingHorizontal={15}
          paddingVertical={5}
          onPress={onNext}
          disabled={loading}
          color={loading ? colors.silver : colors.white}
          backgroundColor={loading ? colors.border : colors.primary}
          iconAfter={
            loading ? (
              <Spinner />
            ) : (
              <FontAwesome name="chevron-right" size={15} color={colors.white} />
            )
          }>
          {nextBtnTitle || nextStep?.label}
        </Button>
      </View>
    </View>
  );
};

export default PostJobCont;
const styles = StyleSheet.create({
  pageCont: {
    flex: 1,
  },
  headerBar: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.textDark,
    paddingHorizontal: 15,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontFamily: 'InterExtraBold',
    fontSize: 15,
    color: colors.white,
    marginLeft: 10,
  },
  subHeader: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.white,
    marginLeft: 10,
  },
  footerBar: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  cancelBtn: {
    fontFamily: 'InterBold',
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: 'transparent',
    color: colors.textDark,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  nextBtn: {
    fontFamily: 'InterBold',
    fontSize: 15,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  stepInidicator: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.textDark,
  },
});
