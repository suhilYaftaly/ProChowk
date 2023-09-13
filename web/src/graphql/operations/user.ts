import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";

import { setUserProfile } from "@rSlices/userSlice";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { IImage, ImageInput } from "@/types/commonTypes";
import { AddressInput, IAddress, addressGqlResp } from "./address";
import { IContractor } from "./contractor";
import { store } from "@redux/store";
import { asyncOps } from "./gqlFuncs";

const { dispatch } = store;

export const userGqlResp = gql`
  ${addressGqlResp}
  fragment UserFields on User {
    id
    name
    phoneNum
    bio
    email
    emailVerified
    createdAt
    updatedAt
    image {
      id
      name
      url
      size
      type
      createdAt
      updatedAt
    }
    provider
    roles
    userTypes
    address {
      ...AddressFields
    }
  }
`;

const userOps = {
  Queries: {
    user: gql`
      ${userGqlResp}
      query User($id: ID!) {
        user(id: $id) {
          ...UserFields
        }
      }
    `,
    users: gql`
      ${userGqlResp}
      query Users {
        users {
          ...UserFields
        }
      }
    `,
  },
  Mutations: {
    registerUser: gql`
      ${userGqlResp}
      mutation RegisterUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        registerUser(name: $name, email: $email, password: $password) {
          ...UserFields
          token
          refreshToken
        }
      }
    `,
    loginUser: gql`
      ${userGqlResp}
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          ...UserFields
          token
          refreshToken
        }
      }
    `,
    googleLogin: gql`
      ${userGqlResp}
      mutation GoogleLogin($accessToken: String!) {
        googleLogin(accessToken: $accessToken) {
          ...UserFields
          token
          refreshToken
        }
      }
    `,
    googleOneTapLogin: gql`
      ${userGqlResp}
      mutation GoogleOneTapLogin($credential: String!) {
        googleOneTapLogin(credential: $credential) {
          ...UserFields
          token
          refreshToken
        }
      }
    `,
    updateUser: gql`
      ${userGqlResp}
      mutation UpdateUser($id: ID!, $edits: UpdateUserInput!) {
        updateUser(id: $id, edits: $edits) {
          ...UserFields
        }
      }
    `,
    sendVerificationEmail: gql`
      mutation SendVerificationEmail($email: String!) {
        sendVerificationEmail(email: $email)
      }
    `,
    verifyEmail: gql`
      mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token)
      }
    `,
    requestPasswordReset: gql`
      mutation RequestPasswordReset($email: String!) {
        requestPasswordReset(email: $email)
      }
    `,
    resetPassword: gql`
      ${userGqlResp}
      mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword) {
          ...UserFields
          token
          refreshToken
        }
      }
    `,
    validateRefreshToken: gql`
      mutation ValidateRefreshToken($refreshToken: String!) {
        validateRefreshToken(refreshToken: $refreshToken) {
          accessToken
          refreshToken
        }
      }
    `,
  },
};
export default userOps;

/**
 * INTERFACES
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image: IImage;
  token: string;
  refreshToken: string;
  provider: Provider;
  roles?: Role[];
  phoneNum?: string;
  bio?: string;
  address?: IAddress;
  userTypes?: UserType[];
  contractor?: IContractor;
}
//inputs
interface UpdateUserInput {
  name?: string;
  phoneNum?: string;
  image?: ImageInput;
  address?: AddressInput;
  bio?: string;
  userTypes?: UserType[];
}
//custom types
export type Role = "user" | "dev" | "admin" | "superAdmin";
type Provider = "Google" | "Credentials";
type UserType = "client" | "contractor";

//operation interfaces
export interface IUsersData {
  users: IUser[];
}

/**
 * OPERATIONS
 */
interface IUserInput {
  id: string;
}
interface IUserData {
  user: IUser;
}
interface IUserIAsync {
  variables: IUserInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useUser = () => {
  const client = useApolloClient();
  const [user, { data, loading, error }] = useLazyQuery<IUserData, IUserInput>(
    userOps.Queries.user
  );

  const userAsync = async ({ variables, onSuccess, onError }: IUserIAsync) =>
    asyncOps({
      operation: () => user({ variables }),
      onSuccess: (dt: IUserData) => onSuccess && onSuccess(dt.user),
      onError,
    });

  const updateCache = (updatedUser: IUser) => {
    const cachedData = client.readQuery<IUserData, IUserInput>({
      query: userOps.Queries.user,
      variables: { id: updatedUser.id },
    });

    if (cachedData) {
      const modifiedData = { ...cachedData, user: updatedUser };
      client.writeQuery<IUserData, IUserInput>({
        query: userOps.Queries.user,
        data: modifiedData,
        variables: { id: updatedUser.id },
      });
      dispatch(setUserProfile(modifiedData.user));
    }
  };

  return { userAsync, updateCache, data, loading, error };
};

interface IUpdateUserInput {
  id: string;
  edits: UpdateUserInput;
}
interface IUpdateUserData {
  updateUser: IUser;
}
interface IUUUAsyncInput {
  variables: IUpdateUserInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error: any) => void;
}
export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const [updateUser, { data, loading, error }] = useMutation<
    IUpdateUserData,
    IUpdateUserInput
  >(userOps.Mutations.updateUser);
  const { updateCache } = useUser();

  const updateUserAsync = async ({
    onSuccess,
    onError,
    variables,
  }: IUUUAsyncInput) =>
    asyncOps({
      operation: () => updateUser({ variables }),
      onSuccess: (dt: IUpdateUserData) => {
        dispatch(setUserProfile(dt?.updateUser));
        onSuccess && onSuccess(dt.updateUser);
        updateCache(dt.updateUser);
      },
      onError,
    });

  return { updateUserAsync, data, loading, error };
};

interface ILoginUserInput {
  email: string;
  password: string;
}
interface ILoginUserData {
  loginUser: IUser;
}
interface IULUAsyncInput {
  variables: ILoginUserInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useLoginUser = () => {
  const [loginUser, { data, loading, error }] = useMutation<
    ILoginUserData,
    ILoginUserInput
  >(userOps.Mutations.loginUser);

  const loginUserAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IULUAsyncInput) =>
    asyncOps({
      operation: () => loginUser({ variables }),
      onSuccess: (dt: ILoginUserData) => onSuccess && onSuccess(dt.loginUser),
      onError,
    });

  return { loginUserAsync, data, loading, error };
};

interface IGoogleLoginInput {
  accessToken: string;
}
interface IGoogleLoginData {
  googleLogin: IUser;
}
interface IGLAsyncInput {
  variables: IGoogleLoginInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useGLogin = () => {
  const [googleLogin, { data, loading, error }] = useMutation<
    IGoogleLoginData,
    IGoogleLoginInput
  >(userOps.Mutations.googleLogin);

  const googleLoginAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IGLAsyncInput) =>
    asyncOps({
      operation: () => googleLogin({ variables }),
      onSuccess: (dt: IGoogleLoginData) =>
        onSuccess && onSuccess(dt.googleLogin),
      onError,
    });

  return { googleLoginAsync, data, loading, error };
};

interface IGoogleOneTapLoginInput {
  credential: string;
}
interface IGoogleOneTapLoginData {
  googleOneTapLogin: IUser;
}
interface IGOTLAsyncInput {
  variables: IGoogleOneTapLoginInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useGOneTapLogin = () => {
  const [googleOneTapLogin, { data, loading, error }] = useMutation<
    IGoogleOneTapLoginData,
    IGoogleOneTapLoginInput
  >(userOps.Mutations.googleOneTapLogin);

  const gOneTapLoginAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IGOTLAsyncInput) =>
    asyncOps({
      operation: () => googleOneTapLogin({ variables }),
      onSuccess: (dt: IGoogleOneTapLoginData) =>
        onSuccess && onSuccess(dt.googleOneTapLogin),
      onError,
    });

  return { gOneTapLoginAsync, data, loading, error };
};

//registerUser op
interface IRegisterUserInput {
  name: string;
  email: string;
  password: string;
}
interface IRegisterUserData {
  registerUser: IUser;
}
interface IRUAsyncInput {
  variables: IRegisterUserInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useRegisterUser = () => {
  const [registerUser, { data, loading, error }] = useMutation<
    IRegisterUserData,
    IRegisterUserInput
  >(userOps.Mutations.registerUser);

  const registerUserAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IRUAsyncInput) =>
    asyncOps({
      operation: () => registerUser({ variables }),
      onSuccess: (dt: IRegisterUserData) =>
        onSuccess && onSuccess(dt.registerUser),
      onError,
    });

  return { registerUserAsync, data, loading, error };
};

//sendVerificationEmail op
interface ISendVEInput {
  email: string;
}
interface ISendVEData {
  sendVerificationEmail: boolean;
}
interface IVEmailAsyncInput {
  variables: ISendVEInput;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
}
export const useSendVerificationEmail = () => {
  const [sendVerificationEmail, { data, loading, error }] = useMutation<
    ISendVEData,
    ISendVEInput
  >(userOps.Mutations.sendVerificationEmail);

  const sendVerificationEmailAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IVEmailAsyncInput) =>
    asyncOps({
      operation: () => sendVerificationEmail({ variables }),
      onSuccess: () => onSuccess && onSuccess(),
      onError,
    });

  return { sendVerificationEmailAsync, data, loading, error };
};

//verifyEmail op
interface IVerifyEmailInput {
  token: string;
}
interface IVerifyEmailData {
  verifyEmail: string;
}
interface IVEAsyncInput {
  variables: IVerifyEmailInput;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
}
export const useVerifyEmail = () => {
  const [verifyEmail, { data, loading, error }] = useMutation<
    IVerifyEmailData,
    IVerifyEmailInput
  >(userOps.Mutations.verifyEmail);

  const verifyEmailAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IVEAsyncInput) =>
    asyncOps({
      operation: () => verifyEmail({ variables }),
      onSuccess: () => onSuccess && onSuccess(),
      onError,
    });

  return { verifyEmailAsync, data, loading, error };
};

//requestPasswordReset op
interface IRPRInput {
  email: string;
}
interface IRPRData {
  requestPasswordReset: boolean;
}
interface IRPRAsyncInput {
  variables: IRPRInput;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
}
export const useRequestPasswordReset = () => {
  const [requestPasswordReset, { data, loading, error }] = useMutation<
    IRPRData,
    IRPRInput
  >(userOps.Mutations.requestPasswordReset);

  const requestPasswordResetAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IRPRAsyncInput) =>
    asyncOps({
      operation: () => requestPasswordReset({ variables }),
      onSuccess: () => onSuccess && onSuccess(),
      onError,
    });

  return { requestPasswordResetAsync, data, loading, error };
};

//resetPassword op
interface IRPInput {
  token: string;
  newPassword: string;
}
interface IRPData {
  resetPassword: IUser;
}
interface IRPAsyncInput {
  variables: IRPInput;
  onSuccess?: (data: IUser) => void;
  onError?: (error?: any) => void;
}
export const useResetPassword = () => {
  const [resetPassword, { data, loading, error }] = useMutation<
    IRPData,
    IRPInput
  >(userOps.Mutations.resetPassword);

  const resetPasswordAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IRPAsyncInput) =>
    asyncOps({
      operation: () => resetPassword({ variables }),
      onSuccess: (dt: IRPData) => onSuccess && onSuccess(dt.resetPassword),
      onError,
    });

  return { resetPasswordAsync, data, loading, error };
};

//validateRefreshToken op
export interface IRefreshTokenInput {
  refreshToken: string;
}
export interface IRefreshTokenData {
  validateRefreshToken: { accessToken: string; refreshToken: string };
}
interface IVRTAsyncInput {
  variables: IRefreshTokenInput;
  onSuccess?: (data: IRefreshTokenData["validateRefreshToken"]) => void;
  onError?: (error?: any) => void;
}
export const useValidateRefreshToken = () => {
  const [validateRefreshToken, { data, loading, error }] = useMutation<
    IRefreshTokenData,
    IRefreshTokenInput
  >(userOps.Mutations.validateRefreshToken);

  const validateRefreshTokenAsync = async ({
    variables,
    onSuccess,
    onError,
  }: IVRTAsyncInput) =>
    asyncOps({
      operation: () => validateRefreshToken({ variables }),
      onSuccess: (dt: IRefreshTokenData) =>
        onSuccess && onSuccess(dt.validateRefreshToken),
      onError,
    });

  return { validateRefreshTokenAsync, data, loading, error };
};
