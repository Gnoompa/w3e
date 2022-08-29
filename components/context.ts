// todo make into global provider with a hook

import { createContext } from "react";
import { NFTStorage } from "nft.storage";

const NFTStorageClient = new NFTStorage({
  token: process.env.nftStorageToken!,
});

export const contextInitialValue = {
  NFTStorageClient,
};

export const context = createContext(contextInitialValue);
