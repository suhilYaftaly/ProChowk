import { useEffect, useState } from "react";

import { IJob } from "@gqlOps/job";
import { isContractor } from "@/utils/auth";
import { UserType } from "@gqlOps/user";
import { useUserStates } from "@/redux/reduxStates";
import JobBidDrawer from "./JobBidDrawer";
import { useGetBids } from "@gqlOps/jobBid";
import { useContractor } from "@gqlOps/contractor";
import JobBidButton from "./JobBidButton";
import BidViewDrawer from "../miniBids/BidViewDrawer";

type Props = { job: IJob };
export default function BidThisJob({ job }: Props) {
  const { user } = useUserStates();
  const userId = user?.id;
  const [openJobDrawer, setOpenJobDrawer] = useState(false);
  const [openBidDrawer, setOpenBidDrawer] = useState(false);

  const {
    contractorAsync,
    data: contrData,
    loading: contactorLoading,
  } = useContractor();
  const contractorId = contrData?.contractor?.id;

  const { getBidsAsync, data: bidsData, loading: bidsLoading } = useGetBids();
  const bids = bidsData?.getBids;
  const existingBid = bids?.find(
    (bid) => bid.contractorId === contractorId && bid.jobId === job.id
  );
  const placedBidActive = existingBid && !existingBid.isRejected;

  const btnLoading = bidsLoading || contactorLoading;

  const toggleJobDrawer = () => setOpenJobDrawer(!openJobDrawer);

  //retrieve contractor
  useEffect(() => {
    if (userId && isContractor(user?.userTypes))
      contractorAsync({ variables: { userId } });
  }, [userId, user]);

  useEffect(() => {
    if (contractorId) {
      getBidsAsync({
        variables: { filter: { jobId: job.id, contractorId } },
      });
    }
  }, [contractorId]);

  //prevent self bidding & must be contractor
  const allowBid = isAllowBid({
    userTypes: user?.userTypes,
    userId: user?.id,
    jobUserId: job?.userId,
    jobStatus: job?.status,
  });

  const handleBidClick = () => {
    if (placedBidActive) setOpenBidDrawer(true);
    else toggleJobDrawer();
  };

  if (!allowBid) return null;
  return (
    <>
      <JobBidButton
        existingBid={existingBid}
        loading={btnLoading}
        onClick={handleBidClick}
      />
      {contractorId && (
        <JobBidDrawer
          job={job}
          openDrawer={openJobDrawer}
          onDrawerClose={toggleJobDrawer}
          onDrawerOpen={toggleJobDrawer}
          contractorId={contractorId}
          contactorLoading={contactorLoading}
        />
      )}
      {existingBid && (
        <BidViewDrawer
          openDrawer={openBidDrawer}
          setOpenDrawer={setOpenBidDrawer}
          bid={existingBid}
          job={job}
        />
      )}
    </>
  );
}

type TIsAllowBid = {
  userTypes: UserType[] | undefined;
  jobUserId: string | undefined;
  userId: string | undefined;
  jobStatus: IJob["status"];
};
/**prevent self bidding & must be contractor */
export const isAllowBid = ({
  userTypes,
  userId,
  jobUserId,
  jobStatus,
}: TIsAllowBid) =>
  isContractor(userTypes) &&
  jobUserId !== userId &&
  jobStatus !== "InProgress" &&
  jobStatus !== "Completed";
