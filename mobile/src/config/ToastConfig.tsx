import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../utils/hooks/ThemeContext';

export const toastConfig = {
  success: (props: any) => <CustomToast type="success" textMSG={props?.text1} />,
  error: (props: any) => <CustomToast type="error" textMSG={props?.text1} />,
  info: (props: any) => <CustomToast type="info" textMSG={props?.text1} />,
  warning: (props: any) => <CustomToast type="warning" textMSG={props?.text1} />,
};
interface Props {
  type: 'success' | 'error' | 'info' | 'warning';
  textMSG: string;
}

const CustomToast = ({ type, textMSG }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const iconMap: any = {
    success: {
      color: theme.success,
      icon: <AntDesign name="checkcircle" size={24} color={'#fff'} style={styles.icon} />,
    },
    error: {
      color: theme.error,
      icon: <MaterialIcons name="error" size={24} color={'#fff'} style={styles.icon} />,
    },
    info: {
      color: theme.info,
      icon: <Entypo name="info-with-circle" size={24} color={'#fff'} style={styles.icon} />,
    },
    warning: {
      color: theme.warning,
      icon: <AntDesign name="warning" size={24} color={'#fff'} style={styles.icon} />,
    },
  };

  const { icon, color } = iconMap[type] || iconMap.info;
  return (
    <View
      style={[
        styles.container,
        {
          top: Platform.OS === 'ios' ? 15 : undefined,
          backgroundColor: color,
          borderLeftColor: color,
        },
      ]}>
      {icon}
      <View style={styles.content}>
        <Text style={styles.text1}>{textMSG}</Text>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10,
      width: '90%',
      paddingVertical: 10,
      borderRadius: 10,
      position: 'absolute',
      zIndex: 9999,
    },
    icon: {
      marginRight: 10,
    },
    content: {
      flex: 1,
      paddingHorizontal: 15,
    },
    text1: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      fontFamily: 'InterBold',
      flexShrink: 1,
    },
  });
