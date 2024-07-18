import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

interface Props {
  pageName: string;
}

const CustomHeader = ({ pageName }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <SafeAreaView edges={['top']}>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Ionicons name="chevron-back-circle" size={30} color={theme.textDark} />
        <Text style={styles.buttonText}>{pageName}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CustomHeader;

const getStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'InterExtraBold',
      marginLeft: 5,
      color: theme.textDark,
    },
  });
