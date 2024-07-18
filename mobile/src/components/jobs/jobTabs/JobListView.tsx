import { ListRenderItem, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTabs, { tabType } from '../../reusable/CustomTabs';
import { useUserStates } from '~/src/redux/reduxStates';
import { IJob, useUserJobs } from '~/src/graphql/operations/job';
import { useContractor } from '~/src/graphql/operations/contractor';
import { isContractor } from '~/src/utils/auth';
import { useGetBids } from '~/src/graphql/operations/jobBid';
import NoResultFound from '../../reusable/NoResultFound';
import labels from '~/src/constants/labels';
import { FlatList } from 'react-native-gesture-handler';
import JobCard from '../../user/client/JobCard';
import { router } from 'expo-router';
import JobPost from '../jobPost/JobPost';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import CustomContentLoader from '../../reusable/CustomContentLoader';

export type JobType = 'Posted' | 'Draft' | 'Active' | 'Bidding' | 'Completed';
interface JobCategorization {
  activeJobs: IJob[];
  biddingJobs: IJob[];
  completedJobs: IJob[];
}

const JobListView = () => {
  const { user } = useUserStates();
  const { theme } = useAppTheme();
  const userId = user?.id;
  const [draftJobID, setDraftJobID] = useState<string>();
  const [openDraftJob, setOpenDraftJob] = useState(false);
  const { userJobsAsync, data: userJobs, loading: userJobsLoading } = useUserJobs();
  const { contractorAsync, data: contrData, loading: contactorLoading } = useContractor();
  const contractorId = contrData?.contractor?.id;

  const { getBidsAsync, data: bidsData, loading: bidsLoading } = useGetBids();
  const bids = bidsData?.getBids;

  const bidJobsLoading = bidsLoading || contactorLoading;
  const isUserContractor = isContractor(user?.userTypes);

  useEffect(() => {
    //retrieve user jobs and contractor
    if (userId) {
      userJobsAsync({ variables: { userId } });
      if (isUserContractor) contractorAsync({ variables: { userId } });
    }
  }, [userId]);

  //get contractor bids
  useEffect(() => {
    if (contractorId) {
      getBidsAsync({ variables: { filter: { contractorId } } });
    }
  }, [contractorId]);

  const postedJobs = userJobs?.userJobs?.filter((job) => !job.isDraft);
  const draftJobs = userJobs?.userJobs?.filter((job) => job.isDraft);
  const { activeJobs, biddingJobs, completedJobs } = (bids ?? []).reduce<JobCategorization>(
    (acc, bid) => {
      if (bid?.job) {
        if (bid.status === 'Accepted' && bid.job?.status === 'InProgress') {
          acc.activeJobs.push(bid.job);
        } else if (bid.status === 'Open') {
          acc.biddingJobs.push(bid.job);
        } else if (bid.status === 'Completed' && bid.job?.status === 'Completed') {
          acc.completedJobs.push(bid.job);
        }
      }
      return acc;
    },
    { activeJobs: [], biddingJobs: [], completedJobs: [] }
  );

  const handleDraftClick = (job: IJob) => {
    setDraftJobID(job.id);
    setOpenDraftJob(true);
  };

  const tabs: tabType[] = [
    {
      title: 'Active',
      totalCount: activeJobs?.length,
      tabContent: JobsWrapperCont(activeJobs, bidJobsLoading),
    },
    {
      title: 'Bidding',
      totalCount: biddingJobs?.length,
      tabContent: JobsWrapperCont(biddingJobs, bidJobsLoading),
    },
    {
      title: 'Completed',
      totalCount: completedJobs?.length,
      tabContent: JobsWrapperCont(completedJobs, bidJobsLoading),
    },
    {
      title: 'Posted',
      totalCount: postedJobs?.length,
      tabContent: JobsWrapperCont(postedJobs, userJobsLoading, undefined, true),
    },
    {
      title: 'Draft',
      totalCount: draftJobs?.length,
      tabContent: JobsWrapperCont(draftJobs, userJobsLoading, handleDraftClick, true, true),
    },
  ];
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.08 }}>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(activeTabIndex: number) => handleTabChange(activeTabIndex)}
        />
      </View>
      {tabs.map(
        (tab, index) =>
          activeTab === index && (
            <View style={{ flex: 0.92, backgroundColor: theme.bg }} key={index}>
              {tab?.tabContent}
            </View>
          )
      )}
      {user && (
        <Modal
          animationType="fade"
          visible={openDraftJob}
          onRequestClose={() => {
            setOpenDraftJob(!openDraftJob);
          }}>
          <View style={[styles.modalView]}>
            <JobPost onCancel={() => setOpenDraftJob(!openDraftJob)} jobID={draftJobID} />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default JobListView;

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '100%',
  },
});

const JobsWrapperCont = (
  jobs?: IJob[],
  isLoading: boolean = false,
  onJobClick?: (job: IJob) => void,
  allowDelete: boolean = false,
  showDraftExpiry: boolean = false
) => {
  const { theme } = useAppTheme();
  const renderListItem: ListRenderItem<IJob> = ({ item }) => (
    <JobCard
      job={item}
      onClick={onJobClick ? () => onJobClick(item) : undefined}
      allowDelete={allowDelete}
      showDraftExpiry={showDraftExpiry}
    />
  );

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: theme.bg,
      }}>
      {isLoading ? (
        <CustomContentLoader type="jobCard" size={18} repeat={5} gap={10} />
      ) : jobs && jobs?.length > 0 ? (
        <FlatList data={jobs} renderItem={renderListItem} showsVerticalScrollIndicator={false} />
      ) : (
        <NoResultFound searchType={labels.jobs.toLowerCase()} />
      )}
    </View>
  );
};
