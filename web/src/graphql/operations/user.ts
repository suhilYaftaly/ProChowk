import { setUserProfile } from "@rSlices/userSlice";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { gql, useApolloClient, useMutation } from "@apollo/client";

const userOps = {
  Queries: {
    searchUser: gql`
      query SearchUser($id: ID!) {
        searchUser(id: $id) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
        }
      }
    `,
    searchAllUsers: gql`
      query SearchAllUsers {
        searchAllUsers {
          id
          name
          # phoneNum
          email
          # emailVerified
          # createdAt
          # updatedAt
          image {
            picture
          }
          # provider
          # roles
          # userType
          # address {
          #   houseNum
          #   road
          #   city
          #   neighbourhood
          #   country
          #   countryCode
          #   province
          #   region
          #   postalCode
          #   municipality
          #   lat
          #   lng
          #   displayName
          # }
        }
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
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
    loginUser: gql`
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
    googleLogin: gql`
      mutation GoogleLogin($accessToken: String!) {
        googleLogin(accessToken: $accessToken) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
    googleOneTapLogin: gql`
      mutation GoogleOneTapLogin($credential: String!) {
        googleOneTapLogin(credential: $credential) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
    updateUser: gql`
      mutation UpdateUser(
        $id: ID!
        $name: String
        $image: ImageInput
        $phoneNum: String
        $address: AddressInput
        $bio: String
        $userType: String
      ) {
        updateUser(
          id: $id
          name: $name
          image: $image
          phoneNum: $phoneNum
          address: $address
          bio: $bio
          userType: $userType
        ) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          userType
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
    getUserAddress: gql`
      mutation GetUserAddress($id: ID!, $lat: String!, $lng: String!) {
        getUserAddress(id: $id, lat: $lat, lng: $lng) {
          id
          name
          phoneNum
          bio
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          provider
          roles
          address {
            houseNum
            road
            city
            neighbourhood
            country
            countryCode
            province
            region
            postalCode
            municipality
            lat
            lng
            displayName
          }
          token
        }
      }
    `,
  },
};
export default userOps;

//INTERFACES
export interface IRegisterUserInput {
  name: string;
  email: string;
  password: string;
}
export interface IRegisterUserData {
  registerUser: IUserData;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}
export interface ILoginUserData {
  loginUser: IUserData;
}

export interface IGoogleLoginInput {
  accessToken: string;
}
export interface IGoogleLoginData {
  googleLogin: IUserData;
}

export interface IGoogleOneTapLoginInput {
  credential: string;
}
export interface IGoogleOneTapLoginData {
  googleOneTapLogin: IUserData;
}

export interface IUserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image: Image;
  token: string;
  provider: string;
  roles?: UserRole[];
  phoneNum?: string;
  bio?: string;
  address?: AddressInput;
  userType?: UserInput[];
}
type UserInput = "client" | "contractor";
type UserRole = "admin" | "superAdmin";
type Image = { picture: string; name?: string; size?: number; type?: string };
interface ImageInput {
  picture: string;
  name?: string;
  size?: number;
  type?: string;
}

export interface AddressInput {
  houseNum?: string;
  road?: string;
  neighbourhood?: string;
  city?: string;
  municipality?: string;
  region?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  displayName?: string;
  lat?: string;
  lng?: string;
}

export interface IGetUserAddressInput {
  id: string;
  lat: string;
  lng: string;
}
export interface IGetUserAddressData {
  getUserAddress: IUserData;
}

export interface ISearchAllUsersData {
  searchAllUsers: IUserData[];
}

export interface ISearchUserInput {
  id: string;
}
export interface ISearchUserData {
  searchUser: IUserData;
}

export interface IUpdateUserInput {
  id: string;
  name?: string;
  image?: ImageInput;
  phoneNum?: string;
  bio?: string;
  address?: AddressInput;
  userType?: UserInput;
}
export interface IUpdateUserData {
  updateUser: IUserData;
}

interface IUseUpdateUser {
  variables: IUpdateUserInput;
  onSuccess?: () => void;
}
export const useUpdateUser = () => {
  const client = useApolloClient();
  const dispatch = useAppDispatch();
  const [updateUser, { data, loading, error }] = useMutation<
    IUpdateUserData,
    IUpdateUserInput
  >(userOps.Mutations.updateUser);

  const updateUserAsync = async ({ onSuccess, variables }: IUseUpdateUser) => {
    try {
      const { data } = await updateUser({ variables });
      if (data?.updateUser) {
        dispatch(setUserProfile(data?.updateUser));
        onSuccess && onSuccess();

        const cachedData = client.readQuery<ISearchUserData, ISearchUserInput>({
          query: userOps.Queries.searchUser,
          variables: { id: variables.id },
        });

        if (cachedData) {
          const modifiedData = { ...cachedData, ...data.updateUser };
          client.writeQuery<ISearchUserData, ISearchUserInput>({
            query: userOps.Queries.searchUser,
            data: modifiedData,
            variables: { id: variables.id },
          });
        }
      } else throw new Error();
    } catch (error: any) {
      console.log("user update failed:", error.message);
    }
  };

  return { updateUserAsync, data, loading, error };
};
