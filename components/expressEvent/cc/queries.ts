import { gql } from "@apollo/client";

export const getProfiles = gql`
  query getProfilesbyOwner($address: AddressEVM!, $chainID: ChainID!) {
    address(address: $address, chainID: $chainID) {
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
  mutation loginGetMessage(
    $domain: String!
    $address: AddressEVM!
    $chainID: ChainID!
  ) {
    loginGetMessage(
      input: { domain: $domain, address: $address, chainID: $chainID }
    ) {
      message
    }
  }
`;

export const loginVerify = gql`
  mutation loginVerify(
    $domain: String!
    $address: AddressEVM!
    $chainID: ChainID!
    $signature: String!
  ) {
    loginVerify(
      input: {
        domain: $domain
        address: $address
        chainID: $chainID
        signature: $signature
      }
    ) {
      accessToken
    }
  }
`;
