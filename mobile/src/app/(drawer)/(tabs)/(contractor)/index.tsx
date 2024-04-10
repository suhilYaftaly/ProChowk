import React, { useEffect } from 'react';
import ClientHome from '~/src/components/user/client/ClientHome';
import { setAppLoaded } from '~/src/redux/slices/settingsSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';

const contractor = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setAppLoaded(true));
  }, []);
  return <ClientHome />;
};

export default contractor;
