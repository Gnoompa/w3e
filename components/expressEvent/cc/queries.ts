import { gql } from "@apollo/client";

export const getProfiles = gql`
  query getProfilesbyOwner($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        profiles {
          edges {
            node {
              profileID
              isPrimary
              handle
              avatar
              owner {
                address
              }
              namespace {
                name
                contractAddress
                chainID
              }
            }
          }
        }
      }
    }
  }
`;

export const loginGetMessage = gql`
  mutation loginGetMessage($domain: String!, $address: AddressEVM!) {
    loginGetMessage(input: { domain: $domain, address: $address }) {
      message
    }
  }
`;

export const loginVerify = gql`
  mutation loginVerify(
    $domain: String!
    $address: AddressEVM!
    $signature: String!
  ) {
    loginVerify(
      input: { domain: $domain, address: $address, signature: $signature }
    ) {
      accessToken
    }
  }
`;
