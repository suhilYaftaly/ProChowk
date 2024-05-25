import {
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import Card from '../../reusable/Card';
import labels from '~/src/constants/labels';
import { IContractor, ILicense } from '~/src/graphql/operations/contractor';
import colors from '~/src/constants/colors';
import CustomCarousel from '../../reusable/CustomCarousel';
import CustomModal from '../../reusable/CustomModal';
import EditLicenses from './editModals/EditLicenses';
import AddLicense from './editModals/AddLicense';
import ImageViewCont from '../../reusable/ImageViewCont';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
type Props = {
  contractorData?: IContractor;
  licenses?: ILicense[];
  isMyProfile: boolean;
};

const UserLicenses = ({ contractorData, licenses, isMyProfile }: Props) => {
  const { width } = useWindowDimensions();
  const [addLicensesOpen, setAddLicensesOpen] = useState<boolean>(false);
  const [licensesEditOpen, setLicensesEditOpen] = useState<boolean>(false);
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);
  const imageUrls: IImageInfo[] | undefined = licenses?.map((license) => {
    return { url: license?.url, id: license?.id, name: license?.name };
  });
  const renderListItem: ListRenderItem<any> = ({ item }) => (
    <View style={[styles.licensePage, { width: width * 0.8 }]}>
      <Pressable
        onPress={() => {
          /*  setSeleImageUrl(item?.url); */
          setImageViewOpen(true);
        }}>
        <Image
          style={styles.licenseImage}
          source={{
            uri: `${item?.url}`,
          }}
          resizeMode="contain"
        />
      </Pressable>
      <Text style={styles.licenseName} numberOfLines={2} ellipsizeMode={'tail'}>
        {item?.name}
      </Text>
    </View>
  );

  return (
    <>
      <Card
        isAddAvailable={isMyProfile}
        onAddPress={() => setAddLicensesOpen(true)}
        isEditable={isMyProfile && licenses && licenses?.length > 0}
        onEditPress={() => setLicensesEditOpen(true)}
        entityCount={licenses?.length}
        cardLabel={labels.licenses}
        cardBodyStyle={styles.cardBodyStyle}
        children={
          licenses && licenses?.length > 0 ? (
            <View style={{ height: 200, width: width * 0.8 }}>
              <CustomCarousel dataList={licenses} renderComp={renderListItem} />
            </View>
          ) : (
            <></>
          )
        }
      />
      <CustomModal
        headerText={labels.licensesLabel}
        itemCount={licenses?.length}
        isOpen={licensesEditOpen}
        setIsOpen={setLicensesEditOpen}
        width={'90%'}
        maxHeight={'70%'}
        dialogCom={
          <EditLicenses
            contractorData={contractorData}
            licenses={licenses}
            closeDialog={() => setLicensesEditOpen(false)}
          />
        }
      />
      <CustomModal
        headerText={labels.addLicenseLabel}
        isOpen={addLicensesOpen}
        setIsOpen={setAddLicensesOpen}
        width={'90%'}
        dialogCom={
          <AddLicense
            contractorData={contractorData}
            closeDialog={() => setAddLicensesOpen(false)}
          />
        }
      />
      {imageUrls && imageUrls?.length > 0 && imageViewOpen && (
        <ImageViewCont
          isOpen={imageViewOpen}
          setIsOpen={(open: boolean) => setImageViewOpen(open)}
          imageUrls={imageUrls}
        />
      )}
    </>
  );
};

export default UserLicenses;

const styles = StyleSheet.create({
  carouselCont: {
    height: '100%',
    width: '100%',
  },
  licensePage: {
    flexDirection: 'column',
  },
  licenseImage: {
    height: 150,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 7,
  },
  licenseName: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.textDark,
    marginVertical: 10,
  },
  cardBodyStyle: {
    alignItems: 'center',
    paddingBottom: 25,
  },
});
