import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ViewJob from '~/src/components/jobs/ViewJob';

const jobPage = () => {
  const { jobId } = useLocalSearchParams();
  return <ViewJob jobId={jobId} />;
};

export default jobPage;
