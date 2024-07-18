import { KeyboardAvoidingView, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IUser, UserType } from '~/src/graphql/operations/user';
import { isContractor } from '~/src/utils/auth';
import { IJob } from '~/src/graphql/operations/job';
import { useUserStates } from '~/src/redux/reduxStates';
import { useContractor } from '~/src/graphql/operations/contractor';
import { useGetBids } from '~/src/graphql/operations/jobBid';
import JobBidButton from './JobBidButton';
import FullScreenDialog from '~/src/components/reusable/FullScreenDialog';
import JobBidDialog from './JobBidDialog';
import BidViewDialog from '../process/BidViewDialog';
import GiveReviewModal from '../../completeJob/GiveReviewModal';
import CompleteBidBtn from '../process/CompleteBidBtn';

type Props = { job: IJob; jobPoster: IUser | undefined };

const BidThisJob = ({ job, jobPoster }: Props) => {
  const { user } = useUserStates();
  const userId = user?.id;
  const [openJobBidDialog, setOpenJobBidDialog] = useState(false);
  const [openBidViewDialog, setOpenBidViewDialog] = useState(false);
  const [openRating, setOpenRating] = useState(false);

  const { contractorAsync, data: contrData, loading: contactorLoading } = useContractor();
  const contractorId = contrData?.contractor?.id;

  const { getBidsAsync, data: bidsData, loading: bidsLoading } = useGetBids();
  const bids = bidsData?.getBids;
  const existingBid = bids?.find(
    (bid) => bid.contractorId === contractorId && bid.jobId === job.id && bid.status !== 'Rejected'
  );

  const btnLoading = bidsLoading || contactorLoading;

  const toggleJobBidDialog = () => setOpenJobBidDialog(!openJobBidDialog);

  //retrieve contractor
  useEffect(() => {
    if (userId && isContractor(user?.userTypes)) contractorAsync({ variables: { userId } });
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
    if (existingBid) setOpenBidViewDialog(true);
    else toggleJobBidDialog();
  };

  if (!allowBid) return null;
  if (existingBid?.status === 'Accepted')
    return <CompleteBidBtn bidId={existingBid.id} onSuccess={() => setOpenRating(true)} />;

  return (
    <>
      <JobBidButton existingBid={existingBid} loading={btnLoading} onClick={handleBidClick} />
      {contractorId && (
        <Modal
          animationType="fade"
          visible={openJobBidDialog}
          onRequestClose={() => toggleJobBidDialog()}>
          <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
            <View style={[styles.modalView]}>
              <JobBidDialog
                job={job}
                onDialogClose={toggleJobBidDialog}
                contractorId={contractorId}
                contactorLoading={contactorLoading}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
      {existingBid && (
        <BidViewDialog
          openDrawer={openBidViewDialog}
          setOpenDrawer={setOpenBidViewDialog}
          bid={existingBid}
          job={job}
          jobPoster={jobPoster}
        />
      )}
      {openRating && jobPoster?.id && (
        <GiveReviewModal open={openRating} onClose={setOpenRating} reviewedId={jobPoster.id} />
      )}
    </>
  );
};

export default BidThisJob;

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '100%',
  },
});

type TIsAllowBid = {
  userTypes: UserType[] | undefined;
  jobUserId: string | undefined;
  userId: string | undefined;
};
/**prevent self bidding & must be contractor */
export const isAllowBid = ({ userTypes, userId, jobUserId }: TIsAllowBid) =>
  isContractor(userTypes) && jobUserId !== userId;
