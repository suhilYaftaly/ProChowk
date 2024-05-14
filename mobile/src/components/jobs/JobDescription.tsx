import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IJobSteps } from './JobForm';
import colors from '~/src/constants/colors';
import AddressSearch from '../user/signUp/AddressSearch';
import { IAddress } from '~/src/graphql/operations/address';
import { TextArea, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import { Ionicons } from '@expo/vector-icons';
import { getImageFromAlbum, getRandomString } from '~/src/utils/utilFuncs';
import Toast from 'react-native-toast-message';
import { IImage, ImageInput } from '~/src/types/commonTypes';
import { ImagePickerAsset } from 'expo-image-picker';
import ImagePreview from '../reusable/ImagePreview';

const JobDescription = ({ jobForm, setJobForm, errors }: IJobSteps) => {
  const [jobImages, setJobImages] = useState<ImageInput[]>();
  const onValueChange = (name: string, value: string): void => {
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRemoveImage = (id: string) => {
    if (id) {
      setJobImages((prev) => prev?.filter((img) => img.name !== id));
      setJobForm((prev) => ({
        ...prev,
        images: prev.images?.filter((img) => img.name !== id),
      }));
    }
  };
  const handleUploadImage = async () => {
    const uploadedImage = await getImageFromAlbum(true);
    if (uploadedImage && Array.isArray(uploadedImage) && uploadedImage.length > 0) {
      let tempImages: IImage[] = [];
      uploadedImage?.map((image: ImagePickerAsset) => {
        if (image && image?.base64) {
          const seleImage: IImage = {
            name: getRandomString(),
            url: 'data:' + image?.mimeType + ';base64,' + image?.base64,
            type: image?.mimeType ? image?.mimeType : 'image/jpeg',
            size: image?.fileSize ? image?.fileSize : 1000,
          };
          tempImages.push(seleImage);
        }
      });
      setJobImages(tempImages);
      setJobForm((prev) => ({
        ...prev,
        images: tempImages,
      }));
    } else if (uploadedImage === null) {
      Toast.show({
        type: 'error',
        text1: `${labels.imageUploadFailed}`,
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.formCont}>
      <AddressSearch
        location={jobForm?.address}
        setLocation={(loc: IAddress) => {
          setJobForm((prev) => ({ ...prev, address: loc }));
        }}
        isError={!Boolean(errors?.address)}
        errorText={errors?.address}
      />
      <YStack space={'$1.5'}>
        <Text style={styles.labelText}>
          {labels.projectDetails} <Text style={{ color: colors.primary }}>*</Text>
        </Text>
        <TextArea
          placeholder={descPlaceholder}
          size="$3"
          borderWidth={1}
          borderColor={colors.border}
          rows={7}
          style={styles.inputText}
          defaultValue={jobForm?.desc}
          onChangeText={(e) => onValueChange('desc', e)}
        />
        {Boolean(errors?.desc) && <Text style={{ color: colors.error }}>*{errors.desc}</Text>}
      </YStack>
      <Pressable style={styles.imageUploadCont} onPress={() => handleUploadImage()}>
        <Ionicons
          name="cloud-upload"
          size={35}
          color={colors.silver}
          style={{ marginVertical: 10 }}
        />
        <Text style={styles.labelText}>{labels.uploadImage}</Text>
        <Text style={styles.subText}>{labels.imageSubText}</Text>
      </Pressable>
      <View style={styles.seleImagesCont}>
        {jobImages &&
          jobImages?.map((image) => {
            return (
              <ImagePreview
                key={image?.name}
                imgHeight={70}
                imgWidth={70}
                image={image}
                isEditable={true}
                handleRemoveImage={(id: string) => handleRemoveImage(id)}
              />
            );
          })}
      </View>
    </View>
  );
};

export default JobDescription;

const styles = StyleSheet.create({
  formCont: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    rowGap: 20,
  },
  labelText: {
    fontFamily: 'InterBold',
  },
  inputText: {
    fontFamily: 'InterSemiBold',
    color: colors.textDark,
    backgroundColor: 'transparent',
  },
  subText: {
    fontFamily: 'InterSemiBold',
    color: colors.textDark,
    textAlign: 'center',
  },
  imageUploadCont: {
    backgroundColor: colors.bg,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  seleImagesCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
const descPlaceholder =
  'Example: Renovating kitchen and master bathroom. Looking for a modern style with energy-efficient appliances and fixtures. Kitchen size is approx. 300 sq ft. Interested in quartz countertops and hardwood flooring. Planning to start in early May with a budget around $20,000.';
