import { IImage, ImageInput } from '@/types/commonTypes';
import { ApolloClient, gql, useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { IContractor } from './contractor';
import { asyncOps } from './gqlFuncs';

const portfolioImage = `id url`;
const contractorPortfolioFields = `id title description updatedAt images { ${portfolioImage} }`;

const GET_CONTRACTOR_PORTFOLIOS = gql`
  query GetContractorPortfolios($contractorId: ID!) {
    getContractorPortfolios(contractorId: $contractorId) {${contractorPortfolioFields}}
  }
`;

const ADD_CONTRACTOR_PORTFOLIO = gql`
  mutation AddContractorPortfolio(
    $contractorId: ID!
    $title: String!
    $description: String
    $images: [ImageInput!]!
  ) {
    addContractorPortfolio(
      contractorId: $contractorId
      title: $title
      description: $description
      images: $images
    ) {${contractorPortfolioFields}}
  }
`;

const UPDATE_CONTRACTOR_PORTFOLIO = gql`
  mutation UpdateContractorPortfolio(
    $id: ID!
    $title: String!
    $description: String
    $images: [ImageInput!]
  ) {
    updateContractorPortfolio(
      id: $id
      title: $title
      description: $description
      images: $images
    ) {${contractorPortfolioFields}}
  }
`;

const DELETE_CONTRACTOR_PORTFOLIO = gql`
  mutation DeleteContractorPortfolio($id: ID!, $contractorId: ID!) {
    deleteContractorPortfolio(id: $id, contractorId: $contractorId)
  }
`;

export type PortfolioImage = IImage;

export type ContractorPortfolio = {
  id: string;
  title: string;
  description?: string;
  images: PortfolioImage[];
  createdAt?: string;
  updatedAt?: string;
  contractorId?: string;
  contractor?: IContractor;
};

/**
 * Cache Update Utility
 */
type CacheUpdateOptions = {
  client: ApolloClient<object>;
  contractorId: string;
  portfolio?: ContractorPortfolio;
  action: 'add' | 'update' | 'delete';
};

export const updateContractorPortfoliosCache = ({
  client,
  contractorId,
  portfolio,
  action,
}: CacheUpdateOptions) => {
  const existingPortfolios = client.readQuery<GCPData, GCPInput>({
    query: GET_CONTRACTOR_PORTFOLIOS,
    variables: { contractorId },
  });

  if (!existingPortfolios) return;

  let updatedPortfolios: ContractorPortfolio[] = [];

  switch (action) {
    case 'add':
      if (portfolio) {
        updatedPortfolios = [...existingPortfolios.getContractorPortfolios, portfolio];
      }
      break;
    case 'update':
      if (portfolio) {
        updatedPortfolios = existingPortfolios.getContractorPortfolios.map((p) =>
          p.id === portfolio.id ? portfolio : p
        );
      }
      break;
    case 'delete':
      if (portfolio) {
        updatedPortfolios = existingPortfolios.getContractorPortfolios.filter(
          (p) => p.id !== portfolio.id
        );
      }
      break;
  }

  client.writeQuery({
    query: GET_CONTRACTOR_PORTFOLIOS,
    variables: { contractorId },
    data: { getContractorPortfolios: updatedPortfolios },
  });
};

/**
 * OPERATIONS
 */

// getContractorPortfolios op
type GCPInput = { contractorId: string };
type GCPData = { getContractorPortfolios: ContractorPortfolio[] };
interface GCPAsync {
  variables: GCPInput;
  onSuccess?: (data: GCPData['getContractorPortfolios']) => void;
  onError?: (error?: any) => void;
}

export const useContractorPortfolio = () => {
  const [getContractorPortfolios, { data, error, loading }] = useLazyQuery<GCPData, GCPInput>(
    GET_CONTRACTOR_PORTFOLIOS
  );

  const getContractorPortfoliosAsync = async ({ variables, onSuccess, onError }: GCPAsync) =>
    asyncOps({
      operation: () => getContractorPortfolios({ variables }),
      onSuccess: (dt: GCPData) => onSuccess && onSuccess(dt.getContractorPortfolios),
      onError,
    });

  return { getContractorPortfoliosAsync, data, error, loading };
};

// addContractorPortfolio op
type ACPInput = {
  contractorId: string;
  title: string;
  description?: string;
  images: ImageInput[];
};
type ACPData = { addContractorPortfolio: ContractorPortfolio };
interface ACPAsync {
  variables: ACPInput;
  onSuccess?: (data: ACPData['addContractorPortfolio']) => void;
  onError?: (error?: any) => void;
}

export const useAddContractorPortfolio = () => {
  const client = useApolloClient();
  const [addContractorPortfolio, { data, error, loading }] = useMutation<ACPData, ACPInput>(
    ADD_CONTRACTOR_PORTFOLIO
  );

  const addContractorPortfolioAsync = async ({ variables, onSuccess, onError }: ACPAsync) =>
    asyncOps({
      operation: () => addContractorPortfolio({ variables }),
      onSuccess: (dt: ACPData) => {
        updateContractorPortfoliosCache({
          client,
          contractorId: variables.contractorId,
          portfolio: dt.addContractorPortfolio,
          action: 'add',
        });
        onSuccess && onSuccess(dt.addContractorPortfolio);
      },
      onError,
    });

  return { addContractorPortfolioAsync, data, error, loading };
};

// updateContractorPortfolio op
type UCPInput = {
  contractorId: string;
  title: string;
  description?: string;
  images?: ImageInput[];
};
type UCPData = { updateContractorPortfolio: ContractorPortfolio };
interface UCPAsync {
  variables: UCPInput;
  onSuccess?: (data: UCPData['updateContractorPortfolio']) => void;
  onError?: (error?: any) => void;
}

export const useUpdateContractorPortfolio = () => {
  const client = useApolloClient();
  const [updateContractorPortfolio, { data, error, loading }] = useMutation<UCPData, UCPInput>(
    UPDATE_CONTRACTOR_PORTFOLIO
  );

  const updateContractorPortfolioAsync = async ({ variables, onSuccess, onError }: UCPAsync) =>
    asyncOps({
      operation: () => updateContractorPortfolio({ variables }),
      onSuccess: (dt: UCPData) => {
        updateContractorPortfoliosCache({
          client,
          contractorId: variables.contractorId,
          portfolio: dt.updateContractorPortfolio,
          action: 'update',
        });
        onSuccess && onSuccess(dt.updateContractorPortfolio);
      },
      onError,
    });

  return { updateContractorPortfolioAsync, data, error, loading };
};

// deleteContractorPortfolio op
type DCPInput = { id: string; contractorId: string };
interface DCPAsync {
  variables: DCPInput;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
}

export const useDeleteContractorPortfolio = () => {
  const client = useApolloClient();
  const [deleteContractorPortfolio, { data, error, loading }] = useMutation<any, DCPInput>(
    DELETE_CONTRACTOR_PORTFOLIO
  );

  const deleteContractorPortfolioAsync = async ({ variables, onSuccess, onError }: DCPAsync) =>
    asyncOps({
      operation: () => deleteContractorPortfolio({ variables }),
      onSuccess: () => {
        updateContractorPortfoliosCache({
          client,
          contractorId: variables.contractorId,
          portfolio: { id: variables.id } as ContractorPortfolio,
          action: 'delete',
        });
        onSuccess && onSuccess();
      },
      onError,
    });

  return { deleteContractorPortfolioAsync, data, error, loading };
};
