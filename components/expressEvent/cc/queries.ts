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
