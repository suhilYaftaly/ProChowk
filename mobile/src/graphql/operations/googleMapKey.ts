import { gql } from "@apollo/client";

const gMapKeyOps = {
  Queries: {
    getGoogleMapKey: gql`
      query GetGoogleMapKey {
        getGoogleMapKey
      }
    `,
  },
};

export default gMapKeyOps;
