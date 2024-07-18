import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IJob, JobInput } from '~/src/graphql/operations/job';
import { Image, Separator, XStack, YStack } from 'tamagui';
import ImagePreview from '../../reusable/ImagePreview';
import { readISODate } from '~/src/utils/utilFuncs';
import Chip from '../../reusable/Chip';
import { SkillInput } from '~/src/graphql/operations/skill';
import labels from '~/src/constants/labels';
import ImageViewCont from '../../reusable/ImageViewCont';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
interface Props {
  job: IJob | JobInput;
}

const JobPreview = ({ job }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { title, desc, address, budget, skills, images, startDate, endDate } = job;
  const isHourly = budget?.type === 'Hourly';
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);
  const imageUrls = images?.map((image) => {
    return { url: image?.url, name: image?.name };
  });
  const [descReadExpanded, setDescReadExpanded] = useState(false);
  return (
    <View style={styles.jobDetailsCont}>
      <Text style={styles.titleText}>
        {title} - {address?.city} {address?.stateCode}, {address?.countryCode}
      </Text>
      <Text style={styles.boldText}>
        {budget?.type}:{' '}
        <Text style={[styles.normalText, { color: theme.primary }]}>
          {isHourly && `$${budget?.from}-`}${budget?.to}
        </Text>
        {isHourly && (
          <>
            {' '}
            |{labels.maxHours}:{' '}
            <Text style={[styles.normalText, { color: theme.primary }]}>{budget?.maxHours}hr</Text>
          </>
        )}
      </Text>
      <View style={styles.descCont}>
        <Text style={styles.boldText}>{labels.jobDesc}</Text>
        <Text
          style={styles.normalText}
          numberOfLines={descReadExpanded ? undefined : 10}
          ellipsizeMode={descReadExpanded ? undefined : 'tail'}>
          {desc}
        </Text>
        {desc?.trim()?.length > 500 && (
          <Pressable onPress={() => setDescReadExpanded(!descReadExpanded)}>
            <Text style={{ fontFamily: 'InterBold', fontSize: 16, color: theme.primary }}>
              {labels.read} {descReadExpanded ? labels.less : labels.more}
            </Text>
          </Pressable>
        )}
      </View>
      {images && images?.length > 0 && (
        <>
          <Separator borderColor={theme.border} />
          <YStack gap={'$2.5'} marginVertical={10}>
            <Text style={styles.boldText}>{labels.jobImages}</Text>
            <View style={styles.seleImagesCont}>
              {images?.map((image) => {
                return (
                  <Pressable key={image?.name} onPress={() => setImageViewOpen(true)}>
                    <ImagePreview imgHeight={70} imgWidth={70} image={image} />
                  </Pressable>
                );
              })}
            </View>
            {imageUrls && imageUrls?.length > 0 && imageViewOpen && (
              <ImageViewCont
                isOpen={imageViewOpen}
                setIsOpen={(open: boolean) => setImageViewOpen(open)}
                imageUrls={imageUrls}
              />
            )}
          </YStack>
        </>
      )}
      {('createdAt' in job || startDate || endDate) && (
        <>
          <Separator borderColor={theme.border} />
          <XStack space={'$4'} marginVertical={10}>
            {'createdAt' in job && (
              <YStack gap={'$2.5'}>
                <Text style={styles.boldText}>{labels.jobPosted}</Text>
                <Text style={styles.normalText}>{readISODate(job?.createdAt)}</Text>
              </YStack>
            )}
            {startDate && (
              <YStack gap={'$2.5'}>
                <Text style={styles.boldText}>{labels.startDate}</Text>
                <Text style={styles.normalText}>{readISODate(startDate)}</Text>
              </YStack>
            )}
            {endDate && (
              <YStack gap={'$2.5'}>
                <Text style={styles.boldText}>{labels.endDate}</Text>
                <Text style={styles.normalText}>{readISODate(endDate)}</Text>
              </YStack>
            )}
          </XStack>
        </>
      )}
      <Separator borderColor={theme.border} />
      <YStack gap={'$2.5'} marginVertical={10}>
        <Text style={styles.boldText}>{labels.skillsRequired}</Text>
        <View style={styles.chipsCont}>
          {skills?.map((skill: SkillInput, index: number) => {
            return <Chip key={index} label={skill?.label} isDisplay={true} />;
          })}
        </View>
      </YStack>
    </View>
  );
};

export default JobPreview;

const getStyles = (theme: any) =>
  StyleSheet.create({
    jobDetailsCont: {
      backgroundColor: theme.white,
      padding: 20,
    },
    titleText: {
      fontFamily: 'InterBold',
      fontSize: 18,
      color: theme.textDark,
      marginBottom: 10,
    },
    boldText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    normalText: {
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      color: theme.silver,
    },
    descCont: {
      marginVertical: 10,
    },
    seleImagesCont: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    chipsCont: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 5,
    },
  });
