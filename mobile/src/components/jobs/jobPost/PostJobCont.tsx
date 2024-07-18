import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IJobPost } from './JobForm';
import { Button, Circle, Spinner } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/src/config/ToastConfig';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
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
  const { height } = useWindowDimensions();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const os = Platform?.OS;
  const isISO = os === 'ios';
  const currStep = steps[stepIndex];
  const nextStep = steps[stepIndex + 1];
  return (
    <View style={styles.pageCont}>
      <View style={[styles.headerBar, { marginTop: isISO ? top : 0, height: height * 0.08 }]}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => {
            if (stepIndex > 0) onNavChange(stepIndex - 1);
          }}>
          {stepIndex > 0 && <FontAwesome name="chevron-left" size={20} color="#fff" />}
          <View>
            <Text style={styles.pageTitle}>{currStep?.label}</Text>
            <Text style={styles.subHeader}>Next: {nextBtnTitle || nextStep?.label}</Text>
          </View>
        </Pressable>
        <Circle size={40} backgroundColor={theme.bg}>
          <Text style={styles.stepInidicator}>
            {stepIndex + 1}/{steps?.length}
          </Text>
        </Circle>
      </View>
      <Toast config={toastConfig} />
      <ScrollView
        style={{
          flex: 1,
          marginTop: isISO ? top + height * 0.08 : height * 0.08,
          marginBottom: bottom + 50,
          backgroundColor: theme.bg,
        }}>
        {children}
      </ScrollView>
      <View style={styles.footerBar}>
        <Button
          style={styles.cancelBtn}
          borderColor={theme.primary}
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
          color={loading ? theme.silver : theme.white}
          backgroundColor={loading ? theme.border : theme.primary}
          iconAfter={
            loading ? <Spinner /> : <FontAwesome name="chevron-right" size={15} color="#fff" />
          }>
          {nextBtnTitle || nextStep?.label}
        </Button>
      </View>
    </View>
  );
};

export default PostJobCont;
const getStyles = (theme: any) =>
  StyleSheet.create({
    pageCont: {
      flex: 1,
    },
    headerBar: {
      position: 'absolute',
      width: '100%',
      backgroundColor: theme.secondaryDark,
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
      color: '#fff',
      marginLeft: 10,
    },
    subHeader: {
      fontFamily: 'InterSemiBold',
      fontSize: 12,
      color: '#fff',
      marginLeft: 10,
    },
    footerBar: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.secondaryDark,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    cancelBtn: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderWidth: 1,
      color: '#fff',
      backgroundColor: 'transparent',
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
    nextBtn: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: '#fff',
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
    stepInidicator: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
  });
