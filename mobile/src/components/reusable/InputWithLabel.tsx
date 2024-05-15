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
  isWithPrefix?: boolean;
  isWithPostfix?: boolean;
  isError?: boolean;
  errorText?: string;
  hidePass?: boolean;
  setHidePass?: any;
  isDisabled?: boolean;
  gap?: number;
  prefixText?: string;
  postfixText?: string;
  isNumeric?: boolean;
};

const InputWithLabel = ({
  labelText,
  onChange,
  placeholder,
  value,
  errorText,
  isError,
  isSecret,
  isWithPrefix,
  isWithPostfix,
  hidePass,
  setHidePass,
  isDisabled,
  gap = 1.5,
  prefixText,
  postfixText,
  isNumeric,
}: Props) => {
  return (
    <YStack space={`$${gap}`}>
      <Text style={styles.labelText}>
        {labelText} <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      {isSecret ? (
        <View style={styles.passwordContainer}>
          <Input
            size={'$3'}
            flex={1}
            borderWidth={0}
            inputMode={isNumeric ? 'numeric' : undefined}
            style={styles.inputText}
            backgroundColor={isDisabled ? colors.bg : colors.white}
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
      ) : isWithPostfix || isWithPostfix ? (
        <View style={styles.inputWithLabelsCont}>
          {isWithPrefix && <Text style={styles.labelText}>{prefixText}</Text>}
          <Input
            size={'$3'}
            flex={1}
            borderWidth={0}
            inputMode={isNumeric ? 'numeric' : undefined}
            style={styles.inputText}
            backgroundColor={isDisabled ? colors.bg : colors.white}
            disabled={isDisabled}
            placeholder={placeholder}
            value={value}
            onChangeText={(e) => onChange(e)}
          />
          {isWithPostfix && <Text style={styles.labelText}>{postfixText}</Text>}
        </View>
      ) : (
        <Input
          size={'$3'}
          placeholder={placeholder}
          inputMode={isNumeric ? 'numeric' : undefined}
          style={styles.inputText}
          backgroundColor={isDisabled ? colors.bg : colors.white}
          borderColor={colors.border}
          disabled={isDisabled}
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
  inputWithLabelsCont: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingHorizontal: 10,
  },
  inputText: {
    color: colors.black,
    fontFamily: 'Inter',
  },
});
