export interface ICommunityPlugin {
  id: number;
  name: string;
  component: string;
  source: string;
  doc: string;
  bugs: string;
  discussion: any;
  lastVersion?: string;
  lastRelease?: string;
  lastReleaseDate?: string;
  supportedMoodles?: string;
  timelastreleased: number;
  versions: IVersion[];
}

export interface IVersion {
  id: number;
  version: string;
  release: string;
  maturity: number;
  downloadurl: string;
  downloadmd5: string;
  vcssystem: string;
  vcssystemother: any;
  vcsrepositoryurl: string;
  vcsbranch: any;
  vcstag?: string;
  timecreated: number;
  supportedmoodles: ISupportedMoodle[];
}

export interface ISupportedMoodle {
  version: number;
  release: string;
}
