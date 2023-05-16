import path from "path";
import axios from "axios";
import _ from "underscore";
import { TCommunityPlugin, TVersion } from "../../types/CommunityPlugin";
import { createObjectCsvWriter } from "csv-writer";

export async function getCommunityPlugins() {
  try {
    console.log("Fetching Moodle directory plugins...");
    const response = await axios.get(`${process.env.MOODLE_API}/pluglist.php`);
    const transformedPlugins = addLastVersionToPlugins(response.data.plugins);
    createCommunityPluginsCSV(transformedPlugins, __dirname);
  } catch (error) {
    console.error("Error occurred fetching plugins", error);
  }
}

export function createCommunityPluginsCSV(
  plugins: TCommunityPlugin[],
  dirname: string
) {
  const writer = createObjectCsvWriter({
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

/**
 * Returns the plugins with the latest version attributes
 *
 * @param plugins - List of plugins with all their versions
 * @returns List of plugins with the new attributes: lastVersion,lastRelease, lastReleaseDate and supportedMoodles
 */
export function addLastVersionToPlugins(plugins: TCommunityPlugin[]) {
  const transformedPlugins = plugins.map((plugin) => {
    const lastVersion = plugin.versions.sort(compareVersion).pop();

    const supportedMoodles = _.pluck(
      lastVersion?.supportedmoodles ?? [],
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

function compareVersion(a: TVersion, b: TVersion) {
  if (a.version < b.version) {
    return -1;
  }
  if (a.version > b.version) {
    return 1;
  }
  return 0;
}
