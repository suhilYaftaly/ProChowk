import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { IJob, searchJobGqlResp, useJob } from "./job";
import { IContractor } from "./contractor";
import { asyncOps } from "./gqlFuncs";
import { jobBidFields } from "../gqlFrags";

//request must be same in most cases for caching purposes
const bidGqlResp = `${jobBidFields} job {${searchJobGqlResp}} contractor {user {id name image {url}}}`;

const jobBidOps = {
  Queries: {
    getBid: gql`query GetBid($bidId: ID!) {getBid(bidId: $bidId) {${bidGqlResp}}}`,
    getBids: gql`query GetBids($filter: GetBidFilterInput!) {getBids(filter: $filter) {${bidGqlResp}}}`,
  },
  Mutations: {
    placeBid: gql`mutation PlaceBid($input: PlaceBidInput!) {placeBid(input: $input) {${bidGqlResp}}}`,
    acceptBid: gql`mutation AcceptBid($bidId: ID!) {acceptBid(bidId: $bidId) {${bidGqlResp}}}`,
    rejectBid: gql`mutation RejectBid($bidId: ID!, $rejectionReason: String)
        {rejectBid(bidId: $bidId, rejectionReason: $rejectionReason) {${bidGqlResp}}}`,
    completeBid: gql`mutation CompleteBid($bidId: ID!) {completeBid(bidId: $bidId) {${bidGqlResp}}}`,
  },
};

//INTERACES
type JobBidStatus = "Open" | "Accepted" | "Completed" | "Rejected";

export type TBid = {
  id: string;
  quote: string;
  startDate?: string;
  endDate?: string;
  proposal?: string;
  rejectionReason?: string;
  agreementAccepted?: boolean;
  status?: JobBidStatus;
  createdAt?: string;
  updatedAt?: string;
  jobId?: string;
  contractorId?: string;
  job?: IJob;
  contractor?: IContractor;
};

//OPERATIONS
//getBid OP
type TGetBidData = { getBid: TBid };
type TGetBidInput = { bidId: string };
type TGetBidAsync = {
  variables: TGetBidInput;
  onSuccess?: (data: TGetBidData["getBid"]) => void;
  onError?: (error?: any) => void;
};
export const useGetBid = () => {
  const [getBid, { data, loading, error }] = useLazyQuery<
    TGetBidData,
    TGetBidInput
  >(jobBidOps.Queries.getBid);

  const getBidAsync = async ({ variables, onSuccess, onError }: TGetBidAsync) =>
    asyncOps({
      operation: () => getBid({ variables }),
      onSuccess: (dt: TGetBidData) => onSuccess && onSuccess(dt.getBid),
      onError,
    });

  return { getBidAsync, data, loading, error };
};

//getBids OP
type TGetBidsData = { getBids: TBid[] };
type TGetBidsFilter = {
  jobId?: string;
  contractorId?: string;
  userId?: string;
};
type TGetBidsInput = { filter: TGetBidsFilter };
type TGetBidsAsync = {
  variables: TGetBidsInput;
  onSuccess?: (data: TGetBidsData["getBids"]) => void;
  onError?: (error?: any) => void;
};
export const useGetBids = () => {
  const query = jobBidOps.Queries.getBids;
  const [getBids, { data, loading, error }] = useLazyQuery<
    TGetBidsData,
    TGetBidsInput
  >(query);

  const client = useApolloClient();

  const getBidsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TGetBidsAsync) =>
    asyncOps({
      operation: () => getBids({ variables }),
      onSuccess: (dt: TGetBidsData) => onSuccess && onSuccess(dt.getBids),
      onError,
    });

  const updateBidsCache = (newBid: TBid, variables: TGetBidsInput) => {
    const existingBidsData = client.readQuery<TGetBidsData, TGetBidsInput>({
      query: jobBidOps.Queries.getBids,
      variables,
    });

    const updatedBids = existingBidsData
      ? [...existingBidsData.getBids, newBid]
      : [newBid];

    client.writeQuery<TGetBidsData>({
      query: jobBidOps.Queries.getBids,
      variables,
      data: { getBids: updatedBids },
    });
  };

  return { getBidsAsync, updateBidsCache, data, loading, error };
};

//placeBid OP
type TPlaceBidData = { placeBid: TBid };
type TPlaceBidInputProp = {
  jobId: string;
  contractorId: string;
  quote: number;
  startDate: string;
  endDate?: string;
  proposal?: string;
  agreementAccepted: boolean;
};
type TPlaceBidInput = { input: TPlaceBidInputProp };
type TPlaceBidAsync = {
  variables: TPlaceBidInput;
  onSuccess?: (data: TPlaceBidData["placeBid"]) => void;
  onError?: (error?: any) => void;
};
export const usePlaceBid = () => {
  const [placeBid, { data, loading, error }] = useMutation<
    TPlaceBidData,
    TPlaceBidInput
  >(jobBidOps.Mutations.placeBid);

  const { updateBidsCache } = useGetBids();

  const placeBidAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TPlaceBidAsync) =>
    asyncOps({
      operation: () => placeBid({ variables }),
      onSuccess: (dt: TPlaceBidData) => {
        const jobId = variables.input.jobId;
        const contractorId = variables.input.contractorId;

        //different filters to update BidThisJob cache
        updateBidsCache(dt.placeBid, { filter: { jobId, contractorId } });
        //different filters to update UserJobTypes cache
        updateBidsCache(dt.placeBid, { filter: { contractorId } });

        onSuccess && onSuccess(dt.placeBid);
      },
      onError,
    });

  return { placeBidAsync, data, loading, error };
};

//acceptBid OP
type TAcceptBidData = { acceptBid: TBid };
type TAcceptBidInput = { bidId: string };
type TAcceptBidAsync = {
  variables: TAcceptBidInput;
  onSuccess?: (data: TAcceptBidData["acceptBid"]) => void;
  onError?: (error?: any) => void;
};
export const useAcceptBid = () => {
  const [acceptBid, { data, loading, error }] = useMutation<
    TAcceptBidData,
    TAcceptBidInput
  >(jobBidOps.Mutations.acceptBid);

  const { updateCache } = useJob();

  const acceptBidAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TAcceptBidAsync) =>
    asyncOps({
      operation: () => acceptBid({ variables }),
      onSuccess: (dt: TAcceptBidData) => {
        const bid = dt.acceptBid;

        if (bid?.job) updateCache(bid.job);
        onSuccess && onSuccess(bid);
      },
      onError,
    });

  return { acceptBidAsync, data, loading, error };
};

//rejectBid OP
type TRejectBidData = { rejectBid: TBid };
type TRejectBidInput = { bidId: string; rejectionReason?: string };
type TRejectBidAsync = {
  variables: TRejectBidInput;
  onSuccess?: (data: TRejectBidData["rejectBid"]) => void;
  onError?: (error?: any) => void;
};
export const useRejectBid = () => {
  const [rejectBid, { data, loading, error }] = useMutation<
    TRejectBidData,
    TRejectBidInput
  >(jobBidOps.Mutations.rejectBid);

  // const { updateBidsCache } = useGetBids();

  const rejectBidAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TRejectBidAsync) =>
    asyncOps({
      operation: () => rejectBid({ variables }),
      onSuccess: (dt: TRejectBidData) => {
        // const bid = dt.rejectBid;
        // const jobId = bid?.jobId;
        // updateBidsCache(bid, { filter: { jobId } });
        onSuccess && onSuccess(dt.rejectBid);
      },
      onError,
    });

  return { rejectBidAsync, data, loading, error };
};

//completeBid OP
type TCompleteBidData = { completeBid: TBid };
type TCompleteBidInput = { bidId: string };
type TCompleteBidAsync = {
  variables: TCompleteBidInput;
  onSuccess?: (data: TCompleteBidData["completeBid"]) => void;
  onError?: (error?: any) => void;
};
export const useCompleteBid = () => {
  const [completeBid, { data, loading, error }] = useMutation<
    TCompleteBidData,
    TCompleteBidInput
  >(jobBidOps.Mutations.completeBid);

  const { updateCache } = useJob();

  // const { updateBidsCache } = useGetBids();

  const completeBidAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TCompleteBidAsync) =>
    asyncOps({
      operation: () => completeBid({ variables }),
      onSuccess: (dt: TCompleteBidData) => {
        const bid = dt.completeBid;
        // const jobId = bid?.jobId;
        // updateBidsCache(bid, { filter: { jobId } });

        if (bid?.job) updateCache(bid.job);
        onSuccess && onSuccess(bid);
      },
      onError,
    });

  return { completeBidAsync, data, loading, error };
};
