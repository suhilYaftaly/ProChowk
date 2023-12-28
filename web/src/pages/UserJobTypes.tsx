import { useNavigate, useSearchParams } from "react-router-dom";
import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { useState, useEffect } from "react";

import AppContainer from "@reusable/AppContainer";
import { IJob, useUserJobs } from "@gqlOps/job";
import { useUserStates } from "@/redux/reduxStates";
import JobsCards from "@jobs/searchJobs/JobsCards";
import { paths } from "@/routes/Routes";
import Text from "@reusable/Text";

export type JobType = "Posted" | "Draft";

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

  // Update the active tab whenever the URL query parameter changes
  useEffect(() => {
    if (jobTypeQuery) setActiveTab(jobTypeQuery);
  }, [jobTypeQuery]);

  //retrieve user jobs
  useEffect(() => {
    if (userId) userJobsAsync({ variables: { userId } });
  }, [userId]);

  const postedJobs = userJobs?.userJobs?.filter((job) => !job.isDraft);
  const draftJobs = userJobs?.userJobs?.filter((job) => job.isDraft);

  const handleDraftClick = (job: IJob) => navigate(paths.jobPost(job.id));

  const tabs = [
    {
      label: "Posted",
      total: postedJobs?.length ?? 0,
      comp: <UserJobsCards jobs={postedJobs} loading={userJobsLoading} />,
    },
    {
      label: "Draft",
      total: draftJobs?.length ?? 0,
      comp: (
        <UserJobsCards
          jobs={draftJobs}
          loading={userJobsLoading}
          onClick={handleDraftClick}
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
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={`${tab.label} (${tab.total})`}
            value={tab.label}
          />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      {tabs.find((tab) => tab.label === activeTab)?.comp}
    </AppContainer>
  );
}

interface IUserJobsCards {
  jobs: IJob[] | undefined;
  loading: boolean;
  onClick?: (job: IJob) => void;
}
const UserJobsCards = ({ jobs, loading, onClick }: IUserJobsCards) => {
  return (
    <>
      {jobs?.length === 0 ? (
        <NoJobsFound />
      ) : (
        <JobsCards
          jobs={jobs}
          loading={loading}
          onJobClick={onClick}
          allowDelete
          showDraftExpiry
        />
      )}
    </>
  );
};

const NoJobsFound = () => (
  <Stack alignItems={"center"} sx={{ m: 5 }}>
    <Text type="subtitle" sx={{ my: 1 }}>
      No jobs found
    </Text>
    <Text>Found jobs will be here!</Text>
  </Stack>
);
