import { ProfileType } from "./types";
import LensIcon from "public/icons/lens";
import CyberConnectIcon from "public/icons/cyberConnect";
import React from "react";
import { chain } from "wagmi";

export const stables = {
  [chain.polygon.id]: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  [chain.polygonMumbai.id]: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
};

export const profileTypeToExternalLinkMap = {
  [ProfileType.LENS]: {
    profile: (profileHandle) => `https://lenster.xyz/u/${profileHandle}`,
    post: (postId) => `https://lenster.xyz/posts/${postId}`,
  },
  [ProfileType.CC]: {
    profile: (profileHandle) =>
      `https://app.cyberconnect.me/address/${profileHandle}`,
  },
} as {
  [key in ProfileType]: {
    profile: (profileHandle: string) => string;
    post?: (postId: string) => string;
  };
};

export const profileTypeToStylesMap = {
  [ProfileType.LENS]: {
    bg: "lensGradient",
    color: "lensText",
    icon: LensIcon,
  },
  [ProfileType.CC]: {
    bg: "cyberConnectGradient",
    color: "cyberConnectText",
    icon: CyberConnectIcon,
  },
} as {
  [key in ProfileType]: {
    bg: string;
    color: string;
    icon: React.FC;
  };
};
