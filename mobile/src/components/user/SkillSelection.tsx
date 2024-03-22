import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
import { ISkill, SkillInput, useSkills } from '~/src/graphql/operations/skill';
import {
  Button,
  Card,
  H2,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Spinner,
  YStack,
} from 'tamagui';
import FullScreenDialog from '../reusable/FullScreenDialog';
import Chip from '../reusable/Chip';
import labels from '~/src/constants/labels';

type Props = {
  seleSkills: SkillInput[];
  setSeleSkills: (skills: SkillInput[]) => void;
  isError: boolean;
  errorText: string;
};

const SkillSelection = ({ seleSkills, setSeleSkills, isError, errorText }: Props) => {
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
      <Text style={styles.labelText}>
        {labels.yourSkills}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <FullScreenDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerBtnCom={
          <Button
            unstyled
            style={styles.menuButton}
            borderColor={'$border'}
            borderWidth={1}
            borderRadius={7}
            backgroundColor={'$white'}
            iconAfter={<FontAwesome6 name="angle-down" size={17} color="black" />}
            onPress={() => setIsOpen(true)}>
            {labels.selectSkills}
          </Button>
        }
        dialogCom={
          <>
            <View style={styles.searchContainer}>
              <Pressable onPress={() => setIsOpen(false)} style={styles.addBtn}>
                <FontAwesome6 name="angle-left" size={20} color="black" />
              </Pressable>
              <Input
                size={'$3'}
                flex={1}
                borderWidth={0}
                style={styles.inputText}
                placeholder="Search Skill"
                autoCorrect={false}
                value={inputValue}
                onChangeText={(e) => onInputChange(e)}
              />
              {inputValue && inputValue !== '' && searchedSkills?.length === 0 && (
                <Pressable onPress={() => addSkill(inputValue)} style={styles.addBtn}>
                  <FontAwesome6 name="add" size={20} color={colors.textBlue} />
                </Pressable>
              )}
            </View>
            {seleSkills?.length > 0 && (
              <>
                <Separator />
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
              <Spinner size="large" color="$primary" />
            ) : searchedSkills && searchedSkills?.length > 0 ? (
              <ScrollView padding={0} style={styles.skillsCont}>
                {searchedSkills?.map((skill: ISkill, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handleSkillSelection({ label: skill?.label })}>
                      <View style={styles.itemCont}>
                        <Text>{skill?.label}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <Card size="$4" width={300} height={300} alignSelf="center">
                <Card.Background justifyContent="center" alignItems="center">
                  <Entypo name="emoji-sad" size={100} color={colors.textBlue} />
                  <H2 textAlign="center">{labels.noSkillsMsg}</H2>
                  <Paragraph>{labels.searchForSkillsMsg}</Paragraph>
                </Card.Background>
              </Card>
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
      {!isError && <Text style={{ color: 'red' }}>*{errorText}</Text>}
    </YStack>
  );
};

export default SkillSelection;

const styles = StyleSheet.create({
  labelText: { fontFamily: 'InterBold' },
  menuButton: {
    justifyContent: 'space-between',
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    flex: 1,
    flexDirection: 'row',
    padding: 7,
    alignItems: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    marginTop: 30,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  itemCont: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  skillsCont: {
    flex: 1,
    marginTop: 10,
  },
  chipsCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
