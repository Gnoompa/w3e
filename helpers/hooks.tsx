import axios from "axios";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import FacebookIcon from "../public/icons/facebook";
import InstagramIcon from "../public/icons/insta";
import SiteIcon from "../public/icons/site";
import TelegramIcon from "../public/icons/tg";
import TwitterIcon from "../public/icons/twitter";
import { generateMediaPlaceholder } from "./hooks/mediaPlaceholderGenerator";
import { Routes } from "./routes";

export const defaultDateFormat = "ddd, MMM DD YYYY";
export const defaultTimeFormat = "hh:mm A";
export const defaulyIPFSgateway = /.*test|localhost.*/.test(
  global.location?.href
)
  ? "https://api.test.web3events.ai/media/"
  : "https://api.web3events.ai/media/";

export enum SocialMediaIds {
  Twitter = "twitter",
  Facebook = "facebook",
  Instagram = "instagram",
  Telegram = "telegram",
  Site = "site",
}

export const socialMediaIdToComponentMap = {
  [SocialMediaIds.Twitter]: <TwitterIcon />,
  [SocialMediaIds.Instagram]: <InstagramIcon />,
  [SocialMediaIds.Facebook]: <FacebookIcon />,
  [SocialMediaIds.Telegram]: <TelegramIcon width="1.25rem" />,
  [SocialMediaIds.Site]: <SiteIcon width="1.25rem" />,
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function getIsTestInstanse(): Boolean {
  return /.*test|localhost.*/.test(global.location?.href);
}

export function useScrollShadow(element: HTMLElement | null): boolean {
  const [shouldShowShadow, setShouldShowShadow] = useState(
    !!element?.scrollTop
  );

  useEffect(() => {
    element &&
      (element.onscroll = () => setShouldShowShadow(!!element.scrollTop));
  }, [element]);

  return shouldShowShadow;
}

export const getRouterQuery = (routePath: string) =>
  [...new URL(`d:dummy?${routePath.split("?")[1]}`).searchParams.entries()]
    .map((entry) => ({ [entry[0]]: entry[1] }))
    .reduce((a, b) => ({ ...a, ...b }), []);

export function useRouterQuery<T = Record<string, any>>(router: NextRouter): T {
  const getRouterQuery = (routePath: string): T =>
    [...new URL(`d:dummy?${routePath.split("?")[1]}`).searchParams.entries()]
      .map((entry) => ({ [entry[0]]: entry[1] }))
      .reduce((a, b) => ({ ...a, ...b }), []) as T;

  const [query, setQuery] = useState<T>(getRouterQuery(router.asPath));

  useEffect(() => {
    setQuery(getRouterQuery(router.asPath));
  }, [router.asPath]);

  return query;
}

export function handleOnMouseDown(
  event: React.MouseEvent<HTMLElement>,
  cb: CallableFunction
): void {
  event.button == 0 && cb();
}

export function formatWalletAddress(address: string): string {
  return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : "";
}

export const uploadMediaToIpfs = async (media: File) => {
  const uploadUrl = /.*test|localhost.*/.test(global.location?.href)
    ? "https://api.test.web3events.ai/upload"
    : "https://api.web3events.ai/upload";

  let metadataImageFormData = new FormData();

  metadataImageFormData.append(
    "file",
    media,
    `metadataImage_${+Date.now()}.${media.type.split("/")[1]}`
  );

  const imageUploadResponse = await axios.post(
    uploadUrl,
    metadataImageFormData
  );

  return `ipfs://${imageUploadResponse.data.data.ipfs}`;
};

export const uploadMetadata = async (metadata: object) => {
  const uploadUrl = /.*test|localhost.*/.test(global.location?.href)
    ? "https://api.test.web3events.ai/upload"
    : "https://api.web3events.ai/upload";

  // const uploadUrl = "https://api.test.web3events.ai/upload";

  let imageUploadResponse = undefined;

  if (metadata.image && typeof metadata.image == "object") {
    let metadataImageFormData = new FormData();

    metadataImageFormData.append(
      "file",
      metadata.image,
      `metadataImage_${+Date.now()}.${
        metadata.image.type.split("/")[1]
      }`.replace(/svg\+xml/, "xml")
    );

    imageUploadResponse = await axios.post(uploadUrl, metadataImageFormData);
  }

  let metadataFormData = new FormData();

  metadataFormData.append(
    "file",
    new Blob(
      [
        JSON.stringify({
          ...metadata,
          image: imageUploadResponse
            ? `ipfs://${imageUploadResponse?.data.data.ipfs}`
            : metadata.image,
          ...(imageUploadResponse
            ? {
                imagePlaceholder: await generateMediaPlaceholder(
                  metadata.image
                ),
              }
            : {}),
        }),
      ],
      { type: "application/json" }
    ),
    `metadata_${+Date.now()}.json`
  );

  const metadataUploadResponse = await axios.post(uploadUrl, metadataFormData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return `ipfs://${metadataUploadResponse.data.data.ipfs}`;
};

export function getIPFSUri(
  did: string,
  gateway: string = defaulyIPFSgateway
): string | undefined {
  return did?.replace?.(/(ipfs:\/\/)|(https:\/\/ipfs.io\/ipfs\/)/, gateway);
}

export const getMetadataAttribute = (
  { attributes }: EventMetadata,
  attributeName: string
): string | undefined =>
  attributes?.filter((attribute) =>
    [attribute?.trait_type, attribute?.non_standard_trait_type].includes(
      attributeName
    )
  )[0]?.value;

export const getPageRouteURLEndpoint = (route: Routes) =>
  /http(s?):\/\/localhost.*/.test(global.location?.href)
    ? route
    : `${route}.html`;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
