import { useNavigate, useSearchParams } from "react-router-dom";
import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { useState, useEffect } from "react";

import AppContainer from "@reusable/AppContainer";
import { IJob, useUserJobs } from "@gqlOps/job";
import { useUserStates } from "@/redux/reduxStates";
import JobsCards from "@jobs/searchJobs/JobsCards";
import { paths } from "@/routes/Routes";
import Text from "@reusable/Text";
import { isContractor } from "@/utils/auth";
import { useContractor } from "@gqlOps/contractor";
import { useGetBids } from "@gqlOps/jobBid";

export type JobType = "Posted" | "Draft" | "Active" | "Bidding";

export default function UserJobTypes() {
  const [searchParams] = useSearchParams();
  const jobTypeQuery = searchParams.get("jobType") as JobType | null;
  const navigate = useNavigate();
  const { user } = useUserStates();
  const userId = user?.id;
  const [activeTab, setActiveTab] = useState<JobType>(jobTypeQuery || "Posted");
  const {
    userJobsAsync,
    data: userJobs,
    loading: userJobsLoading,
  } = useUserJobs();
  const {
    contractorAsync,
    data: contrData,
    loading: contactorLoading,
  } = useContractor();
  const contractorId = contrData?.contractor?.id;

  const { getBidsAsync, data: bidsData, loading: bidsLoading } = useGetBids();
  const bids = bidsData?.getBids;

  const bidJobsLoading = bidsLoading || contactorLoading;
  const isUserContractor = isContractor(user?.userTypes);

  // Update the active tab whenever the URL query parameter changes
  useEffect(() => {
    if (jobTypeQuery) setActiveTab(jobTypeQuery);
  }, [jobTypeQuery]);

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
  const { activeJobs, biddingJobs } = (bids ?? []).reduce<JobCategorization>(
    (acc, bid) => {
      if (bid?.job) {
        if (bid.isAccepted && bid.job?.status === "InProgress") {
          acc.activeJobs.push(bid.job);
        } else if (!bid.isRejected && !bid.isAccepted) {
          acc.biddingJobs.push(bid.job);
        }
      }
      return acc;
    },
    { activeJobs: [], biddingJobs: [] }
  );

  const handleDraftClick = (job: IJob) => navigate(paths.jobPost(job.id));

  const tabs = [
    ...(isUserContractor
      ? [
          {
            label: "Active",
            total: activeJobs?.length ?? 0,
            comp: (
              <JobsWrapper
                length={activeJobs?.length}
                children={
                  <JobsCards jobs={activeJobs} loading={bidJobsLoading} />
                }
              />
            ),
          },
          {
            label: "Bidding",
            total: biddingJobs?.length ?? 0,
            comp: (
              <JobsWrapper
                length={biddingJobs?.length}
                children={
                  <JobsCards jobs={biddingJobs} loading={bidJobsLoading} />
                }
              />
            ),
          },
        ]
      : []),
    {
      label: "Posted",
      total: postedJobs?.length ?? 0,
      comp: (
        <JobsWrapper
          length={postedJobs?.length}
          children={
            <JobsCards
              jobs={postedJobs}
              loading={userJobsLoading}
              allowDelete
            />
          }
        />
      ),
    },
    {
      label: "Draft",
      total: draftJobs?.length ?? 0,
      comp: (
        <JobsWrapper
          length={draftJobs?.length}
          children={
            <JobsCards
              jobs={draftJobs}
              loading={userJobsLoading}
              onJobClick={handleDraftClick}
              allowDelete
              showDraftExpiry
            />
          }
        />
      ),
    },
  ];

  return (
    <AppContainer addCard>
      <Tabs
        variant="scrollable"
        value={activeTab}
        onChange={(_, newTab) => setActiveTab(newTab)}
      >
        {tabs.map(
          (tab) =>
            tab && (
              <Tab
                key={tab.label}
                label={`${tab.label} (${tab.total})`}
                value={tab.label}
              />
            )
        )}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      {tabs.find((tab) => tab.label === activeTab)?.comp}
    </AppContainer>
  );
}

interface JobCategorization {
  activeJobs: IJob[];
  biddingJobs: IJob[];
}

interface IJobsWrapper {
  length: number | undefined;
  children: React.ReactNode;
}
const JobsWrapper = ({ length, children }: IJobsWrapper) => {
  return <>{length === 0 ? <NoJobsFound /> : children}</>;
};

const NoJobsFound = () => (
  <Stack alignItems={"center"} sx={{ m: 5 }}>
    <Text type="subtitle" sx={{ my: 1 }}>
      No jobs found
    </Text>
    <Text>Found jobs will be here!</Text>
  </Stack>
);
