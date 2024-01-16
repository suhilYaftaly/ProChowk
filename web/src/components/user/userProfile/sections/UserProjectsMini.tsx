import { Card, CardActionArea, Stack, useTheme } from "@mui/material";
import { CheckCircle, ChangeCircle, ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import { iconCircleSX } from "@/styles/sxStyles";
import { paths } from "@/routes/Routes";
import PostJobBtn from "@/components/headerSection/PostJobBtn";
import { IJob } from "@gqlOps/job";

interface Props extends ISectionProps {
  jobs: IJob[] | undefined;
  jobsLoading: boolean;
}
export default function UserProjectsMini({
  tmb,
  jobs,
  user,
  isMyProfile,
}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCardClick = (jobId: string) => {
    //TODO: handle draft navigation, maybe take to job edit screen
    if (user?.id) navigate(paths.jobView(jobId));
  };

  // isMyProfile? show all jobs else show jobs which are not drafts
  const filteredJobs = isMyProfile ? jobs : jobs?.filter((job) => !job.isDraft);

  return (
    <Stack>
      <Text type="subtitle" sx={{ mb: tmb }}>
        Projects{" "}
        <Text type="subtitle" component={"span"} cColor="primary">
          ({filteredJobs?.length || "0"})
        </Text>
      </Text>
      {filteredJobs && filteredJobs?.length > 0 ? (
        <Stack spacing={1}>
          {filteredJobs?.map((job) => (
            <Card variant="outlined" key={job.id}>
              <CardActionArea
                sx={{ p: 1.5 }}
                onClick={() => handleCardClick(job.id)}
              >
                <Stack
                  direction={"row"}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Stack direction={"row"} alignItems={"center"}>
                    {job.isDraft ? (
                      <ChangeCircle color="info" />
                    ) : (
                      <CheckCircle color="success" />
                    )}
                    <Text sx={{ mx: 1, fontWeight: 450 }}>{job.title}</Text>
                  </Stack>
                  <ChevronRight
                    sx={{
                      ...iconCircleSX(theme),
                      width: 20,
                      height: 20,
                      p: 0,
                      border: "1px solid",
                    }}
                  />
                </Stack>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      ) : (
        <NoJobsFound isMyProfile={isMyProfile} />
      )}
    </Stack>
  );
}

const NoJobsFound = ({ isMyProfile }: { isMyProfile: boolean }) => {
  return (
    <Stack alignItems={"center"}>
      <Text type="subtitle" sx={{ my: 1 }}>
        No jobs found
      </Text>
      <Text>Posted jobs will be here!</Text>
      {isMyProfile && <PostJobBtn sx={{ mt: 3 }} />}
    </Stack>
  );
};
