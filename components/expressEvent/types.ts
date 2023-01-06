export enum ProfileType {
  LENS,
  CC,
  TWITTER,
}

export interface IProfile {
  chainID: number;
  id: string;
  address: string;
  handle: string;
  type: ProfileType;
  isDefault: boolean;
}

export type ProfilesHookProps = {
  address: string | undefined;
};

export type ProfilesHookReturnData = {
  profiles: IProfile[] | undefined;
  defaultProfile: IProfile | undefined;
};

export type ProfilesHook = (props: ProfilesHookProps) => ProfilesHookReturnData;

// export type PostHookProps = {
//   profile: IProfile | undefined;
// };

export type PostHookReturnData = {
  send: any;
  error: object | undefined;
  response: object | undefined;
  status: string;
};

export type PostHook = (props: {
  profile?: IProfile;
  content?: string;
  attachments?: Blob[];
  priceToCollect?: number;
}) => PostHookReturnData;

export type ExpressEventMetadata = {
  title: string;
  details: string;
  profiles: IProfile[];
  v: string;
};
