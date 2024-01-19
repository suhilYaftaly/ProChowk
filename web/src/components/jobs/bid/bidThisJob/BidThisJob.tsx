import { useEffect, useState } from "react";

import { IJob } from "@gqlOps/job";
import { isContractor } from "@/utils/auth";
import { IUser, UserType } from "@gqlOps/user";
import { useUserStates } from "@/redux/reduxStates";
import JobBidDrawer from "./JobBidDrawer";
import { useGetBids } from "@gqlOps/jobBid";
import { useContractor } from "@gqlOps/contractor";
import JobBidButton from "./JobBidButton";
import BidViewDrawer from "../miniBids/BidViewDrawer";
import CompleteBidBtn from "../../jobPost/completeBid/CompleteBidBtn";
import GiveReviewModal from "@/components/review/GiveReviewModal";

type Props = { job: IJob; jobPoster: IUser | undefined };
export default function BidThisJob({ job, jobPoster }: Props) {
  const { user } = useUserStates();
  const userId = user?.id;
  const [openJobDrawer, setOpenJobDrawer] = useState(false);
  const [openBidDrawer, setOpenBidDrawer] = useState(false);
  const [openRating, setOpenRating] = useState(false);

  const {
    contractorAsync,
    data: contrData,
    loading: contactorLoading,
  } = useContractor();
  const contractorId = contrData?.contractor?.id;

  const { getBidsAsync, data: bidsData, loading: bidsLoading } = useGetBids();
  const bids = bidsData?.getBids;
  const existingBid = bids?.find(
    (bid) =>
      bid.contractorId === contractorId &&
      bid.jobId === job.id &&
      bid.status !== "Rejected"
  );

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
  });

  const handleBidClick = () => {
    if (existingBid) setOpenBidDrawer(true);
    else toggleJobDrawer();
  };

  if (!allowBid) return null;
  if (existingBid?.status === "Accepted")
    return (
      <CompleteBidBtn
        bidId={existingBid.id}
        onSuccess={() => setOpenRating(true)}
      />
    );

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
          jobPoster={jobPoster}
        />
      )}
      {openRating && jobPoster?.id && (
        <GiveReviewModal
          open={openRating}
          onClose={setOpenRating}
          reviewedId={jobPoster.id}
        />
      )}
    </>
  );
}

type TIsAllowBid = {
  userTypes: UserType[] | undefined;
  jobUserId: string | undefined;
  userId: string | undefined;
};
/**prevent self bidding & must be contractor */
export const isAllowBid = ({ userTypes, userId, jobUserId }: TIsAllowBid) =>
  isContractor(userTypes) && jobUserId !== userId;
