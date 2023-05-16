export type TCommunityPlugin = {
  id: number;
  name: string;
  component: string;
  source: string;
  doc: string;
  bugs: string;
  discussion: string | null;
  lastVersion?: string;
  lastRelease?: string;
  lastReleaseDate?: string;
  supportedMoodles?: string;
  timelastreleased: number;
  versions: TVersion[];
};

export type TVersion = {
  id: number;
  version: string;
  release: string;
  maturity: number;
  downloadurl: string;
  downloadmd5: string;
  vcssystem: string;
  vcssystemother: string | null;
  vcsrepositoryurl: string;
  vcsbranch: string | null;
  vcstag?: string;
  timecreated: number;
  supportedmoodles: TSupportedMoodle[];
};

export type TSupportedMoodle = {
  version: number;
  release: string;
};
