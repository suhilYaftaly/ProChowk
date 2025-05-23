import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, TextArea, YStack } from 'tamagui';
import CustomSelectMenu from '../../reusable/CustomSelectMenu';
import { router } from 'expo-router';
import { useUserStates } from '~/src/redux/reduxStates';
import { UserType, useUpdateUser } from '~/src/graphql/operations/user';
import SkillSelection from './SkillSelection';
import { SkillInput } from '~/src/graphql/operations/skill';
import AddressSearch from './AddressSearch';
import { AddressInput, IAddress } from '~/src/graphql/operations/address';
import labels from '~/src/constants/labels';
import Routes from '~/src/routes/Routes';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type profileData = {
  userType: UserType;
  skills: SkillInput[];
  location?: AddressInput;
  about?: string;
};
type Props = {
  userType?: string | string[];
};
const UserProfileSetup = ({ userType }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [seleUserType, setSeleUserType] = useState<string>('client');
  const [seleSkills, setSeleSkills] = useState<SkillInput[]>([]);
  const [location, setLocation] = useState<AddressInput>();
  const [about, setAbout] = useState<string>('');

  const [userTypeAvail, setUserTypeAvail] = useState<boolean>(true);
  const [skillsAvail, setSkillsAvail] = useState<boolean>(true);
  const [locationAvail, setLocationAvail] = useState<boolean>(true);
  const [disableSignUpBtn, setDisableSignUpBtn] = useState(false);

  const { updateUserAsync, loading } = useUpdateUser();
  const userTypes: UserType[] = ['client', 'contractor'];

  const { firstName, user } = useUserStates();

  const onSubmit = () => {
    const profileData: profileData = {
      userType: seleUserType as UserType,
      skills: seleSkills,
      location,
      about,
    };
    if (validateUserProfile(profileData)) {
      if (user) {
        setDisableSignUpBtn(true);
        updateUserAsync({
          variables: {
            id: user.id,
            edits: {
              userTypes: [profileData?.userType],
              skills: profileData?.userType === 'contractor' ? profileData.skills : [],
              address: profileData?.location,
              bio: profileData?.about,
            },
          },
          onSuccess: (newUser) => {
            setDisableSignUpBtn(false);
            if (newUser.userTypes.length > 0 && !newUser.emailVerified) {
              router.replace(`/${Routes.emailVerify}`);
            } else if (newUser.userTypes.length > 0) {
              if (user) {
                router.replace(`/${Routes.clientHome}`);
              }
            }
          },
        });
      }
    }
  };

  const validateUserProfile = (userProfile: profileData): boolean => {
    const userType = userProfile?.userType;
    if (!userType) {
      setUserTypeAvail(false);
      return false;
    }
    if (userType === 'contractor' && userProfile?.skills?.length === 0) {
      setSkillsAvail(false);
      return false;
    }
    if (!userProfile?.location?.lat || !userProfile?.location?.lng) {
      setLocationAvail(false);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (userType && typeof userType === 'string') {
      setSeleUserType(userType);
    }
  }, [userType]);

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.formCont}>
        <View style={styles.formHeader}>
          <Text style={styles.headerText}>
            {labels.hey}
            <Text style={[styles.headerText, { color: theme.primary }]}> {firstName} </Text>
            {labels.weAreAlmostDone}
          </Text>
          <Text style={styles.subHeaderText}>{labels.fillUpProfileText}</Text>
        </View>
        <Form onSubmit={onSubmit}>
          <YStack space={'$4'} marginTop={30}>
            <YStack space={'$1.5'}>
              <Text style={styles.labelText}>
                {labels.signUpAs}
                <Text style={{ color: theme.primary }}>*</Text>
              </Text>
              <CustomSelectMenu
                label={labels.selectUserType}
                itemTextTransform={true}
                dDItems={userTypes}
                seleVal={seleUserType}
                setSelectedDDItem={(val: string) => setSeleUserType(val)}
              />
              {!userTypeAvail && (
                <Text style={{ color: theme.error }}>*{labels.userTypeError}</Text>
              )}
            </YStack>
            {seleUserType === 'contractor' && (
              <SkillSelection
                seleSkills={seleSkills}
                setSeleSkills={(val: SkillInput[]) => {
                  setSeleSkills(val);
                  setSkillsAvail(true);
                }}
                isError={skillsAvail}
                errorText={labels.noSkillError}
              />
            )}
            <AddressSearch
              location={location}
              setLocation={(loc: IAddress) => {
                setLocation(loc);
                setLocationAvail(true);
              }}
              isError={locationAvail}
              errorText={labels.addressError}
            />

            <YStack space={'$1.5'}>
              <Text style={styles.labelText}>
                {labels.aboutYou} ({about?.length}/1000)
              </Text>
              <TextArea
                placeholder={labels.tellUsAboutYou}
                size="$3"
                borderWidth={1}
                style={[styles.inputText, { textAlignVertical: 'top' }]}
                value={about}
                maxLength={1000}
                onChangeText={(e) => setAbout(e)}
              />
            </YStack>
          </YStack>
          <Form.Trigger asChild>
            <Button
              backgroundColor={disableSignUpBtn ? theme.border : theme.primary}
              color={disableSignUpBtn ? theme.silver : '#fff'}
              style={styles.button}
              disabled={disableSignUpBtn}
              icon={loading ? () => <Spinner /> : undefined}>
              {labels.getStart}
            </Button>
          </Form.Trigger>
        </Form>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserProfileSetup;

const getStyles = (theme: any) =>
  StyleSheet.create({
    formCont: {
      backgroundColor: theme.white,
      borderRadius: 10,
      padding: 20,
      elevation: 10,
      shadowColor: theme.black,
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      margin: 2,
    },
    formHeader: {
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontFamily: 'InterExtraBold',
      textAlign: 'center',
      color: theme.textDark,
    },
    subHeaderText: {
      fontSize: 13,
      color: theme.silver,
      marginTop: 10,
      fontFamily: 'InterSemiBold',
    },
    labelText: { fontFamily: 'InterBold', color: theme.textDark },
    inputText: {
      color: theme.black,
      backgroundColor: 'transparent',
    },
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginTop: 30,
      marginBottom: 10,
      justifyContent: 'center',
      color: theme.white,
    },
    footerText: { fontSize: 11, color: theme.silver, marginTop: 20, fontFamily: 'InterSemiBold' },
  });
