import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

import { ISkill, skillGqlResp, SkillInput } from "./skill";
import { asyncOps } from "./gqlFuncs";
import { IUser } from "./user";
import { LatLngInput } from "./address";

const licenseGqlResp = `id name type size url createdAt updatedAt`;
export const contractorGqlResp = `id createdAt updatedAt licenses {${licenseGqlResp}} skills {${skillGqlResp}}`;
const searchContResp = `id name bio image {url} address {city lat lng} contractor {skills {label}}`;

const contOps = {
  Queries: {
    contractor: gql`
      query Contractor($id: ID, $userId: ID) {
        contractor(id: $id, userId: $userId) {${contractorGqlResp}}
      }
    `,
    contractorsByLocation: gql`
    query ContractorsByLocation(
      $latLng: LatLngInput!
      $radius: Float
      $page: Int
      $pageSize: Int
    ) {
      contractorsByLocation(
        latLng: $latLng
        radius: $radius
        page: $page
        pageSize: $pageSize
      ) {totalCount users {${searchContResp}}}
    }
  `,
    contractorsByText: gql`
    query ContractorsByText(
      $input: String!
      $latLng: LatLngInput!
      $radius: Float
      $page: Int
      $pageSize: Int
    ) {
      contractorsByText(
        input: $input
        latLng: $latLng
        radius: $radius
        page: $page
        pageSize: $pageSize
      ) {totalCount users {${searchContResp}}}
    }
  `,
  },
  Mutations: {
    addContractorLicense: gql`
      mutation AddContractorLicense($contId: ID!, $license: LicenseInput!) {
        addContractorLicense(contId: $contId, license: $license) {${contractorGqlResp}}
      }
    `,
    deleteContractorLicense: gql`
      mutation DeleteContractorLicense($contId: ID!, $licId: ID!) {
        deleteContractorLicense(contId: $contId, licId: $licId) {${contractorGqlResp}}
      }
    `,
    updateContractorSkills: gql`
      mutation UpdateContractorSkills(
        $contId: ID!
        $skills: [SkillInput!]!
      ) {
        updateContractorSkills(contId: $contId, skills: $skills) {${contractorGqlResp}}
      }
    `,
  },
};

/**
 * INTERFACES
 */
interface ILicense {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
export interface IContractor {
  id: string;
  createdAt: string;
  updatedAt: string;
  skills: ISkill[];
  licenses: ILicense[];
}
//inputs
export interface LicenseInput {
  name: string;
  size: number;
  type: string;
  url: string;
}

/**
 * OPERATIONS
 */
//contractor op
interface ICInput {
  /**contractor id or userId is required*/
  id?: string;
  /**contractor id or userId is required*/
  userId?: string;
}
interface ICData {
  contractor: IContractor;
}
interface ICIAsync {
  variables: ICInput;
  onSuccess?: (data: IContractor) => void;
  onError?: (error?: any) => void;
}
interface ICIUpdateCache {
  contData: IContractor;
  variables: ICInput;
}
export const useContractor = () => {
  const client = useApolloClient();
  const [contractor, { data, error, loading }] = useLazyQuery<ICData, ICInput>(
    contOps.Queries.contractor
  );

  const contractorAsync = async ({ variables, onSuccess, onError }: ICIAsync) =>
    asyncOps({
      onStart: () => {
        if (!variables.userId && !variables.id)
          throw new Error("contractor id or userId is required");
      },
      operation: () => contractor({ variables }),
      onSuccess: (dt: ICData) => onSuccess && onSuccess(dt.contractor),
      onError,
    });

  const updateCache = ({ contData, variables }: ICIUpdateCache) => {
    const cachedData = client.readQuery<ICData, ICInput>({
      query: contOps.Queries.contractor,
      variables,
    });

    if (cachedData) {
      const updatedData = { ...cachedData, contractor: contData };
      client.writeQuery<ICData, ICInput>({
        query: contOps.Queries.contractor,
        data: updatedData,
        variables,
      });
    } else contractorAsync({ variables });
  };

  return { contractorAsync, updateCache, data, error, loading };
};

interface ContsSearchResponse {
  users: IUser[];
  totalCount: number;
}
//useContractorsByLocation op
interface IContsByLocationData {
  contractorsByLocation: ContsSearchResponse;
}
interface IContsByLocationInput {
  latLng: LatLngInput;
  radius?: number;
  page?: number;
  pageSize?: number;
}
interface IContsByLocationIAsync {
  variables: IContsByLocationInput;
  onSuccess?: (data: ContsSearchResponse) => void;
  onError?: (error?: any) => void;
}
export const useContractorsByLocation = () => {
  const [contractorsByLocation, { data, loading, error }] = useLazyQuery<
    IContsByLocationData,
    IContsByLocationInput
  >(contOps.Queries.contractorsByLocation);

  const contractorsByLocationAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IContsByLocationIAsync) =>
    asyncOps({
      operation: () => contractorsByLocation({ variables }),
      onSuccess: (dt: IContsByLocationData) =>
        onSuccess && onSuccess(dt.contractorsByLocation),
      onError,
    });

  return { contractorsByLocationAsync, data, loading, error };
};

//contractorsByText op
interface IContsByTextData {
  contractorsByText: ContsSearchResponse;
}
interface IContsByTextInput {
  input: string;
  latLng: LatLngInput;
  radius?: number;
  page?: number;
  pageSize?: number;
}
interface IcontractorsByTextIAsync {
  variables: IContsByTextInput;
  onSuccess?: (data: ContsSearchResponse) => void;
  onError?: (error?: any) => void;
}
export const useContractorsByText = () => {
  const [contractorsByText, { data, loading, error }] = useLazyQuery<
    IContsByTextData,
    IContsByTextInput
  >(contOps.Queries.contractorsByText);

  const contractorsByTextAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IcontractorsByTextIAsync) =>
    asyncOps({
      operation: () => contractorsByText({ variables }),
      onSuccess: (dt: IContsByTextData) => {
        onSuccess && onSuccess(dt.contractorsByText);
      },
      onError,
    });

  return { contractorsByTextAsync, data, loading, error };
};

//addContractorLicense op
interface IACLInput {
  contId: string;
  license: LicenseInput;
}
interface IACLData {
  addContractorLicense: IContractor;
}
interface IACLIAsync {
  variables: IACLInput;
  onSuccess?: (data: IContractor) => void;
  onError?: (error?: any) => void;
}
export const useAddContractorLicense = () => {
  const [addContractorLicense, { data, error, loading }] = useMutation<
    IACLData,
    IACLInput
  >(contOps.Mutations.addContractorLicense);
  const { updateCache } = useContractor();

  const addContLicAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IACLIAsync) =>
    asyncOps({
      operation: () => addContractorLicense({ variables }),
      onSuccess: (dt: IACLData) => {
        const contData = dt?.addContractorLicense;
        onSuccess && onSuccess(contData);
        updateCache({
          variables: { id: variables.contId },
          contData: contData,
        });
      },
      onError,
    });

  return { addContLicAsync, data, error, loading };
};

//deleteContractorLicense op
interface IDCLInput {
  contId: string;
  licId: string;
}
interface IDCLData {
  deleteContractorLicense: IContractor;
}
interface IDCLIAsync {
  variables: IDCLInput;
  onSuccess?: (data: IContractor) => void;
  onError?: (error?: any) => void;
}
export const useDeleteContractorLicense = () => {
  const [deleteContractorLicense, { data, error, loading }] = useMutation<
    IDCLData,
    IDCLInput
  >(contOps.Mutations.deleteContractorLicense);
  const { updateCache } = useContractor();

  const deleteContLicAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IDCLIAsync) =>
    asyncOps({
      operation: () => deleteContractorLicense({ variables }),
      onSuccess: (dt: IDCLData) => {
        const contData = dt?.deleteContractorLicense;
        onSuccess && onSuccess(contData);
        updateCache({
          variables: { id: variables.contId },
          contData: contData,
        });
      },
      onError,
    });

  return { deleteContLicAsync, data, error, loading };
};

//updateContractorSkills op
interface IUpdtCSInput {
  contId: string;
  skills: SkillInput[];
}
interface IUpdtCSData {
  updateContractorSkills: IContractor;
}
interface IUpdtCSAsync {
  variables: IUpdtCSInput;
  onSuccess?: (data: IContractor) => void;
  onError?: (error?: any) => void;
}
export const useUpdateContSkills = () => {
  const [updateContractorSkills, { data, error, loading }] = useMutation<
    IUpdtCSData,
    IUpdtCSInput
  >(contOps.Mutations.updateContractorSkills);
  const { updateCache, loading: contLoading } = useContractor();

  const updateContSkillsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IUpdtCSAsync) =>
    asyncOps({
      operation: () => updateContractorSkills({ variables }),
      onSuccess: (dt: IUpdtCSData) => {
        const contData = dt?.updateContractorSkills;
        onSuccess && onSuccess(contData);
        updateCache({
          variables: { id: variables.contId },
          contData: contData,
        });
      },
      onError,
    });

  return { updateContSkillsAsync, data, error, loading, contLoading };
};
