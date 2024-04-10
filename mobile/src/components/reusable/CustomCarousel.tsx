import { Animated, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import React, { useRef, useState } from 'react';
import colors from '~/src/constants/colors';

type Props = {
  dataList: any;
  renderComp: ListRenderItem<any>;
};

const CustomCarousel = ({ dataList, renderComp }: Props) => {
  const [currSlideIndex, setCurrSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrSlideIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View>
      <FlatList
        ref={slidesRef}
        data={dataList}
        renderItem={renderComp}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        bounces={false}
        keyExtractor={(item) => item?.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      {dataList?.length > 1 && (
        <PaginatorDots dataList={dataList} currSlideIndex={currSlideIndex} />
      )}
    </View>
  );
};

const PaginatorDots = ({ dataList, currSlideIndex }: any) => {
  return (
    <View style={styles.dotCont}>
      {dataList?.map((item: any, index: number) => {
        return (
          <Animated.View
            style={[
              styles.dot,
              {
                width: 10,
                backgroundColor: currSlideIndex === index ? colors.primary : colors.border,
              },
            ]}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
};

export default CustomCarousel;

const styles = StyleSheet.create({
  dotCont: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 15,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
