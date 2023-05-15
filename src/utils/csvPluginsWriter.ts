import path from "path";
import { ICommunityPlugin, IVersion } from "../types/CommunityPlugin";

const _ = require("underscore");
const csvWriter = require("csv-writer");

export function filterPluginVersions(plugins: ICommunityPlugin[]) {
  const transformedPlugins = plugins.map((plugin) => {
    const lastVersion = plugin.versions.sort(compareVersion).pop();

    const supportedMoodles = _.pluck(
      lastVersion?.supportedmoodles,
      "release"
    ).join(",");

    const lastReleaseDate = new Date(
      plugin.timelastreleased * 1000
    ).toISOString();
    plugin.lastVersion = lastVersion?.version;
    plugin.lastRelease = lastVersion?.release;
    plugin.lastReleaseDate = lastReleaseDate;
    plugin.supportedMoodles = supportedMoodles;

    return plugin;
  });
  return transformedPlugins;
}

function compareVersion(a: IVersion, b: IVersion) {
  if (a.version < b.version) {
    return -1;
  }
  if (a.version > b.version) {
    return 1;
  }
  return 0;
}

export function createCommunityPluginsCSV(
  plugins: ICommunityPlugin[],
  dirname: string
) {
  const writer = csvWriter.createObjectCsvWriter({
    path: path.resolve(dirname, "plugins.csv"),
    header: [
      { id: "name", title: "Name" },
      { id: "component", title: "Component ID" },
      { id: "lastVersion", title: "Last Version" },
      { id: "lastRelease", title: "Last Release" },
      { id: "supportedMoodles", title: "SupportedMoodles" },
      { id: "lastReleaseDate", title: "Date Last Released" },
      { id: "source", title: "source" },
      { id: "doc", title: "Documentation" },
    ],
  });

  writer.writeRecords(plugins).then(() => {
    console.log(`CSV successfully exported on ${dirname}`);
  });
}
