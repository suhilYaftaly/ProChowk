import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Input, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  labelText: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isSecret?: boolean;
  isError?: boolean;
  errorText?: string;
  hidePass?: boolean;
  setHidePass?: any;
};

const InputWithLabel = ({
  labelText,
  onChange,
  placeholder,
  value,
  errorText,
  isError,
  isSecret,
  hidePass,
  setHidePass,
}: Props) => {
  return (
    <YStack space={'$1.5'}>
      <Text style={styles.labelText}>
        {labelText} <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      {isSecret ? (
        <View style={styles.passwordContainer}>
          <Input
            size={'$3'}
            flex={1}
            borderWidth={0}
            style={styles.inputText}
            placeholder={placeholder}
            secureTextEntry={hidePass}
            textContentType="newPassword"
            autoCorrect={false}
            value={value}
            onChangeText={(e) => onChange(e)}
          />
          <Pressable onPress={() => setHidePass(!hidePass)}>
            <Ionicons name={hidePass ? 'eye-off' : 'eye'} size={20} color="black" />
          </Pressable>
        </View>
      ) : (
        <Input
          size={'$3'}
          placeholder={placeholder}
          style={styles.inputText}
          value={value}
          onChangeText={(e) => onChange(e)}
        />
      )}
      {!isError && <Text style={{ color: colors.error }}>*{errorText}</Text>}
    </YStack>
  );
};

export default InputWithLabel;

const styles = StyleSheet.create({
  labelText: { fontFamily: 'InterBold' },
  passwordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingRight: 10,
  },
  inputText: {
    color: colors.black,
    fontFamily: 'Inter',
    backgroundColor: 'transparent',
  },
});
