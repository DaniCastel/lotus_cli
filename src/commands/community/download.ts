import path from "path";
import axios from "axios";
import { pluck } from "underscore";
import { Command } from "commander";
import { createObjectCsvWriter } from "csv-writer";

import { TCommunityPlugin, TVersion } from "../../types/CommunityPlugin";

export function registerCommand(program: Command) {
  program
    .command("community")
    .description(
      "Get a CSV with the Moodle Community plugins and their latest version"
    )
    .action(() => {
      getCommunityPlugins();
    });
}

/**
 * Action triggered by community command, it request moodle directory plugin list from moodle
 *
 */
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

/**
 * Create a CSV file and save it in a directory
 *
 * @param plugins - Community plugin
 * @param plugins - directory path
 */
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

    const supportedMoodles = pluck(
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

/**
 * Compare plugin version strings, useful to sort array of version objects
 *
 * @param pluginVersion1 plugin version object
 * @param pluginVersion1 plugin version object
 * @returns -1 if first plugin version is lower than second plugin version, 1 if plugin version is higher than second plugin version, 0 if versions are the same
 */
function compareVersion(pluginVersion1: TVersion, pluginVersion2: TVersion) {
  if (pluginVersion1.version < pluginVersion2.version) {
    return -1;
  }
  if (pluginVersion1.version > pluginVersion2.version) {
    return 1;
  }
  return 0;
}
