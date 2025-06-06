import { gql, useApolloClient, useLazyQuery, useMutation } from '@apollo/client';

import { setUserProfile } from '@rSlices/userSlice';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { IImage, ImageInput } from '@/types/commonTypes';
import { AddressInput, IAddress } from './address';
import { IContractor } from './contractor';
import { store } from '@redux/store';
import { asyncOps } from './gqlFuncs';
import { SkillInput } from './skill';
import {
  addressFields,
  contractorFields,
  imageFields,
  licenseFields,
  skillFields,
  userFields,
} from '../gqlFrags';

const { dispatch } = store;

const userGqlResp = `${userFields} image {${imageFields}} address {${addressFields}}`;
const contractorGqlResp = `${contractorFields} licenses {${licenseFields}} skills {${skillFields}}`;

const userOps = {
  Queries: {
    user: gql`
      query User($id: ID!) {
        user(id: $id) {${userGqlResp}}
      }
    `,
    users: gql`
      query Users {
        users {${userGqlResp}}
      }
    `,
  },
  Mutations: {
    registerUser: gql`
      mutation RegisterUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        registerUser(name: $name, email: $email, password: $password) {
          ${userGqlResp}
          token
          refreshToken
        }
      }
    `,
    loginUser: gql`
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          ${userGqlResp}
          token
          refreshToken
        }
      }
    `,
    googleLogin: gql`
      mutation GoogleLogin($accessToken: String!, $client: GoogleClientType) {
        googleLogin(accessToken: $accessToken, client: $client) {
          ${userGqlResp}
          token
          refreshToken
        }
      }
    `,
    googleOneTapLogin: gql`
      mutation GoogleOneTapLogin($credential: String!) {
        googleOneTapLogin(credential: $credential) {
          ${userGqlResp}
          token
          refreshToken
        }
      }
    `,
    updateUser: gql`
      mutation UpdateUser($id: ID!, $edits: UpdateUserInput!) {
        updateUser(id: $id, edits: $edits) {
          ${userGqlResp}
          contractor {${contractorGqlResp}}
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
      mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword) {
          ${userGqlResp}
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
  token?: string;
  refreshToken?: string;
  provider: Provider;
  roles?: Role[];
  phoneNum?: string;
  bio?: string;
  address?: IAddress;
  userTypes: UserType[];
  contractor?: IContractor;
  averageRating?: number;
}
//inputs
export interface IUpdateUserInput {
  name?: string;
  phoneNum?: string;
  image?: ImageInput;
  address?: AddressInput;
  bio?: string;
  userTypes?: UserType[];
  skills?: SkillInput[];
}
//custom types
export type Role = 'user' | 'dev' | 'admin' | 'superAdmin';
type Provider = 'Google' | 'Credentials';
export type UserType = 'client' | 'contractor';

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

interface IUsersData {
  users: IUser[];
}
interface IUsersIAsync {
  onSuccess?: (data: IUser[]) => void;
  onError?: (error?: any) => void;
}
export const useUsers = () => {
  const [users, { data, loading, error }] = useLazyQuery<IUsersData>(userOps.Queries.users);

  const userAsync = async ({ onSuccess, onError }: IUsersIAsync = {}) =>
    asyncOps({
      operation: () => users(),
      onSuccess: (dt: IUsersData) => onSuccess && onSuccess(dt.users),
      onError,
    });

  return { userAsync, data, loading, error };
};

interface IUpdateUserVars {
  id: string;
  edits: IUpdateUserInput;
}
interface IUpdateUserData {
  updateUser: IUser;
}
interface IUUUAsyncInput {
  variables: IUpdateUserVars;
  onSuccess?: (data: IUser) => void;
  onError?: (error: any) => void;
}
export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const [updateUser, { data, loading, error }] = useMutation<IUpdateUserData, IUpdateUserVars>(
    userOps.Mutations.updateUser
  );
  const { updateCache } = useUser();

  const updateUserAsync = async ({ onSuccess, onError, variables }: IUUUAsyncInput) =>
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
  const [loginUser, { data, loading, error }] = useMutation<ILoginUserData, ILoginUserInput>(
    userOps.Mutations.loginUser
  );

  const loginUserAsync = async ({ variables, onSuccess, onError }: IULUAsyncInput) =>
    asyncOps({
      operation: () => loginUser({ variables }),
      onSuccess: (dt: ILoginUserData) => onSuccess && onSuccess(dt.loginUser),
      onError,
    });

  return { loginUserAsync, data, loading, error };
};

interface IGoogleLoginInput {
  accessToken: string;
  client: string;
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
  const [googleLogin, { data, loading, error }] = useMutation<IGoogleLoginData, IGoogleLoginInput>(
    userOps.Mutations.googleLogin
  );

  const googleLoginAsync = async ({ variables, onSuccess, onError }: IGLAsyncInput) =>
    asyncOps({
      operation: () => googleLogin({ variables }),
      onSuccess: (dt: IGoogleLoginData) => onSuccess && onSuccess(dt.googleLogin),
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

  const gOneTapLoginAsync = async ({ variables, onSuccess, onError }: IGOTLAsyncInput) =>
    asyncOps({
      operation: () => googleOneTapLogin({ variables }),
      onSuccess: (dt: IGoogleOneTapLoginData) => onSuccess && onSuccess(dt.googleOneTapLogin),
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

  const registerUserAsync = async ({ variables, onSuccess, onError }: IRUAsyncInput) =>
    asyncOps({
      operation: () => registerUser({ variables }),
      onSuccess: (dt: IRegisterUserData) => onSuccess && onSuccess(dt.registerUser),
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
  const [sendVerificationEmail, { data, loading, error }] = useMutation<ISendVEData, ISendVEInput>(
    userOps.Mutations.sendVerificationEmail
  );

  const sendVerificationEmailAsync = async ({ variables, onSuccess, onError }: IVEmailAsyncInput) =>
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
  const [verifyEmail, { data, loading, error }] = useMutation<IVerifyEmailData, IVerifyEmailInput>(
    userOps.Mutations.verifyEmail
  );

  const verifyEmailAsync = async ({ variables, onSuccess, onError }: IVEAsyncInput) =>
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
  const [requestPasswordReset, { data, loading, error }] = useMutation<IRPRData, IRPRInput>(
    userOps.Mutations.requestPasswordReset
  );

  const requestPasswordResetAsync = async ({ variables, onSuccess, onError }: IRPRAsyncInput) =>
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
  const [resetPassword, { data, loading, error }] = useMutation<IRPData, IRPInput>(
    userOps.Mutations.resetPassword
  );

  const resetPasswordAsync = async ({ variables, onSuccess, onError }: IRPAsyncInput) =>
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
  onSuccess?: (data: IRefreshTokenData['validateRefreshToken']) => void;
  onError?: (error?: any) => void;
}
export const useValidateRefreshToken = () => {
  const [validateRefreshToken, { data, loading, error }] = useMutation<
    IRefreshTokenData,
    IRefreshTokenInput
  >(userOps.Mutations.validateRefreshToken);

  const validateRefreshTokenAsync = async ({ variables, onSuccess, onError }: IVRTAsyncInput) =>
    asyncOps({
      operation: () => validateRefreshToken({ variables }),
      onSuccess: (dt: IRefreshTokenData) => onSuccess && onSuccess(dt.validateRefreshToken),
      onError,
    });

  return { validateRefreshTokenAsync, data, loading, error };
};
