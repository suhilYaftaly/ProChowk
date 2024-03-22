import React from 'react';
import { Container } from '~/tamagui.config';
import CustomHeader from './CustomHeader';
import { ScrollView } from 'tamagui';

const ScreenContainer = (props: any) => {
  return (
    <Container>
      <CustomHeader pageName={props?.pageName} />
      <ScrollView>{props.children}</ScrollView>
    </Container>
  );
};

export default ScreenContainer;
