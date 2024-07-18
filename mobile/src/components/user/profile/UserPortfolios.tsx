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
import { IContractor } from '~/src/graphql/operations/contractor';
import CustomCarousel from '../../reusable/CustomCarousel';
import CustomModal from '../../reusable/CustomModal';
import EditPortfolios from './editModals/EditPortfolios';
import AddPortfolio from './editModals/AddPortfolio';
import ImageViewCont from '../../reusable/ImageViewCont';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { ContractorPortfolio } from '~/src/graphql/operations/contractorPortfolio';

type Props = {
  contractorData?: IContractor;
  portfolios?: ContractorPortfolio[];
  isMyProfile: boolean;
};

const UserPortfolios = ({ contractorData, portfolios, isMyProfile }: Props) => {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [addPortfoliosOpen, setAddPortfoliosOpen] = useState<boolean>(false);
  const [portfolioEditOpen, setPortfoliosEditOpen] = useState<boolean>(false);
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);
  const imageUrls: IImageInfo[] | undefined = portfolios?.map((portfolio: ContractorPortfolio) => {
    return {
      url: portfolio?.images?.[0]?.url,
      id: portfolio?.images?.[0]?.id,
      name: portfolio?.images?.[0]?.name,
    };
  });
  const renderListItem: ListRenderItem<any> = ({ item }) => (
    <View style={[styles.portfolioPage, { width: width * 0.8 }]}>
      <Pressable
        onPress={() => {
          setImageViewOpen(true);
        }}>
        <Image
          style={styles.portfolioImage}
          source={{
            uri: `${item?.images?.[0]?.url}`,
          }}
          resizeMode="contain"
        />
      </Pressable>
      <Text style={styles.portfolioName} numberOfLines={2} ellipsizeMode={'tail'}>
        {item?.title}
      </Text>
      <Text style={styles.portfolioDesc} numberOfLines={2} ellipsizeMode={'tail'}>
        {item?.description}
      </Text>
    </View>
  );

  return (
    <>
      <Card
        isAddAvailable={isMyProfile}
        onAddPress={() => setAddPortfoliosOpen(true)}
        isEditable={isMyProfile && portfolios && portfolios?.length > 0}
        onEditPress={() => setPortfoliosEditOpen(true)}
        entityCount={portfolios?.length}
        cardLabel={labels.portfolios}
        cardBodyStyle={styles.cardBodyStyle}
        children={
          portfolios && portfolios?.length > 0 ? (
            <View style={{ height: 225, width: width * 0.8 }}>
              <CustomCarousel dataList={portfolios} renderComp={renderListItem} />
            </View>
          ) : (
            <></>
          )
        }
      />
      <CustomModal
        headerText={labels.portfolios}
        itemCount={portfolios?.length}
        isOpen={portfolioEditOpen}
        setIsOpen={setPortfoliosEditOpen}
        width={'90%'}
        maxHeight={'70%'}
        dialogCom={
          <EditPortfolios
            contractorData={contractorData}
            portfolios={portfolios}
            closeDialog={() => setPortfoliosEditOpen(false)}
          />
        }
      />
      <CustomModal
        headerText={labels.addPortfolio}
        isOpen={addPortfoliosOpen}
        setIsOpen={setAddPortfoliosOpen}
        width={'90%'}
        dialogCom={
          <AddPortfolio
            contractorData={contractorData}
            closeDialog={() => setAddPortfoliosOpen(false)}
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

export default UserPortfolios;

const getStyles = (theme: any) =>
  StyleSheet.create({
    carouselCont: {
      height: '100%',
      width: '100%',
    },
    portfolioPage: {
      flexDirection: 'column',
    },
    portfolioImage: {
      height: 150,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 7,
    },
    portfolioName: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
      marginVertical: 5,
    },
    portfolioDesc: {
      fontFamily: 'InterRegular',
      fontSize: 15,
      color: theme.textDark,
    },
    cardBodyStyle: {
      alignItems: 'center',
      paddingBottom: 25,
    },
  });
