import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { ISkill, SkillInput, useSkills } from '~/src/graphql/operations/skill';
import { Button, Input, ScrollView, Separator, YStack } from 'tamagui';
import FullScreenDialog from '../../reusable/FullScreenDialog';
import Chip from '../../reusable/Chip';
import labels from '~/src/constants/labels';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import NoResultFound from '../../reusable/NoResultFound';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  isLabelRequire?: boolean;
  seleSkills: SkillInput[];
  setSeleSkills: (skills: SkillInput[]) => void;
  isError: boolean;
  errorText: string;
};

const SkillSelection = ({
  isLabelRequire = true,
  seleSkills,
  setSeleSkills,
  isError,
  errorText,
}: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { skillsAsync, data: allSkillsType, loading: allSkillsLoading } = useSkills();
  const allSkillsData = allSkillsType?.skills;
  const [inputValue, setInputValue] = useState('');
  const [searchedSkills, setSearchedSkills] = useState<ISkill[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const onInputChange = (val: string) => {
    setInputValue(val);
    getAllSkills(val);
  };
  const getAllSkills = (search: string) => {
    skillsAsync({ variables: { search } });
  };
  const handleSkillSelection = (skill: SkillInput) => {
    const isAlreadyAdded = seleSkills.map((s: SkillInput) => s.label).indexOf(skill.label) !== -1;
    if (!isAlreadyAdded) {
      setSeleSkills([...seleSkills, skill]);
    }
  };
  const addSkill = (skill: string) => {
    if (skill !== '') {
      const isAlreadyAdded = seleSkills.map((s: SkillInput) => s.label).indexOf(skill) !== -1;
      if (!isAlreadyAdded) {
        setSeleSkills([...seleSkills, { label: skill }]);
      }
    }
  };

  useEffect(() => {
    if (allSkillsData) setSearchedSkills(allSkillsData);
  }, [allSkillsData]);

  return (
    <YStack space={'$1.5'}>
      {isLabelRequire && (
        <Text style={styles.labelText}>
          {labels.yourSkills}
          <Text style={{ color: theme.primary }}>*</Text>
        </Text>
      )}
      <FullScreenDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerBtnCom={
          <Button
            unstyled
            style={styles.menuButton}
            borderColor={theme.border}
            borderWidth={1}
            borderRadius={7}
            color={theme.textDark}
            iconAfter={<FontAwesome6 name="angle-down" size={17} color={theme.textDark} />}
            onPress={() => setIsOpen(true)}>
            {labels.selectSkills}
          </Button>
        }
        dialogCom={
          <>
            <View style={styles.searchContainer}>
              <Pressable onPress={() => setIsOpen(false)} style={styles.addBtn}>
                <FontAwesome6 name="angle-left" size={20} color={theme.textDark} />
              </Pressable>
              <Input
                size={'$3'}
                flex={1}
                borderWidth={0}
                style={styles.inputText}
                placeholder={labels.searchSkills}
                autoCorrect={false}
                value={inputValue}
                onChangeText={(e) => onInputChange(e)}
              />
              {inputValue && inputValue !== '' && searchedSkills?.length === 0 && (
                <Pressable onPress={() => addSkill(inputValue)} style={styles.addBtn}>
                  <FontAwesome6 name="add" size={20} color={theme.textBlue} />
                </Pressable>
              )}
            </View>
            {seleSkills?.length > 0 && (
              <>
                <View style={styles.chipsCont}>
                  {seleSkills?.map((skill: SkillInput, index: number) => {
                    return (
                      <Chip
                        key={index}
                        label={skill?.label}
                        onClose={(val: string) =>
                          setSeleSkills(
                            seleSkills?.filter((skill: SkillInput) => skill?.label !== val)
                          )
                        }
                      />
                    );
                  })}
                </View>
              </>
            )}
            <Separator />
            {allSkillsLoading ? (
              <CustomContentLoader type={'list'} size={15} repeat={5} />
            ) : searchedSkills && searchedSkills?.length > 0 ? (
              <ScrollView style={styles.skillsCont}>
                {searchedSkills?.map((skill: ISkill, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handleSkillSelection({ label: skill?.label })}>
                      <View style={styles.itemCont}>
                        <Text style={{ color: theme.textDark }}>{skill?.label}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              inputValue && <NoResultFound searchType={labels.skills.toLowerCase()} />
            )}
          </>
        }
      />
      {seleSkills?.length > 0 && (
        <View style={styles.chipsCont}>
          {seleSkills?.length > 0 &&
            seleSkills?.map((skill: SkillInput, index: number) => {
              return (
                <Chip
                  key={index}
                  label={skill?.label}
                  onClose={(val: string) =>
                    setSeleSkills(seleSkills?.filter((skill: SkillInput) => skill?.label !== val))
                  }
                />
              );
            })}
        </View>
      )}
      {!isError && <Text style={{ color: theme.error }}>*{errorText}</Text>}
    </YStack>
  );
};

export default SkillSelection;

const getStyles = (theme: any) =>
  StyleSheet.create({
    labelText: { fontFamily: 'InterBold', color: theme.textDark },
    menuButton: {
      justifyContent: 'space-between',
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      flexDirection: 'row',
      paddingTop: 7,
      paddingBottom: 7,
      paddingLeft: 10,
      paddingRight: 7,
      alignItems: 'center',
    },
    searchContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 7,
      marginTop: 30,
    },
    inputText: {
      color: theme.textDark,
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      backgroundColor: 'transparent',
    },
    itemCont: {
      padding: 15,
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme.border,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addBtn: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderTopRightRadius: 7,
      borderBottomRightRadius: 7,
    },
    skillsCont: {},
    chipsCont: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

export const getNewSkills = ({
  newList,
  oldList,
}: {
  newList: ISkill[];
  oldList: ISkill[];
}): ISkill[] | undefined => {
  if (newList?.length > 0 && oldList?.length > 0) {
    return newList.filter(
      (contSkill) => !oldList.some((listSkill) => listSkill.label === contSkill.label)
    );
  } else return undefined;
};
