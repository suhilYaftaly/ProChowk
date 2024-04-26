import {gql} from 'graphql-tag'

export default gql`
    type Query {
        messages: [Message!]!
    }
    type Message {
        message: String!
        user: String!
    }

`;